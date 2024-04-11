<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Поступления</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <RouterLink :to="{name: 'PostavkaEditor'}" class="btn btn-primary">
                Добавить
            </RouterLink>
        </div>
    </div>

    <div v-if="!views.loading && postavkas.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="postavkas"
            @cell-clicked="onCellClicked"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !postavkas.length" class="alert alert-danger d-inline-block">
        Нет поставок.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            postavkas: [],

            table: {
                columns: [
                    {field: "date", headerName: 'Дата', width: 200},
                    {field: "doc_number", headerName: '№', width: 200},
                    {field: "contragent.name", headerName: 'Контрагент', width: 200},
                    {field: "stock.name", headerName: 'Склад', width: 200},
                    {field: "items_count", headerName: 'Кол-во позиций', width: 180},
                    {
                        field: "status",
                        headerName: 'Статус',
                        width: 180,
                        cellRenderer: (params) => `<span>${params.data.status === 1 ? 'проведено' : 'создано'}</span>`
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
        this.loadPostavkas()
    },
    methods: {
        loadPostavkas() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/postavkas`)
                .then(response => {
                    if (response.data) {
                        this.postavkas = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'Postavka', params: {uuid: event.data.uuid}})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
