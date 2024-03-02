<template>
    <ul class="menu-inner py-1">
        <li class="menu-item">
            <RouterLink :to="{name: 'Nomenclatures'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-database"></i>
                <div>Номенклатуры</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Contragents'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-database"></i>
                <div>Контрагенты</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Stocks'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-database"></i>
                <div>Склады</div>
            </RouterLink>
        </li>
    </ul>
</template>

<script>
export default {
    data() {
        return {
            //
        }
    },
    methods: {
        openMenuItem(item) {
            document.getElementById(item).classList.add('open')
        },
        closeMenuItem(item) {
            document.getElementById(item).classList.remove('open')
        },
    }
}
</script>
