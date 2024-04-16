<template>
    <h4 class="py-3 mb-4">{{ $route.params.uuid ? product.title : 'Новый товар' }}</h4>

    <div class="card mb-4">
        <div class="card-body">
            <label class="form-label">Артикул WB</label>
            <input v-model="nmIdSearch" type="text" class="form-control">
            <button
                @click="getWBProductInfo()"
                :disabled="views.loading"
                class="btn btn-sm btn-primary mt-2">
                Найти данные
            </button>
        </div>
    </div>

    <h4>Товар</h4>

    <div class="card mb-4">
        <div class="card-body">
            <div class="row">
                <div class="col-12 col-sm-6 mb-3">
                    <label class="form-label">Контрагент</label>
                    <select v-model="selected.contragent" class="form-select">
                        <option v-for="contragent in contragents" :value="contragent.uuid">
                            {{ contragent.name }} ({{ contragent.inn }})
                        </option>
                    </select>
                </div>

                <div class="col-12 col-sm-6 mb-3">
                    <label class="form-label">Наименование</label>
                    <input v-model="product.title" type="text" class="form-control">
                </div>

                <div class="col-12 col-sm-4">
                    <label class="form-label">Артикул WB</label>
                    <input v-model="product.nm_id" type="text" class="form-control">
                </div>

                <div class="col-12 col-sm-4">
                    <label class="form-label">Артикул продавца</label>
                    <input v-model="product.vendor_code" type="text" class="form-control">
                </div>

                <div class="col-12 col-sm-4">
                    <label class="form-label">Бренд</label>
                    <input v-model="product.brand" type="text" class="form-control">
                </div>
            </div>
        </div>
    </div>

    <h4 v-if="sizes.length">Размеры</h4>

    <div v-for="size in sizes" class="card mb-4">
        <button
            @click="delSize(size)"
            class="btn rounded-pill btn-icon btn-outline-danger bg-white waves-effect position-absolute"
            style="right: -5px; top: -5px">
            <span class="ti ti-trash"></span>
        </button>

        <div class="card-body">
            <div class="row">
                <div class="col-12 col-sm-3">
                    <label class="form-label">ID размера</label>
                    <input v-model="size.chrt_id" type="text" class="form-control">
                </div>

                <div class="col-12 col-sm-3">
                    <label class="form-label">Размер</label>
                    <input v-model="size.tech_size" type="text" class="form-control">
                </div>

                <div class="col-12 col-sm-3">
                    <label class="form-label">Размер WB</label>
                    <input v-model="size.wb_size" type="text" class="form-control">
                </div>
                <div class="col-12 col-sm-3">
                    <label class="form-label">Баркод</label>
                    <input v-model="size.barcode" type="text" class="form-control">
                </div>
            </div>
        </div>
    </div>

    <button @click="save()" class="btn btn-primary">Сохранить</button>
</template>

<script>
export default {
    data() {
        return {
            product: {
                title: '',
                nm_id: '',
                vendor_code: '',
                brand: '',
            },

            sizes: [],

            nmIdSearch: '',

            selected: {
                contragent: null,
            },

            views: {
                loading: true,
            },
        }
    },
    created() {
        this.loadContragents()
    },
    methods: {
        loadContragents() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/contragents`)
                .then(response => {
                    this.contragents = response.data

                    if (this.$route.params.uuid) {
                        this.loadProduct()
                    }

                    if (!this.$route.params.uuid) {
                        this.views.loading = false
                    }
                })
                .catch(error => {
                    this.$toast.error(error)
                })
        },
        loadProduct() {

        },
        getWBProductInfo() {
            if (!this.nmIdSearch.length) {
                return
            }

            this.views.loading = true

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/product-get-wb-info`, {
                    nm_id: this.nmIdSearch,
                })
                .then(response => {
                    if (!response.data.data.products) {
                        this.$toast.error('Ошибка получения данных')

                        return this.views.loading = false
                    }

                    if (!response.data.data.products.length) {
                        this.$toast.error('Ошибка получения данных')

                        return this.views.loading = false
                    }

                    let product = response.data.data.products[0]

                    this.product.title = product.name
                    this.product.nm_id = product.id
                    this.product.brand = product.brand

                    this.sizes = []

                    product.sizes.forEach(s => {
                        this.sizes.push({
                            chrt_id: s.optionId,
                            tech_size: s.origName,
                            wb_size: s.name,
                            barcode: null,
                        })
                    })

                    this.views.loading = false
                })
                .catch(error => {
                    this.$toast.error('Ошибка получения данных')

                    this.views.loading = false
                })
        },
        delSize(size) {
            if (this.sizes.length === 1) {
                return this.$toast.error('У товара должен быть хотя бы 1 размер')
            }

            this.sizes = this.sizes.filter(s => s.chrt_id !== size.chrt_id)
        },
        save() {
            if (!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            if (!this.product.title) {
                return this.$toast.error('Укажите наименование')
            }

            if (!this.product.nm_id) {
                return this.$toast.error('Укажите артикул')
            }

            if (!this.product.vendor_code) {
                return this.$toast.error('Укажите артикул продавца')
            }

            if (!this.product.brand) {
                return this.$toast.error('Укажите бренд')
            }

            if (!this.sizes.length) {
                return this.$toast.error('Нет размеров')
            }

            let sizeErrors = []

            this.sizes.forEach(s => {
                if(!s.chrt_id) {
                    sizeErrors.push('Отсутствует ID размера')
                }

                if(!s.tech_size) {
                    sizeErrors.push('Отсутствует название размера')
                }

                if(!s.wb_size) {
                    sizeErrors.push('Отсутствует название размера WB')
                }

                if(!s.barcode) {
                    sizeErrors.push('Отсутствует баркод')
                }
            })

            if(sizeErrors.length) {
                sizeErrors.forEach(e => {
                    this.$toast.error(e)
                })

                return
            }

            this.views.loading = true

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/products`, {
                    title: this.product.title,
                    brand: this.product.brand,
                    nm_id: this.product.nm_id,
                    vendor_code: this.product.vendor_code,
                    sizes: this.sizes,
                    contragent: this.selected.contragent,
                })
                .then(response => {
                    this.$router.push({name: 'Products'})
                })
                .catch(error => {
                    this.$toast.error(error)

                    this.views.loading = false
                })
        },
    },
}
</script>