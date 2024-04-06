<template>
    <h4 class="py-3 mb-4">Товары WB</h4>

    <div v-if="!views.loading && products.length" class="card ag-card">
        <ag-grid-vue
            class="ag-theme-alpine ag-table"
            :defaultColDef="table.defaultColDef"
            :columnDefs="table.columns"
            :rowData="products"
            @cell-clicked="onCellClicked"
            @cell-editing-started="cellEditingStarted"
            @cell-editing-stopped="cellEditingStopped"
            enableCellTextSelection="true"
            ensureDomOrder="true">
        </ag-grid-vue>
    </div>

    <div v-if="!views.loading && !products.length" class="alert alert-danger d-inline-block">
        Нет товаров.
    </div>
</template>

<script>
import {AgGridVue} from "ag-grid-vue3"
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-alpine.css"

export default {
    data() {
        return {
            products: [],

            table: {
                columns: [
                    {field: "product.nm_id", headerName: 'Артикул WB'},
                    {
                        field: "title",
                        headerName: 'Товар',
                        cellRenderer: (params) => `<img style="height: 42px; width: auto" src=${params.data.product.photo} /> <span>${params.data.product.title}</span>`
                    },
                    {field: "product.vendor_code", headerName: 'Артикул поставщика'},
                    {field: "tech_size", headerName: 'Размер'},
                    {field: "product.brand", headerName: 'Бренд'},
                    {field: "product.subject_name", headerName: 'Предмет'},
                    {
                        field: "quantity",
                        headerName: 'Шт',
                        cellRenderer: (params) => params.data.quantity ? params.data.quantity.quantity : 0
                    },
                ],
                defaultColDef: {
                    filter: true,
                    floatingFilter: true,
                    sortable: true,
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
        this.loadFFProducts()
    },
    methods: {
        loadFFProducts() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/ff-products`)
                .then(response => {
                    if (response.data) {
                        this.products = response.data
                    }
                    this.views.loading = false
                })
        },
        onCellClicked(event) {
            this.$router.push({name: 'Size', params: {uuid: event.data.uuid}})
        },
    },
    components: {
        AgGridVue
    }
}
</script>
