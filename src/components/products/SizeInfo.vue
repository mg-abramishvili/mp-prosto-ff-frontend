<template>
    <ul class="list-unstyled">
        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-category ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Категория:</span>
            <span>{{ size.subject_name }}</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-brand-vue ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Бренд:</span>
            <span>{{ size.brand }}</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-ruler-measure ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Размеры (д * ш * в):</span>
            <span>{{ size.length }} * {{ size.width }} * {{ size.height }} см</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-cube ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Объем:</span>
            <span>{{ size.litres }} л</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-barcode ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Артикул WB:</span>
            <span>{{ size.nm_id }}</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-scan ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Артикул продавца:</span>
            <span>{{ size.vendor_code }}</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-tag ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Цена:</span>
            <span>{{ $filters.currency(size.price) }}</span>
        </li>

        <li class="d-flex align-items-center mb-3">
            <span class="badge bg-label-primary p-1 rounded me-2">
                <i class="ti ti-tag-off ti-xs"></i>
            </span>
            <span class="fw-medium me-2">Цена со скидкой:</span>
            <span>{{ $filters.currency(size.price - size.price / 100 * size.discount) }}</span>
        </li>
    </ul>
</template>
<script>
export default {
    props: ['size'],
}
</script>