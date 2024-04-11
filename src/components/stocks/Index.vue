<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Склады</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <RouterLink :to="{name: 'StockEditor'}" class="btn btn-primary">Добавить</RouterLink>
        </div>
    </div>

    <div v-if="!views.loading && stocks.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="stocks"
            @cell-clicked="onCellClicked"
            @cell-editing-started="cellEditingStarted"
            @cell-editing-stopped="cellEditingStopped"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !stocks.length" class="alert alert-danger d-inline-block">
        Нет stocks.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            stocks: [],

            table: {
                columns: [
                    {field: "name", headerName: 'name', width: 200},
                ],
                defaultColDef: {
                    resizable: true,
                }
            },

            views: {
                loading: true,
                table: {
                    settings: false,
                },
            }
        }
    },
    created() {
        this.loadStocks()
    },
    methods: {
        loadStocks() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/stocks`)
                .then(response => {
                    if (response.data) {
                        this.stocks = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            //
        },
    },
    components: {
        AgGridVue
    }
}
</script>
