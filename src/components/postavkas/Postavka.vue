<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="m-0">Поставка №{{ postavka.doc_number }}</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <button
                v-if="postavka.status === 0"
                @click="del()"
                class="btn btn-sm btn-danger"
                :disabled="!saveButton">
                Удалить документ
            </button>

            <button
                v-if="postavka.status === 0"
                @click="provod()"
                class="btn btn-sm btn-primary ms-2"
                :disabled="!saveButton">
                Провести документ
            </button>

            <button
                v-if="postavka.status === 1"
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
            <p>Контрагент: {{ postavka.contragent.name }}</p>
            <p>Дата: {{ $filters.date(postavka.date) }}</p>
            <p class="mb-0">Статус: {{ postavka.status === 1 ? 'проведено' : 'создано' }}</p>
        </div>
    </div>

    <template v-if="!loader">
        <div class="mb-4">
            <button
                @click="tab = 'postup'; editorRaznitsa = null; editorPriem = null"
                class="btn btn-sm me-2"
                :class="tab === 'postup' ? 'btn-primary' : 'btn-outline-primary'">
                Поступления
            </button>

            <button
                @click="tab = 'raznitsa'; editor = null; editorPriem = null"
                class="btn btn-sm me-2"
                :class="tab === 'raznitsa' ? 'btn-primary' : 'btn-outline-primary'">
                Расхождения
            </button>

            <button
                @click="tab = 'priem'; editor = null; editorRaznitsa = null"
                class="btn btn-sm"
                :class="tab === 'priem' ? 'btn-primary' : 'btn-outline-primary'">
                Цена приемки
            </button>
        </div>

        <div v-if="tab === 'postup'" class="card">
            <table class="table table-borderless table-hover mb-0">
                <thead class="border-bottom">
                <tr>
                    <th>Тип</th>
                    <th>Наименование</th>
                    <th>Артикул</th>
                    <th>Размер</th>
                    <th>Бренд</th>
                    <th>Закуп</th>
                    <th>Кол-во</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in postavka.items">
                    <td>{{ item.nomenclature.type }}</td>
                    <td>{{ item.nomenclature.title }}</td>
                    <td>{{ item.nomenclature.vendor_code }}</td>
                    <td>{{ item.nomenclature.tech_size }}</td>
                    <td>{{ item.nomenclature.brand }}</td>
                    <td>{{ item.zakup_price }}</td>
                    <td style="width: 150px;">
                        <span v-if="!editor">{{ item.quantity }}</span>

                        <input
                            v-if="editor === item"
                            v-model="item.quantity" type="number"
                            class="form-control form-control-sm">
                    </td>
                    <td class="text-end">
                        <template v-if="postavka.status === 0">
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

        <div v-if="tab === 'raznitsa'" class="card">
            <table class="table table-borderless table-hover mb-0">
                <thead class="border-bottom">
                <tr>
                    <th>Тип</th>
                    <th>Наименование</th>
                    <th>Артикул</th>
                    <th>Размер</th>
                    <th>Бренд</th>
                    <th>Разница</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in postavka.items">
                    <td>{{ item.nomenclature.type }}</td>
                    <td>{{ item.nomenclature.title }}</td>
                    <td>{{ item.nomenclature.vendor_code }}</td>
                    <td>{{ item.nomenclature.tech_size }}</td>
                    <td>{{ item.nomenclature.brand }}</td>
                    <td style="width: 150px;">
                        <span v-if="!editorRaznitsa">{{ item.raznitsa }}</span>

                        <input
                            v-if="editorRaznitsa === item"
                            v-model="item.raznitsa" type="number"
                            class="form-control form-control-sm">
                    </td>
                    <td class="text-end">
                        <template v-if="postavka.status === 0">
                            <button
                                v-if="!editorRaznitsa"
                                @click="editItemRaznitsa(item)"
                                class="btn btn-sm btn-outline-warning me-2">
                                <i class="tf-icons ti ti-edit"></i>
                            </button>
                            <button
                                v-if="editorRaznitsa"
                                @click="updateItem(item)"
                                class="btn btn-sm btn-outline-success me-2">
                                <i class="tf-icons ti ti-check"></i>
                            </button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>

        <div v-if="tab === 'priem'" class="card">
            <table class="table table-borderless table-hover mb-0">
                <thead class="border-bottom">
                <tr>
                    <th>Тип</th>
                    <th>Наименование</th>
                    <th>Артикул</th>
                    <th>Размер</th>
                    <th>Бренд</th>
                    <th>Приемка</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in postavka.items">
                    <td>{{ item.nomenclature.type }}</td>
                    <td>{{ item.nomenclature.title }}</td>
                    <td>{{ item.nomenclature.vendor_code }}</td>
                    <td>{{ item.nomenclature.tech_size }}</td>
                    <td>{{ item.nomenclature.brand }}</td>
                    <td style="width: 150px;">
                        <span v-if="!editorPriem">{{ item.priem_price }}</span>

                        <input
                            v-if="editorPriem === item"
                            v-model="item.priem_price" type="number"
                            class="form-control form-control-sm">
                    </td>
                    <td class="text-end">
                        <template v-if="postavka.status === 0">
                            <button
                                v-if="!editorPriem"
                                @click="editItemPriem(item)"
                                class="btn btn-sm btn-outline-warning me-2">
                                <i class="tf-icons ti ti-edit"></i>
                            </button>
                            <button
                                v-if="editorPriem"
                                @click="updateItem(item)"
                                class="btn btn-sm btn-outline-success me-2">
                                <i class="tf-icons ti ti-check"></i>
                            </button>
                        </template>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </template>
