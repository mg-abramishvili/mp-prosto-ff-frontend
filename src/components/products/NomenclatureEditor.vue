<template>
    <form @submit.prevent="save" class="very-big flex">
        <div class="border rounded bg-light-subtle p-4 mb-4">
            <div class="row">
                <!--                                <div class="col-12 col-lg-4">-->
                <!--                                    <div class="mb-3">-->
                <!--                                        <label>Тип</label>-->
                <!--                                        <span class="form-control bg-light">{{ type }}</span>-->
                <!--                                    </div>-->
                <!--                                </div>-->
                <div class="col-12 col-lg-6">
                    <div class="mb-3">
                        <label>Наименование</label>
                        <input v-model="title" type="text" class="form-control">
                    </div>
                </div>
                <div v-if="type === 'tovar' || type === 'raskhodnik'"
                     class="col-12 col-lg-6">
                    <div class="mb-3">
                        <label>Артикул</label>
                        <input v-model="artnumber" type="text" class="form-control">
                    </div>
                </div>
                <div v-if="type === 'tovar' || type === 'raskhodnik'"
                     class="col-12 col-lg-4">
                    <div class="mb-3">
                        <label>Производитель</label>
                        <input v-model="brand" type="text" class="form-control">
                    </div>
                </div>
                <div v-if="type === 'tovar' || type === 'raskhodnik'"
                     class="col-12 col-lg-3">
                    <div class="mb-3">
                        <label>Размер</label>
                        <input v-model="tech_size" type="text" class="form-control">
                    </div>
                </div>
                <div class="col-12 col-lg-3">
                    <div class="mb-3">
                        <label>Себестоимость</label>
                        <input v-model="costPrice" type="number" min="0" step=".01" class="form-control">
                    </div>
                </div>
                <div class="col-12 col-lg-2">
                    <div class="mb-3">
                        <label>Кол-во</label>
                        <input v-model="quantity" type="number" min="1" class="form-control">
                    </div>
                </div>
                <div class="col-12">
                    <label>Комментарий</label>
                    <textarea v-model="comment" class="form-control"></textarea>
                </div>
            </div>

            <div class="mt-4">
                <button
                    type="submit"
                    :disabled="!views.saveButton"
                    class="btn btn-primary">
                    {{ nomenclature ? 'Сохранить изменения' : 'Добавить новую номенклатуру' }}
                </button>

                <button
                    @click="$parent.editor = false"
                    class="btn btn-outline-secondary ms-2">
                    Отмена
                </button>
            </div>
        </div>
    </form>
</template>
<script>
export default {
    props: ['size', 'type'],
    data() {
        return {
            nomenclature: null,

            artnumber: this.newArtnumber(),
            title: this.type === 'tovar' ? this.size.title : '',
            brand: this.type === 'tovar' ? this.size.brand : '',
            costPrice: 0,
            quantity: 1,
            comment: '',
            tech_size: this.type === 'tovar' ? this.size.tech_size : '',

            views: {
                saveButton: true,
            }
        }
    },
    mounted() {
        this.emitter.on('editNomenclature', nomenclature => {
            this.nomenclature = nomenclature

            this.artnumber = nomenclature.vendor_code
            this.title = nomenclature.title
            this.brand = nomenclature.brand
            this.costPrice = nomenclature.cost_price
            this.quantity = 1
            this.comment = ''
            this.tech_size = nomenclature.tech_size
        })
    },
    methods: {
        newArtnumber() {
            if (this.type === 'usluga' || this.type === 'raskhodnik') {
                return '-'
            }

            let techSize = ''

            if (this.size.tech_size) {
                techSize = this.size.tech_size
                    .replace(' ', '-')
                    .replace('(', '')
                    .replace(')', '')
            }

            return this.size.vendor_code + '-' + techSize
        },
        save() {
            if (!this.title) {
                return this.$toast.error('Заполните наименование')
            }

            if (this.type === 'tovar' && !this.artnumber) {
                return this.$toast.error('Укажите артикул')
            }

            if (this.type === 'raskhodnik' && !this.artnumber) {
                return this.$toast.error('Укажите артикул')
            }

            if (this.type === 'tovar' && !this.brand) {
                return this.$toast.error('Укажите производителя')
            }

            if (this.type === 'raskhodnik' && !this.brand) {
                return this.$toast.error('Укажите производителя')
            }

            if (this.costPrice === 0) {
                return this.$toast.error('Укажите себестоимость')
            }

            if (this.quantity === 0) {
                return this.$toast.error('Укажите количество')
            }

            this.views.saveButton = false

            axios({
                method: this.nomenclature ? 'put' : 'post',
                url: this.nomenclature ? `${import.meta.env.VITE_API_FF_SERVER}/api/nomenclature/${this.nomenclature.uuid}/update` : `${import.meta.env.VITE_API_FF_SERVER}/api/ff-nomenclatures`,
                data: {
                    contragent: this.size.company_uuid,
                    size_id: this.size.id,
                    type: this.type,
                    vendor_code: this.artnumber,
                    artnumber: this.artnumber,
                    title: this.title,
                    brand: this.brand,
                    cost_price: this.costPrice,
                    quantity: this.quantity,
                    comment: this.comment,
                    tech_size: this.tech_size
                }
            }).then(response => {
                this.emitter.emit('reloadNomenclaturesList')

                if (!this.nomenclature) {
                    setTimeout(() => {
                        this.emitter.emit('selectNomenclature', response.data)
                    }, 100)
                }

                this.title = ''
                this.artnumber = '-'
                this.brand = ''
                this.tech_size = ''
                this.costPrice = 0
                this.quantity = 1

                this.nomenclature = null

                this.$parent.editor = false

                this.views.saveButton = true
            }).catch(error => {
                this.views.saveButton = true

                return this.$toast.error(error.response.data ? error.response.data : error)
            })
        },
    },
}
</script>