<template>
    <h4 class="py-3 mb-4">{{ $route.params.uuid ? company.name : 'Новый контрагент' }}</h4>

    <Loader v-if="views.loading"/>

    <div v-if="!views.loading && !$route.params.uuid" class="card mb-4">
        <div class="card-body">
            <div class="mb-4">
                <label class="form-label">E-mail контрагента</label>
                <input v-model="user.email" type="email" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">Имя</label>
                <input v-model="user.name" type="text" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">Телефон</label>
                <input v-model="user.tel" type="text" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">Телеграм</label>
                <input v-model="user.telegram" type="text" class="form-control">
            </div>
        </div>
    </div>

    <div v-if="!views.loading" class="card">
        <div class="card-body">
            <div class="mb-4">
                <label class="form-label">Название компании</label>
                <input v-model="company.name" type="text" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">ИНН</label>
                <input v-model="company.inn" type="number" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">API-ключ</label>
                <input
                    v-model="company.wb_api_key_stat"
                    :disabled="$route.params.uuid"
                    type="text"
                    class="form-control">
            </div>

            <button
                v-if="!$route.params.uuid"
                @click="testApiKey()"
                class="btn btn-primary"
                :disabled="!views.saveButton">
                Зарегистрировать
            </button>

            <button
                v-if="$route.params.uuid"
                @click="save()"
                class="btn btn-primary"
                :disabled="!views.saveButton">
                Сохранить
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                email: '',
                name: '',
                password: '12345678',
                tel: '',
                telegram: '',
            },

            company: {
                name: '',
                inn: '',
                wb_api_key_stat: '',
            },

            views: {
                loading: true,
                saveButton: true,
            },
        }
    },
    created() {
        if (this.$route.params.uuid) {
            this.loadContragent()
        }

        if (!this.$route.params.uuid) {
            this.views.loading = false
        }
    },
    methods: {
        loadContragent() {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/contragent/${this.$route.params.uuid}`)
                .then(response => {
                    this.company.name = response.data.name
                    this.company.inn = response.data.inn
                    this.company.wb_api_key_stat = response.data.wb_api_key_stat

                    this.views.loading = false
                })
        },
        save() {
            this.views.saveButton = false

            axios
                .put(`${import.meta.env.VITE_API_FF_SERVER}/api/contragent/${this.$route.params.uuid}/update`, {
                    name: this.company.name,
                    inn: this.company.inn,
                })
                .then(response => {
                    this.$router.push({name: 'Contragents'})
                })
                .catch(error => {
                    this.$toast.error(error)

                    this.views.saveButton = true
                })
        },
        register() {
            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/register`, {
                    name: this.user.name,
                    email: this.user.email,
                    password: this.user.password,
                    password_confirmation: this.user.password,
                    tel: this.user.tel,
                    telegram: this.user.telegram,
                    company_name: this.company.name,
                    company_inn: this.company.inn,
                    wb_api_key_stat: this.company.wb_api_key_stat,
                })
                .then(response => {
                    this.$router.push({name: 'Contragents'})
                })
                .catch(error => {
                    this.$toast.error(error)

                    this.views.saveButton = true
                })
        },
        testApiKey() {
            if (!this.company.wb_api_key_stat.length) {
                return this.register()
            }

            this.views.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/test-api-key`, {
                    params: {
                        key: this.company.wb_api_key_stat,
                    }
                })
                .then(response => {
                    this.register()
                })
                .catch(error => {
                    this.$toast.error(error.response.data)

                    this.views.saveButton = true
                })
        }
    },
}
</script>