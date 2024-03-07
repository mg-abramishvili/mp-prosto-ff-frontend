<template>
    <h4 class="py-3 mb-4">Новая поставка</h4>

    <div class="card mb-4">
        <div class="card-body">
            <div class="row">
                <div class="col-12 col-lg-6">
                    <div class="mb-4">
                        <label class="form-label">Контрагент</label>
                        <select v-model="selected.contragent" class="form-select">
                            <option v-for="contragent in contragents" :value="contragent.uuid">
                                {{ contragent.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="col-12 col-lg-6">
                    <div class="mb-4">
                        <label class="form-label">Дата поставки</label>
                        <input v-model="date" type="date" class="form-control">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <button @click="openNomenclatureSelector()" class="btn btn-primary">Добавить позицию</button>

    <div v-if="nomenclatures.length" class="card mt-4">
        <table class="table table-borderless table-hover mb-0">
            <thead class="border-bottom">
            <tr>
                <th>Наименование</th>
                <th>Артикул</th>
                <th>Кол-во</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="nomenclature in nomenclatures">
                <NomenclatureRow
                    v-if="nomenclature.id"
                    :nomenclature="nomenclature"
                />

                <NomenclatureRowEdit
                    v-if="!nomenclature.id"
                    :nomenclature="nomenclature"
                />
            </tr>
            </tbody>
        </table>
    </div>

    <NomenclatureSelector
        v-if="views.nomenclaturesSelector && selected.contragent"
        :contragent="selected.contragent"
        @add-nomenclature-to-postavka="addNomenclatureToPostavka"
        @add-nomenclatures-from-size-to-postavka="addNomenclaturesFromSizeToPostavka"
    />
</template>

<script>
import NomenclatureSelector from './NomenclatureSelector.vue'
import NomenclatureRow from './Editor/Row.vue'
import NomenclatureRowEdit from './Editor/RowEdit.vue'

export default {
    data() {
        return {
            contragents: [],

            nomenclatures: [],

            selected: {
                contragent: null,
            },

            date: '',

            views: {
                saveButton: true,
                nomenclaturesSelector: false,
            },
        }
    },
    created() {
        this.loadFFContragents()
    },
    methods: {
        loadFFContragents() {
            axios.get(`${import.meta.env.VITE_API_SERVER}/api/ff-contragents`)
                .then(response => {
                    if (response.data) {
                        this.contragents = response.data
                    }
                    this.views.loading = false
                })
        },
        openNomenclatureSelector() {
            if(!this.selected.contragent) {
                return this.$toast.error('Укажите контрагента')
            }

            this.views.nomenclaturesSelector = true
        },
        addNomenclatureToPostavka(nomenclature) {
            let isNomenclatureIsAlreadyAdded = this.nomenclatures.find(n => n.id === nomenclature.id)

            if (isNomenclatureIsAlreadyAdded) {
                return this.$toast.error('Номенклатура уже добавлена')
            }

            this.nomenclatures.push({
                id: nomenclature.id,
                title: nomenclature.title,
                vendor_code: nomenclature.vendor_code,
                quantity: 1,
            })

            // this.views.nomenclaturesSelector = false
        },
        addNomenclaturesFromSizeToPostavka(nomenclatures) {
            if(!nomenclatures.length) {
                if(confirm('У товара нет номенклатуры. Создать пустую для заполнения?')) {
                    this.nomenclatures.push({
                        id: null,
                        title: null,
                        vendor_code: null,
                        quantity: 1,
                    })
                }

                return
            }

            nomenclatures.forEach(nomenclature => {
                this.nomenclatures.push({
                    id: nomenclature.id,
                    title: nomenclature.title,
                    vendor_code: nomenclature.vendor_code,
                    quantity: 1,
                })
            })
        },
        save() {
            // this.views.saveButton = false
            //
            // axios
            //     .post(`${import.meta.env.VITE_API_SERVER}/api/ff-register`, {
            //         user_name: this.user.name,
            //         user_email: this.user.email,
            //         password: this.user.password,
            //         password_confirmation: this.user.password,
            //         company_name: this.company.name,
            //         company_inn: this.company.inn,
            //     })
            //     .then(response => {
            //         this.$router.push({name: 'Contragents'})
            //     })
            //     .catch(error => {
            //         this.$toast.error(error)
            //
            //         this.views.saveButton = true
            //     })
        },
    },
    components: {
        NomenclatureSelector,
        NomenclatureRow,
        NomenclatureRowEdit,
    },
}
</script>