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
                    @click="views.tab = 'sizes'; loadSizes()"
                    class="btn btn-sm ms-2"
                    :class="views.tab === 'sizes' ? 'btn-primary' : 'btn-outline-primary'">
                    Товары-размеры
                </button>
            </div>

            <Loader v-if="views.loading"/>

            <input v-model="searchInput" type="text" class="form-control mb-4">

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="size in filteredSizes"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$emit('addSizeToBox', size);"
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
                            <p class="mb-0">{{ size.product.vendor_code }} | {{ size.tech_size }}</p>
                            <small v-if="size.quantity" class="text-muted">{{ size.quantity.quantity }} шт</small>
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
    emits: ['addSizeToBox'],
    data() {
        return {
            sizes: [],

            searchInput: '',

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
                    || n.product.vendor_code.toLowerCase().includes(this.searchInput.toLowerCase()))
        }
    },
    created() {
        this.loadSizes()
    },
    methods: {
        loadSizes() {
            this.views.loading = true

            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-products`)
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