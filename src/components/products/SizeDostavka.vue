<template>
    <div class="row">
        <div class="col-12 col-lg-6">
            <div class="card">
                <div v-if="overlay" class="overlay">
                    <Loader />
                </div>
                <div class="card-body text-center">
                    <div class="badge rounded-pill p-2 bg-label-warning mb-2">
                        <i class="ti ti-package-import ti-sm"></i>
                    </div>
                    <h5 class="card-title mb-2">Доставка до фуллфилмента</h5>
                    <div class="mb-0">
                        <input :value="ff" @change="changeDostavkaFF($event)" type="number" class="form-control">
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12 col-lg-6">
            <div class="card">
                <div v-if="overlay" class="overlay">
                    <Loader />
                </div>
                <div class="card-body text-center">
                    <div class="badge rounded-pill p-2 bg-label-success mb-2">
                        <i class="ti ti-package-export ti-sm"></i>
                    </div>
                    <h5 class="card-title mb-2">Доставка до маркетплейса</h5>
                    <div class="mb-0">
                        <input :value="mp" @change="changeDostavkaMP($event)" type="number" class="form-control">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['dostavka', 'overlay'],
    emits: ['updateDostavka'],
    data() {
        return {
            ff: 0,
            mp: 0,
        }
    },
    created() {
        this.ff = this.dostavka.ff
        this.mp = this.dostavka.mp
    },
    methods: {
        changeDostavkaFF(event) {
            this.ff = parseInt(event.target.value)

            this.updateDostavka()
        },
        changeDostavkaMP(event) {
            this.mp = parseInt(event.target.value)

            this.updateDostavka()
        },
        updateDostavka() {
            let dostavka = {
                ff: this.ff,
                mp: this.mp
            }

            this.emitter.emit('updateDostavka', dostavka)
        },
    },
}
</script>