<template>
    <div class="offcanvas offcanvas-end show" tabindex="-1" id="offcanvasBackdrop"
         aria-labelledby="offcanvasBackdropLabel" aria-modal="true" role="dialog">
        <div class="offcanvas-header">
            <h5 id="offcanvasBackdropLabel" class="offcanvas-title">Контрагенты</h5>
            <button @click="$parent.views.contragents = false" type="button" class="btn-close text-reset"></button>
        </div>
        <div class="offcanvas-body my-0 mx-0 p-0 flex-grow-0">
            <div class="overlay" v-if="views.loading">
                <Loader/>
            </div>

            <ul v-if="!views.loading" class="list-group list-group-flush">
                <li v-for="contragent in contragents"
                    class="list-group-item list-group-item-action dropdown-notifications-item">
                    <div @click="select(contragent)" class="d-flex cursor-pointer align-items-center">
                        <div class="flex-shrink-0 me-3">
                            <i v-if="!$store.state.contragents.includes(contragent.id)" class="menu-icon tf-icons ti ti-circle"></i>
                            <i v-if="$store.state.contragents.includes(contragent.id)" class="menu-icon tf-icons ti ti-circle-check"></i>
                        </div>

                        <div class="flex-grow-1">
                            <h6 class="mb-1">{{ contragent.name }}</h6>
                            <small class="text-muted">ИНН {{ contragent.inn }}</small>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <div
        @click="$parent.views.contragents = false"
        class="offcanvas-backdrop fade show">
    </div>
</template>

<script>
export default {
    data() {
        return {
            contragents: [],

            views: {
                loading: true,
            },
        }
    },
    created() {
        this.loadContragents()
    },
    methods: {
        loadContragents() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-contragents`)
                .then(response => {
                    this.contragents = response.data

                    this.views.loading = false
                })
                .catch(error => {
                    this.$toast.error(error.response.data ? error.response.data : error)
                })
        },
        select(contragent) {
            let selectedContragents = this.$store.state.contragents

            if(!selectedContragents.includes(contragent.id)) {
                selectedContragents.push(contragent.id)
            } else {
                selectedContragents = selectedContragents.filter(c => c !== contragent.id)
            }

            this.$store.commit('setContragents', selectedContragents)

            axios
                .post(`${import.meta.env.VITE_API_SERVER}/api/ff-select-contragents`, {
                    contragents: selectedContragents,
                })
                .then(response => {
                    //
                })
                .catch(error => {
                    this.$toast.error(error)
                })
        },
    }
}
</script>
