<template>
    <td>
        <input v-model="title" type="text" class="form-control">
    </td>
    <td>
        <input v-model="artnumber" type="text" class="form-control">
    </td>
    <td style="width: 150px;">
        <input
            v-model="quantity"
            type="number"
            class="form-control form-select-sm text-center">
    </td>
</template>
<script>
export default {
    props: ['nomenclature'],
    data() {
        return {
            title: '',
            artnumber: '',
            vendor_code: '',
            quantity: 1,
        }
    },
}
</script>