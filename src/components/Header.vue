<template>
    <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
         id="layout-navbar">
        <div class="container-fluid">
            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a class="nav-item nav-link px-0 me-xl-4" href="">
                    <i class="ti ti-menu-2 ti-sm"></i>
                </a>
            </div>

            <button
                @click="$parent.views.contragents = true"
                class="btn btn-sm btn-outline-primary me-3">
                Контрагенты
                <span v-if="$store.state.contragents.length" class="ms-1">({{ $store.state.contragents.length }})</span>
            </button>

            <button
                @click="$parent.views.stocks = true"
                class="btn btn-sm btn-outline-primary me-3">
                Склады
                <span v-if="$store.state.stocks.length" class="ms-1">({{ $store.state.stocks.length }})</span>
            </button>

            <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                <ul class="navbar-nav flex-row align-items-center ms-auto">
                    <li v-if="$store.state.company.name" class="nav-item navbar-dropdown dropdown me-3 me-xl-1">
                        <a
                            @click="toggleCompanies()"
                            class="nav-link dropdown-toggle hide-arrow cursor-pointer"
                            id="company_button">
                            <span class="btn btn-sm btn-outline-primary">
                                {{ $store.state.company.name }}
                            </span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end py-0" :class="{show: views.companiesPanel}"
                            id="company_panel">
                            <li class="dropdown-menu-header border-bottom">
                                <div class="dropdown-header d-flex align-items-center py-3">
                                    <h5 class="text-body mb-0 me-auto">Мои компании</h5>
                                </div>
                            </li>
                            <li class="dropdown-notifications-list scrollable-container">
                                <ul class="list-group list-group-flush">
                                    <li v-for="company in companies"
                                        class="list-group-item list-group-item-action dropdown-notifications-item">
                                        <div @click="selectCompany(company.uuid)" class="d-flex cursor-pointer">
                                            <div class="flex-grow-1">
                                                <p class="mb-0">{{ company.name }}</p>
                                                <small class="text-muted">{{ company.inn }}</small>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    data() {
        return {
            companies: [],

            views: {
                companiesPanel: false,
            }
        }
    },
    mounted() {
        window.addEventListener('click', (e) => {
            const companiesPanelButton = document.getElementById('company_button')
            const companiesPanel = document.getElementById('company_panel')

            if (companiesPanel && !companiesPanel.contains(e.target) && !companiesPanelButton.contains(e.target)) {
                this.views.companiesPanel = false
            }
        })
    },
    methods: {
        toggleCompanies() {
            if (this.views.companiesPanel === true) {
                this.views.companiesPanel = false
            } else {
                this.loadCompanies()
                this.views.companiesPanel = true
            }
        },
        loadCompanies() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/companies`)
                .then(response => {
                    this.companies = response.data

                    this.views.loading = false
                })
        },
        selectCompany(companyUUID) {
            axios.post(`${import.meta.env.VITE_API_SERVER}/api/select-company`, {
                uuid: companyUUID,
            })
                .then(response => {
                    window.location.href = '/'
                })
        },
    },
}
</script>
