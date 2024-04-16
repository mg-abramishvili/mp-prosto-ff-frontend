<template>
    <div class="row align-items-center mb-4">
        <div class="col-12 col-lg-6">
            <h4 class="py-3 m-0">Услуги</h4>
        </div>
        <div class="col-12 col-lg-6 text-end">
            <!--            <RouterLink :to="{name: 'NomUslugaMaster'}" class="btn btn-primary ms-2">-->
            <!--                Добавить-->
            <!--            </RouterLink>-->
        </div>
    </div>

    <div v-if="!views.loading && categories.length" class="card tree-list">
        <div class="card-body">
            <tree
                v-for="category in categories"
                :category="category"
            />
        </div>
    </div>
</template>

<script>
import tree from "./Category.vue"

export default {
    data() {
        return {
            categories: [],

            views: {
                loading: true,
            }
        }
    },
    created() {
        this.loadNomUslugaCategories()
    },
    methods: {
        loadNomUslugaCategories() {
            axios.get(`${import.meta.env.VITE_API_FF_SERVER}/api/nom-usluga-categories`)
                .then(response => {
                    if (response.data) {
                        this.categories = response.data
                    }
                    this.views.loading = false
                })
        },
    },
    components: {
        tree,
    },
}
</script>
