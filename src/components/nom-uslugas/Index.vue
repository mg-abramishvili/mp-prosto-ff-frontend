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

    <div v-if="!views.loading" class="card tree-list">
        <div class="card-body">
            <ul>
                <TreeItem class="item" :category="treeData"></TreeItem>
            </ul>
        </div>
    </div>
</template>

<script>
import TreeItem from "./Category.vue"

export default {
    data() {
        return {
            treeData: {
                name: 'Услуги',
                children: [
                    { name: 'hello' },
                    { name: 'wat' },
                    {
                        name: 'child folder',
                        children: [
                            {
                                name: 'child folder',
                                children: [{ name: 'hello' }, { name: 'wat' }]
                            },
                            { name: 'hello' },
                            { name: 'wat' },
                            {
                                name: 'child folder',
                                children: [{ name: 'hello' }, { name: 'wat' }]
                            }
                        ]
                    }
                ]
            },

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
                        this.treeData.children = response.data
                    }
                    this.views.loading = false
                })
        },
    },
    components: {
        TreeItem,
    },
}
</script>
<style>
.item {
    cursor: pointer;
    line-height: 1.5;
}
.bold {
    font-weight: bold;
}
</style>