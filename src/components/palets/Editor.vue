<template>
    <h4 class="py-3 mb-4">Новая палета</h4>

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
                                @change="boxes = []"
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
                                @change="boxes = []"
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
                </div>
            </div>
        </div>

        <button @click="openBoxSelector()" class="btn btn-primary mb-4">Добавить коробку</button>

        <div class="card mt-4">
            <table class="table table-borderless table-hover mb-0">
                <thead class="border-bottom">
                <tr>
                    <th>Наименование</th>
                    <th>Артикул</th>
                    <th>Себес</th>
                    <th>Кол-во</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="box in boxes">
                    <tr>{{box.id}}</tr>
                </tr>
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-end mt-2 text-muted lh-1">
            <ul class="d-flex list-unstyled">
                <li>Всего позиций: {{ boxes.length }}</li>
                <li class="ms-4">Всего кол-во: {{ totalQuantity }}</li>
            </ul>
        </div>

        <BoxSelector
            v-if="views.boxSelector && selected.contragent"
            :contragent="selected.contragent"
            @add-box-to-palet="addBoxToPalet"
        />

        <button @click="save()" class="btn btn-primary">Сохранить палету</button>
    </template>
</template>

<script>
import BoxSelector from './BoxSelector.vue'
import dayjs from "dayjs";

export default {
    data() {
        return {
            contragents: [],
            stocks: [],

            boxes: [],

            number: 0,

            selected: {
                contragent: null,
                stock: null,
            },

            date: dayjs().locale('ru').utcOffset(3).format('YYYY-MM-DD'),

            views: {
                loading: true,
                saveButton: true,
                boxSelector: false,
            },
        }
    },
    computed: {
        totalQuantity() {
            return this.boxes.reduce(function (acc, obj) { return acc + obj.quantity }, 0)
        },
    },
    created() {
        this.getDocNumber()
    },
    methods: {
        getDocNumber() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/palets-get-number`)
                .then(response => {
                    this.number = response.data

                    this.loadContragents()
                })
        },
        loadContragents() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/contragents`)
                .then(response => {
                    if (response.data) {
                        this.contragents = response.data
                    }

                    this.loadStocks()
                })
        },
        loadStocks() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/stocks`)
                .then(response => {
                    if (response.data) {
                        this.stocks = response.data

                        this.selected.stock = response.data[0].uuid
                    }

                    this.views.loading = false
                })
        },
        openBoxSelector() {
            if (!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            this.views.boxSelector = true
        },
        addBoxToPalet(box) {
            let isBoxIsAlreadyAdded = this.boxes.find(b => b.id === box.id)

            if (isBoxIsAlreadyAdded) {
                return this.$toast.error('Коробка уже добавлена')
            }

            this.boxes.push({
                id: box.id,
            })
        },
        save() {
            if(!this.selected.stock) {
                return this.$toast.error('Укажите склад')
            }

            if(!this.number || this.number === 0) {
                return this.$toast.error('Укажите номер документа')
            }

            if(!this.boxes.length) {
                return this.$toast.error('Палета не может быть пустой')
            }

            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/palets`, {
                    contragent: this.selected.contragent,
                    stock: this.selected.stock,
                    number: this.number,
                    boxes: this.boxes
                })
                .then(response => {
                    this.$router.push({name: 'Palet', params: {uuid: response.data}})
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.views.saveButton = true
                })
        },
    },
    components: {
        BoxSelector,
    },
}
</script>