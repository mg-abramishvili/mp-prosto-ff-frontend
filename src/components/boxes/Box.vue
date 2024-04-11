<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="m-0">Коробка №{{ box.number }}</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <button
                v-if="box.status === 0"
                @click="del()"
                class="btn btn-sm btn-danger"
                :disabled="!saveButton">
                Удалить документ
            </button>

            <button
                v-if="box.status === 0"
                @click="provod()"
                class="btn btn-sm btn-primary ms-2"
                :disabled="!saveButton">
                Провести документ
            </button>

            <button
                v-if="box.status === 1"
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
            <p>Контрагент: {{ box.contragent.name }}</p>
            <p class="mb-0">Статус: {{ box.status === 1 ? 'проведено' : 'создано' }}</p>
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
            <tr v-for="item in box.items">
                <td>
                    {{ item.size.product.title }} - {{ item.size.tech_size }} - {{ item.barcode }}
                </td>
                <td style="width: 150px;">
                    <span v-if="!editor">{{ item.quantity }}</span>

                    <input
                        v-if="editor === item"
                        v-model="item.quantity" type="number"
                        class="form-control form-control-sm">
                </td>
                <td class="text-end">
                    <template v-if="box.status === 0">
                        <button
                            v-if="!editor"
                            @click="editItem(item)"
                            class="btn btn-sm btn-outline-warning me-2">
                            <i class="tf-icons ti ti-edit"></i>
                        </button>
                        <button
                            v-if="editor"
                            @click="updateItem(item)"
                            class="btn btn-sm btn-outline-success me-2">
                            <i class="tf-icons ti ti-check"></i>
                        </button>
                        <button
                            @click="delItem(item)"
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
            box: {},

            loader: true,
            saveButton: true,
            editor: null,
        }
    },
    created() {
        this.loadBox()
    },
    methods: {
        loadBox() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/box/${this.$route.params.uuid}`)
                .then(response => {
                    this.box = response.data

                    this.loader = false
                })
        },
        editItem(item) {
            this.editor = item
        },
        updateItem(item) {
            axios
                .put(`${import.meta.env.VITE_API_FF_SERVER}/api/box-item/${item.id}/update`, {
                    quantity: item.quantity
                })
                .then(response => {
                    this.loadBox()

                    this.editor = null
                })
        },
        delItem(item) {
            if (this.box.items.length === 1) {
                return this.$toast.error('Коробка не может быть пустой')
            }

            if (confirm('Точно удалить запись?')) {
                axios
                    .delete(`${import.meta.env.VITE_API_FF_SERVER}/api/box-item/${item.id}/delete`)
                    .then(response => {
                        this.loadBox()
                    })
            }
        },
        provod() {
            this.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/box/${this.$route.params.uuid}/provod`)
                .then(response => {
                    this.loadBox()

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
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/box/${this.$route.params.uuid}/unprovod`)
                .then(response => {
                    this.loadBox()

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
                    .delete(`${import.meta.env.VITE_API_FF_SERVER}/api/box/${this.$route.params.uuid}/delete`)
                    .then(response => {
                        this.$router.push({name: 'Boxes'})
                    })
            }
        },
    },
}
</script>