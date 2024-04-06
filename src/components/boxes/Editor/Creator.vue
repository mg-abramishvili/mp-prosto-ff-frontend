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
    emits: ['addSize', 'closeCreator'],
    data() {
        return {
            title: '',
            vendor_code: '',
            cost_price: 0,
        }
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
                .post(`${import.meta.env.VITE_API_FF_SERVER}/api/ff-nomenclatures`, {
                    contragent: this.contragent,
                    type: this.type,
                    title: this.title,
                    vendor_code: this.vendor_code,
                    cost_price: this.cost_price,
                    size_id: this.size.id,
                })
                .then(response => {
                    this.$emit('addNomenclature', response.data)
                    this.$emit('closeCreator')
                })
        },
    },
}
</script>