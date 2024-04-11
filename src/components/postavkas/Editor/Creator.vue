<template>
    <tr class="bg-warning-subtle">
        <td>
            <select v-model="type" class="form-select form-select-sm">
                <option value="tovar">Товар</option>
                <option value="raskhodnik">Расходник</option>
                <option value="usluga">Услуга</option>
            </select>
        </td>
        <td>
            <input v-model="title" type="text" class="form-control form-control-sm">
        </td>
        <td>
            <input v-model="vendor_code" type="text" class="form-control form-control-sm">
        </td>
        <td>
            <input v-model="tech_size" type="text" class="form-control form-control-sm">
        </td>
        <td>
            <input v-model="brand" type="text" class="form-control form-control-sm">
        </td>
        <td>
            <input v-model="cost_price" type="number" class="form-control form-control-sm">
        </td>
        <td style="width: 150px;">

        </td>
        <td class="text-end">
            <button @click="save()" class="btn btn-sm btn-outline-primary">OK</button>
        </td>
    </tr>
</template>
<script>
import axios from "axios";

export default {
    props: ['size', 'contragent'],
    emits: ['addNomenclature', 'closeCreator'],
    data() {
        return {
            type: 'tovar',
            title: '',
            vendor_code: '',
            tech_size: '',
            brand: '',
            cost_price: 0,
        }
    },
    created() {
        this.title = this.size.product.title
        this.vendor_code = this.newArtnumber()
        this.tech_size = this.size.tech_size
        this.brand = this.size.product.brand
    },
    methods: {
        save() {
            if(!this.type) {
                return this.$toast.error('Укажите тип')
            }

            if(!this.title) {
                return this.$toast.error('Укажите наименование')
            }

            if(!this.vendor_code) {
                return this.$toast.error('Укажите артикул')
            }

            if(!this.cost_price || this.cost_price === 0) {
                return this.$toast.error('Укажите себестоимость')
            }

            axios
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/nomenclatures`, {
                    contragent: this.contragent,
                    type: this.type,
                    title: this.title,
                    vendor_code: this.vendor_code,
                    tech_size: this.tech_size,
                    brand: this.brand,
                    cost_price: this.cost_price,
                    size_id: this.size.id,
                })
                .then(response => {
                    this.$emit('addNomenclature', response.data)
                    this.$emit('closeCreator')
                })
        },
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

            return this.size.product.vendor_code + '-' + techSize
        },
    },
}
</script>