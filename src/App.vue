<template>
    <router-view v-if="!views.loading && !$store.state.company.name" :key="$route.path"/>

    <div v-if="!views.loading && $store.state.company.name" class="layout-container">
        <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
            <div class="app-brand demo">
                <RouterLink :to="{name: 'Home'}" class="app-brand-link gap-2">
                <span class="app-brand-logo demo">
                  <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z"
                        fill="#7367F0"/>
                    <path
                        opacity="0.06"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z"
                        fill="#161616"/>
                    <path
                        opacity="0.06"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z"
                        fill="#161616"/>
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z"
                        fill="#7367F0"/>
                  </svg>
                </span>
                    <span class="app-brand-text demo menu-text fw-bold">MP-PRO100.RU
                        <small class="text-muted">beta 0.1.1</small>
                    </span>
                </RouterLink>
            </div>

            <div class="menu-inner-shadow"></div>

            <ul class="menu-inner py-1">
                <Menu/>
            </ul>
        </aside>

        <div class="layout-page">
            <Header/>

            <div class="content-wrapper">
                <div class="flex-grow-1 container-p-y container-fluid">
                    <router-view :key="$route.path"/>
                </div>

                <Footer/>

                <Contragents v-if="views.contragents"/>

                <Stocks v-if="views.stocks"/>

                <div class="content-backdrop fade"></div>
            </div>
        </div>
    </div>

    <div class="layout-overlay layout-menu-toggle"></div>

    <div class="drag-target"></div>
</template>

<script>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Menu from './components/Menu.vue'
import Contragents from './components/Contragents.vue'
import Stocks from './components/Stocks.vue'

export default {
    data() {
        return {
            views: {
                loading: true,
                contragents: false,
                stocks: false,
            }
        }
    },
    created() {
        this.checkUser()
    },
    methods: {
        checkUser() {
            if (this.$store.state.user && this.$store.state.user.id) {
                return this.checkCompany()
            }

            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/whoami`)
                .then(response => {
                    if (response.data && response.data.id) {
                        this.$store.commit('setUser', response.data)

                        this.checkCompany()
                    } else {
                        this.$router.push({name: 'Login'})
                        this.views.loading = false
                    }
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        this.$router.push({name: 'Login'})
                        this.views.loading = false
                    }
                })
        },
        checkCompany() {
            if (this.$store.state.company && this.$store.state.company.uuid) {
                return this.views.loading = false
            }

            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/company`)
                .then(response => {
                    if (response.data && response.data.uuid) {
                        this.$store.commit('setCompany', response.data)

                        this.loadSelectedContragents()
                        this.loadSelectedStocks()

                        this.views.loading = false
                    } else {
                        this.$router.push({name: 'Wizard'})

                        this.views.loading = false
                    }

                })
        },
        loadSelectedContragents() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-selected-contragents`)
                .then(response => {
                    if(response.data) {
                        this.$store.commit('setContragents', response.data)
                    }
                })
                .catch(error => {
                    this.$toast.error(error)
                })
        },
        loadSelectedStocks() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-selected-stocks`)
                .then(response => {
                    if(response.data) {
                        this.$store.commit('setStocks', response.data)
                    }
                })
                .catch(error => {
                    this.$toast.error(error)
                })
        },
    },
    components: {
        Header,
        Footer,
        Menu,
        Contragents,
        Stocks,
    }
}
</script>
