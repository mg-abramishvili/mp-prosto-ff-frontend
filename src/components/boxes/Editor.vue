<template>
    <h4 class="py-3 mb-4">Новая коробка</h4>

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
                                @change="sizes = []"
                                class="form-select">
                                <option v-for="contragent in contragents" :value="contragent.uuid">
                                    {{ contragent.name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <button @click="openSizeSelector()" class="btn btn-primary mb-4">Добавить позицию</button>

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
                <tr v-for="size in sizes">
                    <SizeRow
                        v-if="size.id"
                        :size="size"
                    />
                </tr>
                <SizeCreator
                    v-if="sizesCreator"
                    :size="sizesCreator"
                    @add-size="addSizeToBox"
                    @close-creator="sizesCreator = null"
                />
                </tbody>
            </table>
        </div>

        <div class="d-flex justify-content-end mt-2 text-muted lh-1">
            <ul class="d-flex list-unstyled">
                <li>Всего позиций: {{ sizes.length }}</li>
                <li class="ms-4">Всего кол-во: {{ totalQuantity }}</li>
            </ul>
        </div>

        <SizeSelector
            v-if="views.sizesSelector && selected.contragent"
            :contragent="selected.contragent"
            @add-size-to-box="addSizeToBox"
        />

        <button @click="save()" class="btn btn-primary">Сохранить коробку</button>
    </template>
</template>

<script>
import SizeSelector from './SizeSelector.vue'
import SizeRow from './Editor/Row.vue'
import SizeCreator from './Editor/Creator.vue'
import dayjs from "dayjs";

export default {
    data() {
        return {
            contragents: [],
            stocks: [],

            sizes: [],

            selected: {
                contragent: null,
                stock: null,
            },

            date: dayjs().locale('ru').utcOffset(3).format('YYYY-MM-DD'),

            sizesCreator: null,

            views: {
                loading: true,
                saveButton: true,
                sizesSelector: false,
            },
        }
    },
    computed: {
        totalQuantity() {
            return this.sizes
                .reduce(function (acc, obj) {
                    return acc + obj.quantity
                }, 0)
        },
    },
    created() {
        this.loadContragents()
    },
    methods: {
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
        openSizeSelector() {
            if (!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            this.views.sizesSelector = true
        },
        addSizeToBox(size) {
            console.log(size)
            let isSizeIsAlreadyAdded = this.sizes.find(n => n.id === size.id)

            if (isSizeIsAlreadyAdded) {
                return this.$toast.error('Размер уже добавлен')
            }

            this.sizes.push({
                id: size.id,
                title: size.product.title,
                quantity: 1,
            })
        },
        save() {
            if(!this.selected.stock) {
                return this.$toast.error('Укажите склад')
            }

            if(!this.sizes.length) {
                return this.$toast.error('Коробка не может быть пустой')
            }

            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/boxes`, {
                    contragent: this.selected.contragent,
                    stock: this.selected.stock,
                    items: this.sizes
                })
                .then(response => {
                    this.$router.push({name: 'Box', params: {uuid: response.data}})
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.views.saveButton = true
                })
        },
    },
    components: {
        SizeSelector,
        SizeRow,
        SizeCreator,
    },
}
</script>