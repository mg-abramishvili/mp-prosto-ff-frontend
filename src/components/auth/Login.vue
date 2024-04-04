<template>
    <div class="container mt-4">
        <div class="row justify-content-sm-center">
            <div class="col-xl-6 col-lg-12 col-md-6">
                <div class="card shadow-lg">
                    <div class="card-body p-5">
                        <form @submit.prevent="login" class="mb-3">
                            <div class="mb-3">
                                <label for="email" class="form-label">Логин</label>
                                <input v-model="email" id="email" class="form-control" type="email"/>
                            </div>

                            <div class="mb-3">
                                <label for="password" class="form-label">Пароль</label>
                                <input v-model="password" id="password" class="form-control" type="password"/>
                            </div>

                            <div class="mb-3">
                                <button type="submit" class="btn btn-primary" :disabled="!submitButton">
                                    Войти
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: '',

            submitButton: true,
        }
    },
    methods: {
        login() {
            if (!this.email.length) {
                return this.$toast.error("Укажите E-mail")
            }
            if (!this.password.length) {
                return this.$toast.error("Введите пароль")
            }

            this.submitButton = false

            axios
                .get(`${import.meta.env.VITE_API_SERVER}/sanctum/csrf-cookie`)
                .then(response => {
                    axios
                        .post(`${import.meta.env.VITE_API_SERVER}/login`, {
                            email: this.email,
                            password: this.password,
                        })
                        .then(response => {
                            window.location.href = '/'
                        })
                        .catch(error => {
                            this.$toast.error(error.response.data.message ?? error.response.data)

                            this.submitButton = true
                        })
                })
        },
    },
}
</script>