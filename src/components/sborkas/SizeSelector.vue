<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Добавить к сборке</h5>
            <button @click="$parent.views.sizesSelector = false" type="button"
                    class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 px-4 py-1 flex-grow-0">
            <div class="d-flex mb-3">
                <button
                    @click="inStockOnly = 0; loadSizes()"
                    class="btn btn-sm btn-outline-primary  ms-2">
                    Все
                </button>

                <button
                    @click="inStockOnly = 1; loadSizes()"
                    class="btn btn-sm btn-outline-primary ms-2">
                    Которые можем собрать
                </button>
            </div>

            <Loader v-if="views.loading"/>

            <input v-model="searchInput" type="text" class="form-control mb-4">

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="size in filteredSizes"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$emit('addSizeToSborka', size);"
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
        @click="$parent.views.sizesSelector = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    props: ['contragent'],
    emits: ['addSizeToSborka'],
    data() {
        return {
            sizes: [],

            searchInput: '',

            inStockOnly: 0,

            views: {
                loading: true,
            },
        }
    },
    computed: {
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
        this.loadSizes()
    },
    methods: {
        loadSizes() {
            this.views.loading = true

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/ff-products-by-contragent/${this.contragent}`, {
                    params: {
                        in_stock_only: this.inStockOnly
                    }
                })
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