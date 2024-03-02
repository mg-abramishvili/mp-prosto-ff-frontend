<template>
	<ul id="accordionSidebar" class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" :class="{ 'toggled': isToggled }">

		<router-link :to="{name: 'Home'}" class="sidebar-brand d-flex align-items-center justify-content-center">
			<div class="sidebar-brand-icon rotate-n-15">
				<i class="fas fa-dharmachakra"></i>
			</div>
			<div class="sidebar-brand-text mx-3">WBSKLAD.RU</div>
		</router-link>

		<li class="nav-item">
			<router-link :to="{name: 'Products'}" class="nav-link">
				<i class="fas fa-fw fa-folder"></i>
				<span>Товары WB</span>
			</router-link>
		</li>

        <li class="nav-item">
            <router-link :to="{name: 'Sizes'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Размеры</span>
            </router-link>
        </li>

		<li class="nav-item">
			<router-link :to="{name: 'Nomenclatures'}" class="nav-link">
				<i class="fas fa-fw fa-folder"></i>
				<span>Номенклатура</span>
			</router-link>
		</li>

        <li class="nav-item">
            <router-link :to="{name: 'Voronkas'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Воронки</span>
            </router-link>
        </li>

        <li class="nav-item">
            <router-link :to="{name: 'Comissions'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Комиссии</span>
            </router-link>
        </li>

        <li class="nav-item">
            <router-link :to="{name: 'Coefficients'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Коэффиценты</span>
            </router-link>
        </li>

        <li class="nav-item">
            <router-link :to="{name: 'CoefLogistik'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Коэф Логистика</span>
            </router-link>
        </li>

        <li class="nav-item">
            <router-link :to="{name: 'UnitEconomic'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Юнит Экономика</span>
            </router-link>
        </li>

        <li class="nav-item">
            <router-link :to="{name: 'UnitCalculator'}" class="nav-link">
                <i class="fas fa-fw fa-folder"></i>
                <span>Юнит Калькулятор</span>
            </router-link>
        </li>

		<button @click="toggle()" class="rounded-circle border-0" id="sidebarToggle"></button>

	</ul>
</template>

<script>
export default {
	data() {
		return {
			isToggled: false,
		}
	},
	methods: {
		toggle() {
			if(this.isToggled == true) {
				this.isToggled = false
				document.body.classList.remove('sidebar-toggled')
				return
			}
			if(this.isToggled == false) {
				this.isToggled = true
				document.body.classList.add('sidebar-toggled')
				return
			}
		}
	}
}
</script>
