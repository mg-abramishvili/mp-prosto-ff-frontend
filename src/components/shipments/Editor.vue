<template>
    <h4 class="py-3 mb-4">Новая отгрузка</h4>

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
                                @change="boxes = []; palets = [];"
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
                            <label class="form-label">Тип поставки</label>
                            <select
                                v-model="selected.type"
                                @change="boxes = []; palets = [];"
                                class="form-select">
                                <option value="box">коробки</option>
                                <option value="palet">палеты</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="mb-4">
                            <label class="form-label">Маркетплейс</label>
                            <select
                                v-model="selected.marketplace"
                                @change="selected.office = null"
                                class="form-select">
                                <option value="wildberries">Wildberries</option>
                                <option value="ozon">Ozon</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="mb-4">
                            <label class="form-label">Склад маркетплейса</label>

                            <button
                                v-if="selected.marketplace === 'wildberries'"
                                @click="views.wbOfficeSelector = true"
                                class="btn btn-outline-secondary d-block">
                                {{ selected.office ? selected.office.name : 'Выбрать' }}
                            </button>

                            <input
                                v-if="selected.marketplace === 'ozon'"
                                v-model="selected.office"
                                type="text"
                                class="form-control">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button
            v-if="selected.type === 'box'"
            @click="openBoxSelector()"
            class="btn btn-primary mb-4">
            Добавить коробку
        </button>

        <button
            v-if="selected.type === 'palet'"
            @click="openPaletSelector()"
            class="btn btn-primary mb-4">
            Добавить палету
        </button>

        <div class="card mt-4">
            <table class="table table-borderless table-hover mb-0">
                <thead class="border-bottom">
                <tr>
                    <th>Наименование</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="box in boxes">
                    <td>{{ box.id }}</td>
                </tr>
                <tr v-for="palet in palets">
                    <td>{{ palet.id }}</td>
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
            @add-box-to-shipment="addBoxToShipment"
        />

        <PaletSelector
            v-if="views.paletSelector && selected.contragent"
            :contragent="selected.contragent"
            @add-palet-to-shipment="addPaletToShipment"
        />

        <WbOfficeSelector v-if="views.wbOfficeSelector"/>

        <button @click="save()" class="btn btn-primary">Сохранить отгрузку</button>
    </template>
</template>

<script>
import BoxSelector from './BoxSelector.vue'
import PaletSelector from './PaletSelector.vue'
import WbOfficeSelector from './WbOfficeSelector.vue'
import dayjs from "dayjs";

export default {
    data() {
        return {
            contragents: [],
            stocks: [],

            boxes: [],
            palets: [],

            wbOffices: [],

            number: 0,

            selected: {
                contragent: null,
                stock: null,
                type: 'box',
                marketplace: 'wildberries',
                office: null,
            },

            date: dayjs().locale('ru').utcOffset(3).format('YYYY-MM-DD'),

            views: {
                loading: true,
                saveButton: true,
                boxSelector: false,
                paletSelector: false,
                wbOfficeSelector: false,
            },
        }
    },
    computed: {
        totalQuantity() {
            return this.boxes.reduce(function (acc, obj) {
                return acc + obj.quantity
            }, 0)
        },
    },
    created() {
        this.getDocNumber()
    },
    methods: {
        s() {
            return s
        },
        getDocNumber() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/shipments-get-number`)
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
        openPaletSelector() {
            if (!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            this.views.paletSelector = true
        },
        addBoxToShipment(box) {
            let isBoxIsAlreadyAdded = this.boxes.find(b => b.id === box.id)

            if (isBoxIsAlreadyAdded) {
                return this.$toast.error('Коробка уже добавлена')
            }

            this.boxes.push({
                id: box.id,
            })
        },
        addPaletToShipment(palet) {
            let isPaletIsAlreadyAdded = this.palets.find(p => p.id === palet.id)

            if (isPaletIsAlreadyAdded) {
                return this.$toast.error('Палета уже добавлена')
            }

            this.palets.push({
                id: palet.id,
            })
        },
        save() {
            if (!this.selected.stock) {
                return this.$toast.error('Укажите склад')
            }

            if (!this.number || this.number === 0) {
                return this.$toast.error('Укажите номер документа')
            }

            if(!this.selected.type) {
                return this.$toast.error('Укажите тип')
            }

            if(!this.selected.marketplace) {
                return this.$toast.error('Укажите маркетплейс')
            }

            if(!this.selected.office) {
                return this.$toast.error('Укажите склад для отправки')
            }

            if (this.selected.type === 'box' && !this.boxes.length) {
                return this.$toast.error('Отгрузка не может быть пустой')
            }

            if (this.selected.type === 'palet' && !this.palets.length) {
                return this.$toast.error('Отгрузка не может быть пустой')
            }

            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/shipments`, {
                    contragent: this.selected.contragent,
                    stock: this.selected.stock,
                    number: this.number,
                    type: this.selected.type,
                    marketplace: this.selected.marketplace,
                    boxes: this.boxes,
                    palets: this.palets,
                    office_id: this.selected.marketplace === 'wildberries' ? this.selected.office.id : null,
                    office_text: this.selected.marketplace === 'wildberries' ? this.selected.office.name + ' - ' + this.selected.office.address : this.selected.office,
                })
                .then(response => {
                    this.$router.push({name: 'Shipment', params: {uuid: response.data}})
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.views.saveButton = true
                })
        },
    },
    components: {
        BoxSelector,
        PaletSelector,
        WbOfficeSelector,
    },
}
</script>