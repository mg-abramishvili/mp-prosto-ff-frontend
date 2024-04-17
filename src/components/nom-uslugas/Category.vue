<template>
    <li>
        <div
            :class="{ bold: isFolder }"
            @click="toggle">
            <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
            {{ category.name }}
        </div>
        <ul v-if="isOpen">
            <TreeItem
                class="item"
                v-for="childCategory in category.children"
                :category="childCategory">
            </TreeItem>
            <li
                v-for="usluga in category.uslugas">
                {{ usluga.name }}
            </li>
        </ul>
    </li>
</template>

<script>
export default {
    props: ['category'],
    name: 'TreeItem',
    data() {
        return {
            isOpen: false,
        }
    },
    computed: {
        isFolder() {
            return this.category.children && this.category.children.length || this.category.uslugas && this.category.uslugas.length
        }
    },
    created() {
        if (this.category.id) {
            this.loadCategory(this.category.id)
        }
    },
    methods: {
        loadCategory(id) {
            axios
                .get(`${import.meta.env.VITE_API_FF_SERVER}/api/nom-usluga-category/${id}`)
                .then(response => {
                    if (response.data.children && response.data.children.length) {
                        this.category.children = response.data.children
                    }

                    if (response.data.uslugas && response.data.uslugas.length) {
                        this.category.uslugas = response.data.uslugas
                    }
                })
        },
        toggle() {
            if (this.isFolder) {
                this.isOpen = !this.isOpen
            }
        },
    },
}
</script>
