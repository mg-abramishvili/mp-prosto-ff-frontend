<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Сборки</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <RouterLink :to="{name: 'SborkaEditor'}" class="btn btn-primary">
                Добавить
            </RouterLink>
        </div>
    </div>

    <div v-if="!views.loading && sborkas.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="sborkas"
            @cell-clicked="onCellClicked"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !sborkas.length" class="alert alert-danger d-inline-block">
        Нет сборок.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            sborkas: [],

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
        this.loadSborkas()
    },
    methods: {
        loadSborkas() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/sborkas`)
                .then(response => {
                    if (response.data) {
                        this.sborkas = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'Sborka', params: {uuid: event.data.uuid}})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
