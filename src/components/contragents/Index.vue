<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Контрагенты</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <RouterLink :to="{name: 'ContragentSearch'}" class="btn btn-outline-primary">
                Поиск в системе
            </RouterLink>

            <RouterLink :to="{name: 'ContragentMaster'}" class="btn btn-primary ms-2">
                Создать нового
            </RouterLink>
        </div>
    </div>

    <div v-if="!views.loading && contragents.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="contragents"
            @cell-clicked="onCellClicked">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !contragents.length" class="alert alert-danger d-inline-block">
        Нет contragents.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            contragents: [],

            table: {
                columns: [
                    {field: "name", headerName: 'Контрагент', width: 200},
                    {field: "inn", headerName: 'ИНН', width: 200},
                    {field: "user.tel", headerName: 'Телефон', width: 200},
                    {field: "user.telegram", headerName: 'Телеграм', width: 200},
                    {field: "pivot.balance", headerName: 'Баланс', width: 200},
                ],
                defaultColDef: {
                    filter: true,
                    floatingFilter: true,
                    sortable: true,
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
        this.loadContragents()
    },
    methods: {
        loadContragents() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/contragents`)
                .then(response => {
                    if (response.data) {
                        this.contragents = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'ContragentMaster', params: {uuid: event.data.uuid}})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
