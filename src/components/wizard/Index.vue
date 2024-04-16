<template>
    <h4 class="py-3 mb-4 mt-n5">Новая компания</h4>

    <div v-if="!views.loading" class="card">
        <div class="card-body">
            <div class="mb-4">
                <label class="form-label">Название компании</label>
                <input v-model="name" type="text" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">ИНН</label>
                <input v-model="inn" type="number" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">API-ключ</label>
                <input
                    v-model="wb_api_key_stat"
                    type="text"
                    class="form-control">
            </div>

            <button
                @click="testApiKey()"
                class="btn btn-primary"
                :disabled="!views.saveButton">
                Создать
            </button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
            inn: '',
            wb_api_key_stat: '',
            wb_api_key_adv_st: '',

            views: {
                saveButton: true,
            },
        }
    },
    methods: {
        register() {
            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/register-company`, {
                    name: this.name,
                    inn: this.inn,
                    wb_api_key_stat: this.wb_api_key_stat,
                    wb_api_key_adv_st: this.wb_api_key_adv_st,
                })
                .then(response => {
                    window.location.href = '/'
                })
                .catch(error => {
                    this.$toast.error(error)

                    this.views.saveButton = true
                })
        },
        testApiKey() {
            if (!this.wb_api_key_stat.length) {
                return this.register()
            }

            this.views.saveButton = false

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/test-api-key`, {
                    params: {
                        key: this.wb_api_key_stat,
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