<template>
    <div>
        <button @click="toggleCategory(category.id)" class="tree-list-item">
            +
            {{ category.name }}
        </button>

        <template v-for="childCategory in category.children">
            <tree
                v-if="opened.categories.includes(childCategory.id)"
                :category="childCategory"
            />
        </template>
    </div>
</template>

<script>
export default {
    props: ['category'],
    name: 'tree',
    data() {
        return {
            opened: {
                categories: [],
            },
        }
    },
    methods: {
        loadCategory(id) {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/nom-usluga-category/${id}`)
                .then(response => {
                    this.opened.categories.push(response.data.id)
                })
        },
        toggleCategory(id) {
            console.log(this.opened.categories)
            if(this.opened.categories.includes(id)) {
                this.opened.categories = this.opened.categories.filter(c => c !== id)
            } else {
                this.loadCategory(id)
            }
        },
    },
}
</script>
