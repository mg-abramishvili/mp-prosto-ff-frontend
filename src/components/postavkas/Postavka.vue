<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="m-0">Поставка №{{ postavka.doc_number }}</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
             <button v-if="postavka.status === 0" @click="provod()" class="btn btn-primary">
                 Провести документ
             </button>
        </div>
    </div>

    <Loader v-if="loader" />

    <div v-if="!loader" class="card mb-4">
        <div class="card-body">
            <p>Контрагент: {{ postavka.contragent.name }}</p>
            <p>Дата: {{ $filters.date(postavka.date) }}</p>
        </div>
    </div>

    <div v-if="!loader" class="card">
        <table class="table table-borderless table-hover mb-0">
            <thead class="border-bottom">
            <tr>
                <th>Тип</th>
                <th>Наименование</th>
                <th>Артикул</th>
                <th>Себес</th>
                <th>Кол-во</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                <tr v-for="item in postavka.items">
                    <td>{{item.nomenclature.type}}</td>
                    <td>{{item.nomenclature.title}}</td>
                    <td>{{item.nomenclature.vendor_code}}</td>
                    <td>{{item.nomenclature.cost_price}}</td>
                    <td>{{item.quantity}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            postavka: {},

            loader: true,
        }
    },
    created() {
        this.loadPostavka()
    },
    methods: {
        loadPostavka() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka/${this.$route.params.uuid}`)
                .then(response => {
                    this.postavka = response.data

                    this.loader = false
                })
        },
        provod() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/ff-postavka/${this.$route.params.uuid}/provod`)
                .then(response => {
                    this.$router.push({name: 'Postavkas'})
                })
        },
    },
}
</script>