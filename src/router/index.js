import {createRouter, createWebHistory} from 'vue-router'

import Login from '../components/auth/Login.vue'
import Register from '../components/auth/Register.vue'

import Wizard from '../components/wizard/Index.vue'

import Home from '../components/Index.vue'
import Nomenclatures from '../components/nomenclatures/Index.vue'

import Contragents from '../components/contragents/Index.vue'
import ContragentMaster from '../components/contragents/Master.vue'
import ContragentSearch from '../components/contragents/Search.vue'

import Stocks from '../components/stocks/Index.vue'
import StockEditor from '../components/stocks/Editor.vue'

import Postavkas from '../components/postavkas/Index.vue'
import Postavka from '../components/postavkas/Postavka.vue'
import PostavkaEditor from '../components/postavkas/Editor.vue'

import Sborkas from '../components/sborkas/Index.vue'
import Sborka from '../components/sborkas/Sborka.vue'
import SborkaEditor from '../components/sborkas/Editor.vue'

import Boxes from '../components/boxes/Index.vue'
import Box from '../components/boxes/Box.vue'
import BoxEditor from '../components/boxes/Editor.vue'

import Palets from '../components/palets/Index.vue'
import Palet from '../components/palets/Palet.vue'
import PaletEditor from '../components/palets/Editor.vue'

import Shipments from '../components/shipments/Index.vue'
import Shipment from '../components/shipments/Shipment.vue'
import ShipmentEditor from '../components/shipments/Editor.vue'

import Products from '../components/products/Index.vue'
import Size from '../components/products/Size.vue'
import ProductEditor from '../components/products/Editor.vue'

import NomUslugas from '../components/nom-uslugas/Index.vue'
import NomUslugaCategory from '../components/nom-uslugas/Category.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/register',
            name: 'Register',
            component: Register
        },
        {
            path: '/wizard',
            name: 'Wizard',
            component: Wizard
        },
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/nomenclatures',
            name: 'Nomenclatures',
            component: Nomenclatures
        },
        {
            path: '/contragents',
            name: 'Contragents',
            component: Contragents
        },
        {
            path: '/contragent-master/:uuid?',
            name: 'ContragentMaster',
            component: ContragentMaster
        },
        {
            path: '/contragent-search',
            name: 'ContragentSearch',
            component: ContragentSearch
        },
        {
            path: '/stocks',
            name: 'Stocks',
            component: Stocks
        },
        {
            path: '/stock-editor/:uuid?',
            name: 'StockEditor',
            component: StockEditor
        },
        {
            path: '/postavkas',
            name: 'Postavkas',
            component: Postavkas
        },
        {
            path: '/postavka/:uuid',
            name: 'Postavka',
            component: Postavka
        },
        {
            path: '/postavka-editor/:uuid?',
            name: 'PostavkaEditor',
            component: PostavkaEditor
        },
        {
            path: '/sborkas',
            name: 'Sborkas',
            component: Sborkas
        },
        {
            path: '/sborka/:uuid',
            name: 'Sborka',
            component: Sborka
        },
        {
            path: '/sborka-editor/:uuid?',
            name: 'SborkaEditor',
            component: SborkaEditor
        },
        {
            path: '/boxes',
            name: 'Boxes',
            component: Boxes
        },
        {
            path: '/box/:uuid',
            name: 'Box',
            component: Box
        },
        {
            path: '/box-editor/:uuid?',
            name: 'BoxEditor',
            component: BoxEditor
        },
        {
            path: '/palets',
            name: 'Palets',
            component: Palets
        },
        {
            path: '/palet/:uuid',
            name: 'Palet',
            component: Palet
        },
        {
            path: '/palet-editor/:uuid?',
            name: 'PaletEditor',
            component: PaletEditor
        },
        {
            path: '/shipments',
            name: 'Shipments',
            component: Shipments
        },
        {
            path: '/shipment/:uuid',
            name: 'Shipment',
            component: Shipment
        },
        {
            path: '/shipment-editor/:uuid?',
            name: 'ShipmentEditor',
            component: ShipmentEditor
        },
        {
            path: '/products',
            name: 'Products',
            component: Products
        },
        {
            path: '/product-editor/:uuid?',
            name: 'ProductEditor',
            component: ProductEditor
        },
        {
            path: '/size/:uuid',
            name: 'Size',
            component: Size
        },
        {
            path: '/nom-uslugas',
            name: 'NomUslugas',
            component: NomUslugas
        },
        {
            path: '/nom-usluga-category/:id',
            name: 'NomUslugaCategory',
            component: NomUslugaCategory
        },
    ]
})

export default router
