<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Склады Wildberries</h5>
            <button @click="$parent.views.wbOfficeSelector = false" type="button"
                    class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 px-4 py-1 flex-grow-0">
            <Loader v-if="views.loading"/>

            <input v-model="searchInput" type="text" class="form-control">

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="office in filteredOffices"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$parent.selected.office = office"
                        class="d-flex cursor-pointer align-items-center">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ office.name }}</h6>
                            <p class="mb-1">{{ office.address }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div
        @click="$parent.views.wbOfficeSelector = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    props: ['contragent'],
    data() {
        return {
            offices: [],

            searchInput: '',

            views: {
                loading: true,
            },
        }
    },
    created() {
        this.loadOffices()
    },
    computed: {
        filteredOffices() {
            if (!this.searchInput.length) {
                return this.offices
            }

            return this.offices
                .filter(n => n.name.toLowerCase().includes(this.searchInput.toLowerCase())
                    || n.address.toLowerCase().includes(this.searchInput.toLowerCase()))
        },
    },
    methods: {
        loadOffices() {
            this.views.loading = true

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/wb-offices`)
                .then(response => {
                    if (response.data) {
                        this.offices = response.data
                    }
                    this.views.loading = false
                })
        },
    }
}
</script>