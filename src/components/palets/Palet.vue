<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="m-0">Палета №{{ palet.number }}</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <button
                v-if="palet.status === 0"
                @click="del()"
                class="btn btn-sm btn-danger"
                :disabled="!saveButton">
                Удалить документ
            </button>

            <button
                v-if="palet.status === 0"
                @click="provod()"
                class="btn btn-sm btn-primary ms-2"
                :disabled="!saveButton">
                Провести документ
            </button>

            <button
                v-if="palet.status === 1"
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
            <p>Контрагент: {{ palet.contragent.name }}</p>
            <p class="mb-0">Статус: {{ palet.status === 1 ? 'проведено' : 'создано' }}</p>
        </div>
    </div>

    <div v-if="!loader" class="card">
        <table class="table table-borderless table-hover mb-0">
            <thead class="border-bottom">
            <tr>
                <th>Наименование</th>
                <th>Кол-во</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="box in palet.boxes">
                <td>
                    {{ box.id }}
                </td>
                <td class="text-end">
                    <template v-if="palet.status === 0">
                        <button
                            @click="delItem(box)"
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
            palet: {},

            loader: true,
            saveButton: true,
            editor: null,
        }
    },
    created() {
        this.loadPalet()
    },
    methods: {
        loadPalet() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/palet/${this.$route.params.uuid}`)
                .then(response => {
                    this.palet = response.data

                    this.loader = false
                })
        },
        delItem(item) {
            if (this.palet.boxes.length === 1) {
                return this.$toast.error('Палета не может быть пустой')
            }

            if (confirm('Точно удалить запись?')) {
                axios
                    .delete(`${import.meta.env.VITE_API_FF_SERVER}/api/palet-item/${box.id}/delete`)
                    .then(response => {
                        this.loadPalet()
                    })
            }
        },
        provod() {
            this.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/palet/${this.$route.params.uuid}/provod`)
                .then(response => {
                    this.loadPalet()

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
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/palet/${this.$route.params.uuid}/unprovod`)
                .then(response => {
                    this.loadPalet()

                    this.saveButton = true

                    this.$toast.success('Проведение документа отменено')
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.saveButton = true
                })
        },
        del() {
            if (confirm('Точно удалить документ?')) {
                axios
                    .delete(`${import.meta.env.VITE_API_FF_SERVER}/api/palet/${this.$route.params.uuid}/delete`)
                    .then(response => {
                        this.$router.push({name: 'Palets'})
                    })
            }
        },
    },
}
</script>