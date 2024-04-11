<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Добавить к отгрузке</h5>
            <button @click="$parent.views.boxSelector = false" type="button"
                    class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 px-4 py-1 flex-grow-0">
            <Loader v-if="views.loading"/>

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="box in boxes"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div
                        @click="$emit('addBoxToShipment', box);"
                        class="d-flex cursor-pointer align-items-center">
                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ box.id }}</h6>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div
        @click="$parent.views.boxSelector = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    props: ['contragent'],
    emits: ['addBoxToShipment'],
    data() {
        return {
            boxes: [],

            views: {
                loading: true,
            },
        }
    },
    created() {
        this.loadBoxes()
    },
    methods: {
        loadBoxes() {
            this.views.loading = true

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/boxes-for-shipment`)
                .then(response => {
                    if (response.data) {
                        this.boxes = response.data
                    }
                    this.views.loading = false
                })
        },
    }
}
</script>