</template>

<script>
export default {
    data() {
        return {
            postavka: {},

            loader: true,
            saveButton: true,
            editor: null,
            editorRaznitsa: null,
            editorPriem: null,

            tab: 'postup',
        }
    },
    created() {
        this.loadPostavka()
    },
    methods: {
        loadPostavka() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka/${this.$route.params.uuid}`)
                .then(response => {
                    this.postavka = response.data

                    this.loader = false
                })
        },
        editItem(item) {
            this.editor = item
        },
        editItemRaznitsa(item) {
            this.editorRaznitsa = item
        },
        editItemPriem(item) {
            this.editorPriem = item
        },
        updateItem(item) {
            axios
                .put(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka-item/${item.id}/update`, {
                    quantity: item.quantity,
                    raznitsa: item.raznitsa,
                    priem_price: item.priem_price,
                })
                .then(response => {
                    this.loadPostavka()

                    this.editor = null
                    this.editorRaznitsa = null
                    this.editorPriem = null
                })
                .catch(error => {
                    this.$toast.error(error.response.data)
                })
        },
        delItem(item) {
            if (this.postavka.items.length === 1) {
                return this.$toast.error('Документ поставки не может быть пустой')
            }

            if (confirm('Точно удалить запись?')) {
                axios
                    .delete(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka-item/${item.id}/delete`)
                    .then(response => {
                        this.loadPostavka()
                    })
            }
        },
        provod() {
            this.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka/${this.$route.params.uuid}/provod`)
                .then(response => {
                    this.loadPostavka()

                    this.saveButton = true

                    this.$toast.success('Документ проведен')
                })
        },
        unprovod() {
            this.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka/${this.$route.params.uuid}/unprovod`)
                .then(response => {
                    this.loadPostavka()

                    this.saveButton = true

                    this.$toast.success('Проведение документа отменено')
                })
        },
        del() {
            if (confirm('Точно удалить документ?')) {
                axios
                    .delete(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka/${this.$route.params.uuid}/delete`)
                    .then(response => {
                        this.$router.push({name: 'Postavkas'})
                    })
            }
        },
    },
}
</script>