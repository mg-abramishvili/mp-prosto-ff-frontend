<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Отгурзки</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <RouterLink :to="{name: 'ShipmentEditor'}" class="btn btn-primary">
                Добавить
            </RouterLink>
        </div>
    </div>

    <div v-if="!views.loading && shipments.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="shipments"
            @cell-clicked="onCellClicked"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !shipments.length" class="alert alert-danger d-inline-block">
        Нет отгрузок.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            shipments: [],

            table: {
                columns: [
                    {field: "number", headerName: '№', width: 200},
                    {field: "status", headerName: 'Статус', width: 200},
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
        this.loadShipments()
    },
    methods: {
        loadShipments() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/shipments`)
                .then(response => {
                    if (response.data) {
                        this.shipments = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'Shipment', params: {uuid: event.data.uuid}})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
