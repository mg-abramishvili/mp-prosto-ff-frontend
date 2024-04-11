import {createRouter, createWebHistory} from 'vue-router'

import Login from '../components/auth/Login.vue'

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

import Products from '../components/products/Index.vue'
import Size from '../components/products/Size.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'Login',
            component: Login
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
            path: '/products',
            name: 'Products',
            component: Products
        },
        {
            path: '/size/:uuid',
            name: 'Size',
            component: Size
        },
    ]
})

export default router
