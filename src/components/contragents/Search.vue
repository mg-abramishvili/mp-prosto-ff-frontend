<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3">Поиск контрагента по системе</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
        </div>
    </div>

    <div class="card mb-4">
        <div class="card-body">
            <div class="mb-2">
                <label class="form-label">ИНН</label>
                <input v-model="inn" type="text" class="form-control">
            </div>

            <button @click="search()" class="btn btn-primary">Найти</button>
        </div>
    </div>

    <div v-if="contragents.length" class="card mb-4">
        <div class="card-body">
            <table class="table">
                <tbody>
                <tr v-for="contragent in contragents">
                    <td>{{ contragent.name }}</td>
                    <td>{{ contragent.inn }}</td>
                    <td><button @click="add(contragent.uuid)" class="btn btn-sm">+ Добавить</button></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            contragents: [],

            inn: '',
        }
    },
    methods: {
        search() {
            if (this.inn.length !== 12) {
                return this.$toast.error('ИНН должен быть из 12 цифр')
            }

            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/contragent-search/${this.inn}`)
                .then(response => {
                    this.contragents = response.data

                    if(!response.data.length) {
                        this.$toast.error('Не найдено')
                    }
                })
                .catch(error => {
                    this.$toast.error(error.response.data)
                })
        },
        add(uuid) {
            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/contragent-add`, {
                    uuid: uuid,
                })
                .then(response => {
                    this.$toast.success('Контрагент добавлен')
                })
                .catch(error => {
                    this.$toast.error(error.response.data)
                })
        }
    },
}
</script>