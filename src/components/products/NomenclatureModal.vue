<template>
    <div
        id="modal"
        class="modal fade show"
        style="display: block;"
        tabindex="-1"
        role="dialog">
        <div class="modal-dialog modal-xl modal-simple">
            <div class="modal-content p-3 p-md-5">
                <div class="modal-body p-0">
                    <div v-if="overlay" class="overlay">
                        <Loader/>
                    </div>

                    <button @click="emitter.emit('toggleEditorModal', null)"
                            type="button"
                            class="btn-close">
                    </button>

                    <div class="row">
                        <div class="col-lg-6">
                            <h4 class="m-0">Выбор номенклатуры</h4>
                        </div>
                        <div class="col-lg-6 text-end">
                            <button
                                v-if="!editor"
                                @click="editor = true"
                                class="btn btn-sm btn-primary">
                                + Создать номенклатуру
                            </button>
                        </div>
                    </div>

                    <NomenclatureEditor
                        v-if="editor"
                        :size="size"
                        :type="editorType"
                    />

                    <NomenclaturesList
                        v-if="!editor"
                        :selected-nomenclatures="nomenclatures"
                        :type="editorType"
                        :size="size"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="modal-backdrop fade show"></div>
</template>

<script>
import NomenclatureEditor from "./NomenclatureEditor.vue"
import NomenclaturesList from "./NomenclaturesList.vue"

export default {
    props: ['size', 'nomenclatures', 'editorType', 'overlay'],
    data() {
        return {
            editor: false,
        }
    },
    components: {
        NomenclatureEditor,
        NomenclaturesList,
    },
}
</script>