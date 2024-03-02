<template>
    <h4 class="py-3 mb-4">Новый контрагент</h4>

    <div class="card mb-4">
        <div class="card-body">
            <div class="mb-4">
                <label class="form-label">E-mail контрагента</label>
                <input v-model="user.email" type="email" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">Имя</label>
                <input v-model="user.name" type="text" class="form-control">
            </div>
        </div>
    </div>

    <div class="card">
        <div class="card-body">
            <div class="mb-4">
                <label class="form-label">Название компании</label>
                <input v-model="company.name" type="text" class="form-control">
            </div>

            <div class="mb-4">
                <label class="form-label">ИНН</label>
                <input v-model="company.inn" type="number" class="form-control">
            </div>

            <button @click="save()" class="btn btn-primary" :disabled="!views.saveButton">Сохранить</button>
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
            },

            company: {
                name: '',
                inn: '',
            },

            views: {
                saveButton: true,
            },
        }
    },
    created() {

    },
    methods: {
        save() {
            this.views.saveButton = false

            axios
                .post(`${import.meta.env.VITE_API_SERVER}/api/ff-register`, {
                    user_name: this.user.name,
                    user_email: this.user.email,
                    password: this.user.password,
                    password_confirmation: this.user.password,
                    company_name: this.company.name,
                    company_inn: this.company.inn,
                })
                .then(response => {
                    this.$router.push({name: 'Contragents'})
                })
                .catch(error => {
                    this.$toast.error(error)

                    this.views.saveButton = true
                })
        },
    },
}
</script>