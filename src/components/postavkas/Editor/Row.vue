<template>
    <td>{{ nomenclature.type }}</td>
    <td>{{ nomenclature.title }}</td>
    <td>{{ nomenclature.vendor_code }}</td>
    <td>{{ nomenclature.tech_size }}</td>
    <td>{{ nomenclature.brand }}</td>
    <td>
        <input
            v-model="$parent.nomenclatures.find(n => n.id === nomenclature.id).zakup_price"
            type="number"
            class="form-control form-select-sm text-center">
    </td>
    <td style="width: 150px;">
        <input
            v-model="$parent.nomenclatures.find(n => n.id === nomenclature.id).quantity"
            type="number"
            class="form-control form-select-sm text-center">
    </td>
    <td class="text-end">
        <button @click="$parent.nomenclatures = $parent.nomenclatures.filter(n => n.id !== nomenclature.id)" class="btn btn-sm btn-outline-danger">
            &times;
        </button>
    </td>
</template>
<script>
export default {
    props: ['nomenclature'],
}
</script>