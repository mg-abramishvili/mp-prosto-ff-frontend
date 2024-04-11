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
                <i class="menu-icon tf-icons ti ti-users"></i>
                <div>Контрагенты</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Stocks'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-building-warehouse"></i>
                <div>Склады</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Postavkas'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-transfer-in"></i>
                <div>Поступления</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Sborkas'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-category-2"></i>
                <div>Сборки</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Boxes'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-package"></i>
                <div>Коробки</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Palets'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-forklift"></i>
                <div>Палеты</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Shipments'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-truck-delivery"></i>
                <div>Отгрузки</div>
            </RouterLink>
        </li>

        <li class="menu-item">
            <RouterLink :to="{name: 'Products'}" href="" class="menu-link">
                <i class="menu-icon tf-icons ti ti-letter-w"></i>
                <div>Товары WB</div>
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
