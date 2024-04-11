<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Палеты</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <RouterLink :to="{name: 'PaletEditor'}" class="btn btn-primary">
                Добавить
            </RouterLink>
        </div>
    </div>

    <div v-if="!views.loading && palets.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="palets"
            @cell-clicked="onCellClicked"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !palets.length" class="alert alert-danger d-inline-block">
        Нет палет.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            palets: [],

            table: {
                columns: [
                    {field: "number", headerName: '№', width: 200},
                    {field: "status", headerName: 'Статус', width: 200},
                    {
                        field: "status",
                        headerName: 'В палете',
                        width: 180,
                        cellRenderer: (params) => `${params.data.boxes_count}`
                    },
                ],
                defaultColDef: {
                    resizable: true,
                },
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
        this.loadPalets()
    },
    methods: {
        loadPalets() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/palets`)
                .then(response => {
                    if (response.data) {
                        this.palets = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'Palet', params: {uuid: event.data.uuid}})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
