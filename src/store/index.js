import { createStore } from 'vuex'

const store = createStore({
    state() {
        return {
            user: {},
            company: {},

            contragents: [],
            stocks: [],
        }
    },
    mutations: {
        setUser(state, user) {
            state.user = user
        },
        setCompany(state, company) {
            state.company = company
        },
        setContragents(state, contragents) {
            state.contragents = contragents
        },
        setStocks(state, stocks) {
            state.stocks = stocks
        },
    },
})

export default store
