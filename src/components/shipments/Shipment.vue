<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="m-0">Отгрузка №{{ shipment.number }}</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <button
                v-if="shipment.status === 0"
                @click="del()"
                class="btn btn-sm btn-danger"
                :disabled="!saveButton">
                Удалить документ
            </button>

            <button
                v-if="shipment.status === 0"
                @click="provod()"
                class="btn btn-sm btn-primary ms-2"
                :disabled="!saveButton">
                Провести документ
            </button>

            <button
                v-if="shipment.status === 1"
                @click="unprovod()"
                class="btn btn-sm btn-warning"
                :disabled="!saveButton">
                Отменить проведение
            </button>
        </div>
    </div>

    <Loader v-if="loader"/>

    <div v-if="!loader" class="card mb-4">
        <div class="card-body">
            <p>Контрагент: {{ shipment.contragent.name }}</p>
            <p>Дата: {{ shipment.date }}</p>
            <p>Статус: {{ shipment.status === 1 ? 'проведено' : 'создано' }}</p>
            <p>Маркетплейс: {{ shipment.marketplace }}</p>
            <p class="mb-0">Склад поставки: {{ shipment.wb_office_text }}</p>
        </div>
    </div>

    <div class="card mb-4">
        <div class="card-body">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <label class="form-label">Штрихкод поставки</label>
                    <div class="row">
                        <div class="col-6">
                            <input
                                v-model="shk" :disabled="shipment.shk"
                                type="text"
                                class="form-control w-100">
                        </div>
                        <div class="col-6">
                            <button
                                v-if="!shipment.shk"
                                @click="update()"
                                class="btn btn-outline-primary">
                                Сохранить
                            </button>

                            <button
                                v-if="shipment.shk"
                                @click="printSticker()"
                                class="btn btn-outline-primary">
                                Распечатать стикер
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="!loader" class="card">
        <table class="table table-borderless table-hover mb-0">
            <thead class="border-bottom">
            <tr>
                <th>Наименование</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="box in shipment.boxes">
                <td>
                    {{ box }}
                </td>
                <td class="text-end">
                    <template v-if="shipment.status === 0">
                        <button
                            @click="delBox(box)"
                            class="btn btn-sm btn-outline-danger">
                            <i class="tf-icons ti ti-trash"></i>
                        </button>
                    </template>
                </td>
            </tr>
            <tr v-for="palet in shipment.palets">
                <td>
                    {{ palet }}
                </td>
                <td class="text-end">
                    <template v-if="shipment.status === 0">
                        <button
                            @click="delPalet(palet)"
                            class="btn btn-sm btn-outline-danger">
                            <i class="tf-icons ti ti-trash"></i>
                        </button>
                    </template>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            shipment: {},

            shk: null,

            loader: true,
            saveButton: true,
        }
    },
    created() {
        this.loadShipment()
    },
    methods: {
        loadShipment() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/shipment/${this.$route.params.uuid}`)
                .then(response => {
                    this.shipment = response.data

                    this.shk = response.data.shk

                    this.loader = false
                })
        },
        delBox(box) {
            //
        },
        delPalet(palet) {
            //
        },
        provod() {
            this.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/shipment/${this.$route.params.uuid}/provod`)
                .then(response => {
                    this.loadShipment()

                    this.saveButton = true

                    this.$toast.success('Документ проведен')
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.saveButton = true
                })
        },
        unprovod() {
            this.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/shipment/${this.$route.params.uuid}/unprovod`)
                .then(response => {
                    this.loadShipment()

                    this.saveButton = true

                    this.$toast.success('Проведение документа отменено')
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.saveButton = true
                })
        },
        update() {
            if (!this.shk) {
                return this.$toast.error('Укажите штрихкод поставки')
            }

            axios
                .put(`${import.meta.env.VITE_API_FF_SERVER}/api/shipment/${this.$route.params.uuid}/update`, {
                    shk: this.shk
                })
                .then(response => {
                    this.loadShipment()
                })
        },
        del() {
            if (confirm('Точно удалить документ?')) {
                axios
                    .delete(`${import.meta.env.VITE_API_FF_SERVER}/api/shipment/${this.$route.params.uuid}/delete`)
                    .then(response => {
                        this.$router.push({name: 'Shipments'})
                    })
            }
        },
        printSticker() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/sticker`, {
                    params: {
                        barcode: this.shk,
                    },
                    responseType: 'blob'
                })
                .then(response => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'sticker.pdf');
                    document.body.appendChild(link);
                    link.click();
                })
        },
    },
}
</script>