<template>
    <h4 class="py-3 mb-4">Фулфилмент</h4>

    <div v-if="!views.loading && ffStocks.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="ffStocks"
            @cell-clicked="onCellClicked"
            @cell-editing-started="cellEditingStarted"
            @cell-editing-stopped="cellEditingStopped"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !ffStocks.length" class="alert alert-danger d-inline-block">
        Нет складов.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            ffStocks: [],

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
        this.loadFFStocks()
    },
    methods: {
        loadFFStocks() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-stocks`)
                .then(response => {
                    if (response.data) {
                        this.ffStocks = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'FFNomenclatures'})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
