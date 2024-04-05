<template>
    <div class="card card-action mb-4">
        <div v-if="overlay" class="overlay">
            <Loader/>
        </div>
        <div class="card-header align-items-center py-4">
            <h5 class="card-action-title mb-0">
                {{ title }}
            </h5>
            <div class="card-action-element">
                <button
                    @click="emitter.emit('toggleEditorModal', type)"
                    class="btn btn-label-primary waves-effect">
                    Редактировать
                </button>
            </div>
        </div>
        <div class="card-body">
            <table
                v-if="nomenclatures.filter(n => n.type === type).length"
                class="table table-hover">
                <thead>
                <tr>
                    <th class="w-60 px-0">Наименование</th>
                    <th class="w-20 text-end px-0">Себестоимость</th>
                    <th class="w-20 text-end px-0">Кол-во</th>
                </tr>
                </thead>
                <tbody class="table-border-bottom-0">
                <tr v-for="nomenclature in nomenclatures.filter(n => n.type === type)">
                    <td class="px-0 py-3">
                        <span class="fw-medium">{{ nomenclature.title }}</span>
                        <span class="mb-0 d-block text-muted">{{ nomenclature.vendor_code }}</span>
                    </td>
                    <td class="text-end px-0 py-3">
                        {{ $filters.currencyDecimal(nomenclature.cost_price) }}
                    </td>
                    <td class="text-end px-0 py-3">
                        <input
                            :value="nomenclature.quantity"
                            @change="emitter.emit('updateNomenclatureQuantity', {id: nomenclature.id, quantity: parseInt($event.target.value)})"
                            type="number"
                            min="1"
                            class="form-control form-control-sm text-center w-px-75 float-end">
                    </td>
                </tr>
                </tbody>
            </table>

            <span
                v-if="!nomenclatures.filter(n => n.type === type).length"
                class="text-muted">
                Пусто.
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['nomenclatures', 'type', 'overlay'],
    data() {
        return {
            typeNames: [
                {
                    id: 'tovar',
                    name: 'Номенклатура'
                },
                {
                    id: 'raskhodnik',
                    name: 'Расходники'
                },
                {
                    id: 'usluga',
                    name: 'Услуги'
                }
            ],

            views: {
                editor: false,
            },
        }
    },
    computed: {
        title() {
            return this.typeNames.find(n => n.id === this.type).name
        }
    },
}
</script>