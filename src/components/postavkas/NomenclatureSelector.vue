<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Добавить к поставке</h5>
            <button @click="$parent.views.nomenclaturesSelector = false" type="button"
                    class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 px-4 py-1 flex-grow-0">
            <div class="d-flex mb-3">
                <button
                    @click="views.tab = 'nomenclatures'; loadFFNomenclatures()"
                    class="btn btn-sm"
                    :class="views.tab === 'nomenclatures' ? 'btn-primary' : 'btn-outline-primary'">
                    Номенклатуры
                </button>
                <button
                    @click="views.tab = 'sizes'; loadSizes()"
                    class="btn btn-sm ms-2"
                    :class="views.tab === 'sizes' ? 'btn-primary' : 'btn-outline-primary'">
                    Товары-размеры
                </button>
            </div>

            <Loader v-if="views.loading"/>

            <input v-model="searchInput" type="text" class="form-control mb-4">

            <ul v-if="!views.loading && views.tab === 'nomenclatures'" class="list-group list-group-flush">
                <li v-for="nomenclature in filteredNomenclatures"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$emit('addNomenclatureToPostavka', nomenclature);"
                        class="d-flex cursor-pointer">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ nomenclature.title }}</h6>
                            <p class="mb-0">{{ nomenclature.vendor_code }}</p>
                            <!--                            <small class="text-muted">14.02.2024</small>-->
                        </div>
                    </div>
                </li>
            </ul>

            <ul v-if="!views.loading && views.tab === 'sizes'" class="list-group list-group-flush">
                <li v-for="size in filteredSizes"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$emit('addNomenclaturesFromSizeToPostavka', size);"
                        class="d-flex cursor-pointer align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <div class="avatar">
                                <span class="avatar-initial rounded-circle bg-label-danger">
                                    <img v-if="size.product.photo" :src="size.product.photo" alt style="height: auto;">
                                </span>
                            </div>
                        </div>
                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ size.product.title }}</h6>
                            <p class="mb-0">{{ size.product.nm_id }} | {{ size.product.vendor_code }} | {{ size.tech_size }}</p>
                            <!--                            <small class="text-muted">14.02.2024</small>-->
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div
        @click="$parent.views.nomenclaturesSelector = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    props: ['contragent'],
    emits: ['addNomenclatureToPostavka', 'addNomenclaturesFromSizeToPostavka'],
    data() {
        return {
            nomenclatures: [],
            sizes: [],

            searchInput: '',

            views: {
                tab: 'nomenclatures',
                loading: true,
            },
        }
    },
    computed: {
        filteredNomenclatures() {
            if (!this.searchInput.length) {
                return this.nomenclatures
            }

            return this.nomenclatures
                .filter(n => n.title.toLowerCase().includes(this.searchInput.toLowerCase())
                    || n.vendor_code.toLowerCase().includes(this.searchInput.toLowerCase()))
        },
        filteredSizes() {
            if (!this.searchInput.length) {
                return this.sizes
            }

            return this.sizes
                .filter(n => n.product.title.toLowerCase().includes(this.searchInput.toLowerCase())
                    || n.product.nm_id.toString().includes(this.searchInput)
                    || n.product.vendor_code.toLowerCase().includes(this.searchInput.toLowerCase()))
        }
    },
    created() {
        this.loadFFNomenclatures()
    },
    methods: {
        loadFFNomenclatures() {
            this.views.loading = true

            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/nomenclatures-by-contragent/${this.contragent}?type=tovar,raskhodnik`)
                .then(response => {
                    if (response.data) {
                        this.nomenclatures = response.data.filter(n => n.vendor_code)
                    }
                    this.views.loading = false
                })
        },
        loadSizes() {
            this.views.loading = true

            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/products-by-contragent/${this.contragent}`)
                .then(response => {
                    if (response.data) {
                        this.sizes = response.data
                    }
                    this.views.loading = false
                })
        },
    }
}
</script>