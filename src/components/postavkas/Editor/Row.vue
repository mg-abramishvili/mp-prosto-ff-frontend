<template>
    <td>{{ nomenclature.type }}</td>
    <td>{{ nomenclature.title }}</td>
    <td>{{ nomenclature.vendor_code }}</td>
    <td>{{ nomenclature.cost_price }}</td>
    <td style="width: 150px;">
        <input
            v-model="$parent.nomenclatures.find(n => n.id === nomenclature.id).quantity"
            type="number"
            class="form-control form-select-sm text-center">
    </td>
    <td class="text-end">

    </td>
</template>
<script>
export default {
    props: ['nomenclature'],
}
</script>