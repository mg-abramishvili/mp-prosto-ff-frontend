<template>
    <div class="container mt-4">
        <div class="row justify-content-sm-center">
            <div class="col-xl-6 col-lg-12 col-md-6">
                <div class="card shadow-lg">
                    <div class="card-body p-5">
                        <div class="text-center">
                            <h1 class="h4 text-gray-900 mb-4">Регистрация</h1>
                        </div>

                        <form @submit.prevent="registration">
                            <div class="mb-4">
                                <label class="mb-1 text-muted">Имя</label>
                                <input type="text" v-model="name" class="form-control">
                            </div>

                            <div class="mb-4">
                                <label class="mb-1 text-muted">E-mail</label>
                                <input type="email" v-model="email" class="form-control">
                            </div>

                            <div class="mb-4">
                                <label class="mb-1 text-muted">Пароль</label>
                                <input type="password" v-model="passwordOne" class="form-control">
                            </div>

                            <div class="mb-4">
                                <label class="mb-1 text-muted">Пароль еще раз</label>
                                <input type="password" v-model="passwordTwo" class="form-control">
                            </div>

                            <div class="d-flex align-items-center justify-content-between">
                                <button type="submit" class="btn btn-primary" :disabled="!views.submitButton">
                                    Создать аккаунт
                                </button>

                                <a href="/login" class="text-decoration-none">
                                    Вернуться к форме входа
                                </a>
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
            name: '',
            email: '',

            passwordOne: '',
            passwordTwo: '',

            views: {
                submitButton: true,
            }
        }
    },
    computed: {
        password() {
            if (this.passwordOne === this.passwordTwo) {
                return this.passwordOne
            }
        }
    },
    methods: {
        registration() {
            if (!this.name.length) {
                return this.$toast.error("Укажите имя")
            }
            if (!this.email.length) {
                return this.$toast.error("Укажите E-mail")
            }
            if (!this.emailValidation(this.email)) {
                return this.$toast.error("Неверный формат E-mail")
            }
            if (!this.password) {
                return this.$toast.error("Не указан пароль или пароли не совпадают")
            }

            this.views.submitButton = false

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/register`, {
                    name: this.name,
                    email: this.email.toLowerCase(),
                    password: this.password,
                    password_confirmation: this.password,
                })
                .then(response => {
                    window.location.href = "/"
                })
                .catch(error => {
                    this.$toast.error(error.response.data ? error.response.data.message : error)

                    this.views.submitButton = true
                })
        },
        emailValidation(email) {
            return !!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)
        }
    },
}
</script>