<template>
    <h4 class="py-3 mb-4">Новая поставка</h4>

    <Loader v-if="views.loading"/>

    <template v-if="!views.loading">
        <div class="card mb-4">
            <div class="card-body">
                <div class="row">
                    <div class="col-12 col-lg-3">
                        <div class="mb-4">
                            <label class="form-label">Склад</label>
                            <select
                                v-model="selected.stock"
                                @change="nomenclatures = []"
                                class="form-select">
                                <option v-for="stock in stocks" :value="stock.uuid">
                                    {{ stock.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="mb-4">
                            <label class="form-label">Контрагент</label>
                            <select
                                v-model="selected.contragent"
                                @change="nomenclatures = []"
                                class="form-select">
                                <option v-for="contragent in contragents" :value="contragent.uuid">
                                    {{ contragent.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="mb-4">
                            <label class="form-label">№ документа</label>
                            <input v-model="number" type="number" class="form-control">
                        </div>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="mb-4">
                            <label class="form-label">Дата поставки</label>
                            <input v-model="date" type="date" class="form-control">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button @click="openNomenclatureSelector()" class="btn btn-primary mb-4">Добавить позицию</button>

        <div class="card mt-4">
            <table class="table table-borderless table-hover mb-0">
                <thead class="border-bottom">
                <tr>
                    <th>Тип</th>
                    <th>Наименование</th>
                    <th>Артикул</th>
                    <th>Себес</th>
                    <th>Кол-во</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="nomenclature in nomenclatures">
                    <NomenclatureRow
                        v-if="nomenclature.id"
                        :nomenclature="nomenclature"
                    />
                </tr>
                <NomenclatureCreator
                    v-if="nomenclaturesCreator"
                    :size="nomenclaturesCreator"
                    :contragent="selected.contragent"
                    @add-nomenclature="addNomenclatureToPostavka"
                    @close-creator="nomenclaturesCreator = null"
                />
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-end mt-2 text-muted lh-1">
            <ul class="d-flex list-unstyled">
                <li>Всего позиций: {{ nomenclatures.length }}</li>
                <li class="ms-4">Всего кол-во: {{ totalQuantity }}</li>
            </ul>
        </div>

        <NomenclatureSelector
            v-if="views.nomenclaturesSelector && selected.contragent"
            :contragent="selected.contragent"
            @add-nomenclature-to-postavka="addNomenclatureToPostavka"
            @add-nomenclatures-from-size-to-postavka="addNomenclaturesFromSizeToPostavka"
        />

        <button @click="save()" class="btn btn-primary">Сохранить поставку</button>
    </template>
</template>

<script>
import NomenclatureSelector from './NomenclatureSelector.vue'
import NomenclatureRow from './Editor/Row.vue'
import NomenclatureCreator from './Editor/Creator.vue'
import dayjs from "dayjs";

export default {
    data() {
        return {
            contragents: [],
            stocks: [],

            nomenclatures: [],

            number: 0,

            selected: {
                contragent: null,
                stock: null,
            },

            date: dayjs().locale('ru').utcOffset(3).format('YYYY-MM-DD'),

            nomenclaturesCreator: null,

            views: {
                loading: true,
                saveButton: true,
                nomenclaturesSelector: false,
            },
        }
    },
    computed: {
        totalQuantity() {
            return this.nomenclatures
                .reduce(function (acc, obj) {
                    return acc + obj.quantity
                }, 0)
        },
    },
    created() {
        this.getDocNumber()
    },
    methods: {
        getDocNumber() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-postavkas-get-number`)
                .then(response => {
                    this.number = response.data

                    this.loadFFContragents()
                })
        },
        loadFFContragents() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-contragents`)
                .then(response => {
                    if (response.data) {
                        this.contragents = response.data
                    }

                    this.loadStocks()
                })
        },
        loadStocks() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-stocks`)
                .then(response => {
                    if (response.data) {
                        this.stocks = response.data

                        this.selected.stock = response.data[0].uuid
                    }

                    this.views.loading = false
                })
        },
        openNomenclatureSelector() {
            if (!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            this.views.nomenclaturesSelector = true
        },
        addNomenclatureToPostavka(nomenclature) {
            let isNomenclatureIsAlreadyAdded = this.nomenclatures.find(n => n.id === nomenclature.id)

            if (isNomenclatureIsAlreadyAdded) {
                return this.$toast.error('Номенклатура уже добавлена')
            }

            this.nomenclatures.push({
                id: nomenclature.id,
                type: nomenclature.type,
                title: nomenclature.title,
                vendor_code: nomenclature.vendor_code,
                cost_price: nomenclature.cost_price,
                quantity: 1,
            })
        },
        addNomenclaturesFromSizeToPostavka(size) {
            if (!size.nomenclatures.length) {
                if (confirm('У товара нет номенклатуры. Создать пустую для заполнения?')) {
                    this.nomenclaturesCreator = size
                }

                return
            }

            size.nomenclatures.forEach(nomenclature => {
                this.addNomenclatureToPostavka(nomenclature)
            })
        },
        save() {
            if(!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            if(!this.selected.stock) {
                return this.$toast.error('Укажите склад')
            }

            if(!this.number || this.number === 0) {
                return this.$toast.error('Укажите номер документа')
            }

            if(!this.date) {
                return this.$toast.error('Укажите дату поставки')
            }

            if(!this.nomenclatures.length) {
                return this.$toast.error('Поставка не может быть пустой')
            }

            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_SERVER}/api/ff-postavkas`, {
                    contragent: this.selected.contragent,
                    stock: this.selected.stock,
                    date: this.date,
                    doc_number: this.number,
                    items: this.nomenclatures
                })
                .then(response => {
                    this.$router.push({name: 'Postavka', params: {uuid: response.data}})
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.views.saveButton = true
                })
        },
    },
    components: {
        NomenclatureSelector,
        NomenclatureRow,
        NomenclatureCreator,
    },
}
</script>