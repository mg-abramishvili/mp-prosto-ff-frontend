<template>
    <td>{{ size.title }}</td>
    <td>{{ size.vendor_code }}</td>
    <td>{{ size.tech_size }}</td>
    <td>
        <select v-model="$parent.sizes.find(n => n.id === size.id).barcode" class="form-select">
            <option v-for="sku in size.skus" :value="sku.barcode">{{sku.barcode}}</option>
        </select>
    </td>
    <td style="width: 150px;">
        <input
            v-model="$parent.sizes.find(n => n.id === size.id).quantity"
            type="number"
            class="form-control form-select-sm text-center">
    </td>
    <td class="text-end">

    </td>
</template>
<script>
export default {
    props: ['size'],
}
</script>