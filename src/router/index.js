import {createRouter, createWebHistory} from 'vue-router'

import Home from '../components/Index.vue'
import Nomenclatures from '../components/nomenclatures/Index.vue'

import Contragents from '../components/contragents/Index.vue'
import ContragentEditor from '../components/contragents/Editor.vue'

import Stocks from '../components/stocks/Index.vue'
import StockEditor from '../components/stocks/Editor.vue'

import Postavkas from '../components/postavkas/Index.vue'
import PostavkaEditor from '../components/postavkas/Editor.vue'

import Products from '../components/products/Index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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
            path: '/contragent-editor/:uuid?',
            name: 'ContragentEditor',
            component: ContragentEditor
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
            path: '/postavka-editor/:uuid?',
            name: 'PostavkaEditor',
            component: PostavkaEditor
        },
        {
            path: '/products',
            name: 'Products',
            component: Products
        },
    ]
})

export default router
