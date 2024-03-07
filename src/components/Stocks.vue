<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Склады</h5>
            <button @click="$parent.views.stocks = false" type="button" class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 p-0 flex-grow-0">
            <div class="overlay" v-if="views.loading">
                <Loader/>
            </div>

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="stock in stocks"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div @click="select(stock)" class="d-flex cursor-pointer align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <i v-if="!$store.state.stocks.includes(stock.id)" class="menu-icon tf-icons ti ti-circle"></i>
                            <i v-if="$store.state.stocks.includes(stock.id)" class="menu-icon tf-icons ti ti-circle-check"></i>
                        </div>

                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ stock.name }}</h6>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div
        @click="$parent.views.stocks = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    data() {
        return {
            stocks: [],

            views: {
                loading: true,
            },
        }
    },
    created() {
        this.loadStocks()
    },
    methods: {
        loadStocks() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-stocks`)
                .then(response => {
                    this.stocks = response.data

                    this.views.loading = false
                })
                .catch(error => {
                    this.$toast.error(error.response.data ? error.response.data : error)
                })
        },
        select(stock) {
            let selectedStocks = this.$store.state.stocks

            if(!selectedStocks.includes(stock.id)) {
                selectedStocks.push(stock.id)
            } else {
                selectedStocks = selectedStocks.filter(c => c !== stock.id)
            }

            this.$store.commit('setStocks', selectedStocks)

            axios
                .post(`${import.meta.env.VITE_API_SERVER}/api/ff-select-stocks`, {
                    stocks: selectedStocks,
                })
                .then(response => {
                    //
                })
                .catch(error => {
                    this.$toast.error(error)
                })
        },
    }
}
</script>
