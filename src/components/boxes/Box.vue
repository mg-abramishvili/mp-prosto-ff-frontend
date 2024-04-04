<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="m-0">Коробка №{{ box.number }}</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
        </div>
    </div>

    <Loader v-if="loader"/>

    <div v-if="!loader" class="card">
        <table class="table table-borderless table-hover mb-0">
            <thead class="border-bottom">
            <tr>
                <th>Наименование</th>
                <th>Кол-во</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in box.sborka_items">
                <td>
                    <strong>{{ item.size.product.title }} - {{ item.size.tech_size }}</strong>
                </td>
                <td style="width: 150px;">
                    {{ item.pivot.quantity }}
                </td>
                <td class="text-end">
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            box: {},

            loader: true,
            saveButton: true,
            editor: null,
        }
    },
    created() {
        this.loadBox()
    },
    methods: {
        loadBox() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-box/${this.$route.params.uuid}`)
                .then(response => {
                    this.box = response.data

                    this.loader = false
                })
        },
    },
}
</script>