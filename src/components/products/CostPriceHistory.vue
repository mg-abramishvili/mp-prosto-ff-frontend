<template>
    <div id="offcanvas" class="offcanvas offcanvas-end" tabindex="-1">
        <div class="offcanvas-header d-flex align-items-center">
            <h5 class="mb-0">История себестоимости</h5>

            <button @click="closeOffcanvas()"
                    type="button"
                    class="btn-close text-reset">
            </button>
        </div>
        <div class="offcanvas-body">
            <div class="p-4 border rounded mb-4">
                <div class="mb-4">
                    <label class="form-label">Дата</label>
                    <input v-model="newCostPrice.date" type="date" class="form-control">
                </div>

                <div class="mb-4">
                    <label class="form-label">Себестоимость</label>
                    <input v-model="newCostPrice.cost_price" type="number" class="form-control">
                </div>

                <button @click="saveNewCostPrice()" class="btn btn-primary">Добавить</button>
            </div>

            <table class="table table-bordered w-100">
                <thead>
                <tr>
                    <th class="w-50">Дата</th>
                    <th class="w-25 text-end">Себестоимость</th>
                    <th class="w-25"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="costPrice in history">
                    <td style="vertical-align: middle;">
                        <input
                            v-if="selectedCostPrice.cost_price_id && selectedCostPrice.cost_price_id === costPrice.id"
                            v-model="selectedCostPrice.date"
                            type="date"
                            class="form-control form-control-sm">

                        <span v-else>{{ costPrice.date }}</span>
                    </td>
                    <td class="text-end" style="vertical-align: middle;">
                        <input
                            v-if="selectedCostPrice.cost_price_id && selectedCostPrice.cost_price_id === costPrice.id"
                            v-model="selectedCostPrice.cost_price"
                            type="number"
                            class="form-control form-control-sm text-end">

                        <span v-else>{{ $filters.currency(costPrice.cost_price) }}</span>
                    </td>
                    <td class="text-end">
                        <button
                            v-if="selectedCostPrice.cost_price_id && selectedCostPrice.cost_price_id === costPrice.id"
                            @click="saveCostPrice()" class="btn btn-sm p-1 btn-outline-primary">
                            <i class="ti-small tf-icons ti ti-check m-0"></i>
                        </button>

                        <button
                            v-if="!selectedCostPrice.cost_price_id && costPrice.date !== $filters.today()"
                            @click="editCostPrice(sizeId, costPrice)"
                            class="btn btn-sm p-1 btn-outline-secondary">
                            <i class="ti-small tf-icons ti ti-pencil m-0"></i>
                        </button>

                        <button
                            v-if="!selectedCostPrice.cost_price_id && costPrice.date !== $filters.today()"
                            @click="delCostPrice(costPrice)"
                            class="btn btn-sm p-1 ms-1 btn-outline-danger">
                            <i class="ti-small tf-icons ti ti-trash m-0"></i>
                        </button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div @click="closeOffcanvas()" class="offcanvas-backdrop fade"></div>
</template>

<script>
export default {
    props: ['sizeId', 'history'],
    data() {
        return {
            newCostPrice: {
                date: this.$filters.yesterday(),
                cost_price: 0,
            },

            selectedCostPrice: {},
        }
    },
    mounted() {
        this.showOffcanvas()
    },
    methods: {
        showOffcanvas() {
            setTimeout(() => {
                document.getElementById('offcanvas').classList.add('show')
                document.getElementsByClassName('offcanvas-backdrop')[0].classList.add('show')
            }, 10)
        },
        closeOffcanvas() {
            document.getElementById('offcanvas').classList.remove('show')
            document.getElementById('offcanvas').classList.add('hiding')
            document.getElementsByClassName('offcanvas-backdrop')[0].classList.remove('show')

            setTimeout(() => {
                this.$parent.views.costPriceHistory = false
            }, 250)
        },
        editCostPrice(sizeId, costPrice) {
            this.selectedCostPrice.size_id = sizeId
            this.selectedCostPrice.cost_price_id = costPrice.id
            this.selectedCostPrice.date = costPrice.date
            this.selectedCostPrice.cost_price = costPrice.cost_price
        },
        saveCostPrice() {
            axios.put(`${import.meta.env.VITE_API_FF_SERVER}/api/cost-price/${this.selectedCostPrice.cost_price_id}/update`, {
                date: this.selectedCostPrice.date,
                cost_price: this.selectedCostPrice.cost_price,
            })
                .then(response => {
                    this.selectedCostPrice = {}

                    this.$parent.loadSize()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        saveNewCostPrice() {
            if (this.newCostPrice.date == this.$filters.today()) {
                return this.$toast.error("Нельзя указать сегодняшнюю дату в истории себестоимости")
            }

            axios.post(`${import.meta.env.VITE_API_FF_SERVER}/api/cost-prices`, {
                size_id: this.sizeId,
                date: this.newCostPrice.date,
                cost_price: this.newCostPrice.cost_price,
            })
                .then(response => {
                    this.newCostPrice.date = this.$filters.yesterday()
                    this.newCostPrice.cost_price = 0

                    this.$parent.loadSize()
                })
                .catch(error => {
                    this.$toast.error(error.response.data ? error.response.data : error)
                })
        },
        delCostPrice(costPrice) {
            axios.delete(`${import.meta.env.VITE_API_FF_SERVER}/api/cost-price/${costPrice.id}/delete`)
                .then(response => {
                    this.$parent.loadSize()
                })
                .catch(error => {
                    console.log(error)
                })
        },
    },
}
</script>