<template>
    <h4 class="py-3 mb-4">Номенклатуры</h4>

    <div v-if="!views.loading && nomenclatures.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="nomenclatures"
            @cell-clicked="onCellClicked"
            @cell-editing-started="cellEditingStarted"
            @cell-editing-stopped="cellEditingStopped"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !nomenclatures.length" class="alert alert-danger d-inline-block">
        Нет номенклатур.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            nomenclatures: [],

            table: {
                columns: [
                    {field: "nomenclature.title", headerName: 'title', width: 200},
                    {field: "quantity", headerName: 'quantity', width: 200},
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
        this.loadFFNomenclatures()
    },
    methods: {
        loadFFNomenclatures() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-nomenclatures`)
                .then(response => {
                    if (response.data) {
                        this.nomenclatures = response.data
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
