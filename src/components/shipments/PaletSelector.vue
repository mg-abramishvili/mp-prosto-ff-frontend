<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Добавить к отгрузке</h5>
            <button @click="$parent.views.paletSelector = false" type="button"
                    class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 px-4 py-1 flex-grow-0">
            <Loader v-if="views.loading"/>

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="palet in palets"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$emit('addPaletToShipment', palet);"
                        class="d-flex cursor-pointer align-items-center">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ palet.id }}</h6>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div
        @click="$parent.views.paletSelector = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    props: ['contragent'],
    emits: ['addPaletToShipment'],
    data() {
        return {
            palets: [],

            views: {
                loading: true,
            },
        }
    },
    created() {
        this.loadPalets()
    },
    methods: {
        loadPalets() {
            this.views.loading = true

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/palets-for-shipment`)
                .then(response => {
                    if (response.data) {
                        this.palets = response.data
                    }
                    this.views.loading = false
                })
        },
    }
}
</script>