<template>
    <h4 class="py-3 mb-4">Новый склад</h4>

    <div class="card mb-4">
        <div class="card-body">
            <div class="mb-4">
                <label class="form-label">Название склада</label>
                <input v-model="name" type="text" class="form-control">
            </div>

            <button @click="save()" class="btn btn-primary">Сохранить</button>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            name: '',
        }
    },
    created() {

    },
    methods: {
        save() {
            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/ff-stocks`, {
                    name: this.name,
                })
                .then(response => {
                    this.$router.push({name: 'Stocks'})
                })
                .catch(error => {
                    this.$toast.error(error)
                })
        },
    },
}
</script>