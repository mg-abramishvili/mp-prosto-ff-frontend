<template>
    <h4 class="py-3 mb-4">{{ size.title }} - {{ size.tech_size }}</h4>

    <Loader v-if="views.loading"/>

    <div v-if="!views.loading" class="row">
        <div class="col-xl-4 col-lg-5 col-md-5 order-1 order-md-0">
            <div class="card mb-4">
                <div class="card-body">
                    <div class="customer-avatar-section">
                        <div class="d-flex align-items-center flex-column">
                            <img
                                class="img-fluid rounded my-3"
                                :src="size.photo"
                                height="200"
                                width="200"
                                alt="">
                        </div>
                    </div>

                    <div class="d-flex justify-content-around flex-wrap my-4">
                        <div class="d-flex align-items-center gap-2">
                            <div class="avatar">
                                <div class="avatar-initial rounded bg-label-primary">
                                    <i class="ti ti-currency-rubel ti-md"></i>
                                </div>
                            </div>
                            <div class="gap-0 d-flex flex-column">
                                <p class="mb-0 fw-medium">{{ $filters.currencyDecimal(pricePreview) }}</p>
                                <small>Себестоимость</small>
                            </div>
                        </div>

                        <a href="#" @click="views.costPriceHistory = true"
                           class="btn btn-primary me-3 waves-effect waves-light">
                            История
                        </a>
                    </div>

                    <div class="info-container">
                        <small
                            class="d-block pt-4 border-top fw-normal text-uppercase text-muted my-3">
                            Информация
                        </small>

                        <SizeInfo :size="size"/>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xl-8 col-lg-7 col-md-7 order-0 order-md-1">
            <SizeNomenclatures
                v-for="type in nomenclatureTypes"
                :type="type"
                :nomenclatures="nomenclatures"
                :overlay="views.overlay"
            />

            <SizeDostavka
                :dostavka="dostavka"
                :overlay="views.overlay"
            />
        </div>
    </div>

    <NomenclatureModal
        v-if="nomenclaturesModal"
        :overlay="views.overlay"
        :editor-type="nomenclaturesModal"
        :size="size"
        :nomenclatures="nomenclatures"
    />

    <CostPriceHistory
        v-if="views.costPriceHistory"
        :size-id="size.id"
        :history="size.cost_price_history"
    />
</template>

<script>
import CostPriceHistory from "./CostPriceHistory.vue"
import SizeInfo from "./SizeInfo.vue"
import SizeNomenclatures from "./SizeNomenclatures.vue"
import SizeDostavka from "./SizeDostavka.vue"
import NomenclatureModal from "./NomenclatureModal.vue"

export default {
    data() {
        return {
            size: {},

            nomenclatures: [],

            dostavka: {
                ff: 0,
                mp: 0,
            },

            nomenclatureTypes: ['tovar', 'raskhodnik', 'usluga'],

            nomenclaturesModal: null,

            views: {
                loading: true,
                overlay: false,
                costPriceHistory: false,
            },
        }
    },
    computed: {
        pricePreview() {
            if (!this.nomenclatures.length) {
                return 0
            }

            let nomSumArray = []

            this.nomenclatures.forEach(nom => {
                nomSumArray.push(nom.cost_price * nom.quantity)
            })

            let nomSum = nomSumArray.reduce(function (a, b) {
                return a + b
            })

            return nomSum + this.dostavka.ff + this.dostavka.mp
        }
    },
    created() {
        this.loadSize()
    },
    mounted() {
        this.emitter.on('toggleEditorModal', type => {
            this.nomenclaturesModal = type

            if(!type) {
                this.loadSize()
            }
        })

        this.emitter.on('selectNomenclature', nomenclature => {
            this.selectNomenclature(nomenclature)
        })

        this.emitter.on('updateNomenclatureQuantity', nomenclature => {
            this.updateNomenclatureQuantity(nomenclature.id, nomenclature.quantity)
        })

        this.emitter.on('updateDostavka', dostavka => {
            this.updateDostavka(dostavka)
        })
    },
    methods: {
        loadSize() {
            axios
                .get(`${import.meta.env.VITE_API_SERVER}/api/size/${this.$route.params.uuid}`)
                .then(response => {
                    this.size = response.data.data

                    this.nomenclatures = response.data.data.nomenclatures
                        .map(({id, uuid, title, vendor_code, type, cost_price, pivot}) => ({
                            id: id,
                            uuid: uuid,
                            title: title,
                            vendor_code: vendor_code,
                            type: type,
                            cost_price: cost_price,
                            quantity: pivot.quantity,
                        }))

                    this.dostavka.mp = response.data.data.cost_price ? response.data.data.cost_price.dostavka_do_mp : 0
                    this.dostavka.ff = response.data.data.cost_price ? response.data.data.cost_price.dostavka_do_ff : 0

                    this.views.loading = false
                    this.views.overlay = false
                })
        },
        selectNomenclature(nomenclature) {
            this.views.overlay = true

            let nomenclatures = this.nomenclatures.map((x) => x)

            let isNomenclatureSelected = nomenclatures.find(n => n.id === nomenclature.id)

            if (isNomenclatureSelected) {
                nomenclatures = nomenclatures.filter(n => n.id !== nomenclature.id)
            } else {
                nomenclatures.push({
                    id: nomenclature.id,
                    uuid: nomenclature.uuid,
                    title: nomenclature.title,
                    vendor_code: nomenclature.vendor_code,
                    type: nomenclature.type,
                    cost_price: nomenclature.cost_price,
                    quantity: 1,
                })
            }

            this.nomenclatures = nomenclatures

            this.save()
        },
        updateNomenclatureQuantity(nomenclatureID, quantity) {
            let nomenclature = this.nomenclatures.find(n => n.id === nomenclatureID)

            nomenclature.quantity = quantity > 0 ? quantity : 1

            this.save()
        },
        updateDostavka(dostavka) {
            this.dostavka = dostavka

            this.save()
        },
        save() {
            if(this.pricePreview === 0) {
                this.$toast.error('Себестоимость не может быть 0')

                return this.views.overlay = false
            }

            this.views.overlay = true

            axios
                .put(`${import.meta.env.VITE_API_SERVER}/api/size/${this.$route.params.uuid}/update`, {
                    cost_price: this.pricePreview,
                    dostavka_do_ff: this.dostavka.ff,
                    dostavka_do_mp: this.dostavka.mp,
                    nomenclatures: this.nomenclatures,
                })
                .then(response => {
                    this.$toast.success('Изменения сохранены')

                    setTimeout(() => {
                        this.loadSize()
                    }, 1000)
                })
        },
    },
    components: {
        NomenclatureModal,
        SizeInfo,
        SizeNomenclatures,
        CostPriceHistory,
        SizeDostavka,
    },
}
</script>