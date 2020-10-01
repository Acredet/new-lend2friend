<template>
  <div>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="mb-6">
            <v-btn color="primary" @click="sliderState = true">
              Sliders
            </v-btn>
            <v-btn color="primary" @click="sliderState = false">
              Exakta värden
            </v-btn>
          </div>

          <v-row>
            <!-- Start Inputs -->
            <v-col cols="12" md="4" class="px-3">
              <div v-for="slider in sliders" :key="slider.label">
                <!-- Start Sliders -->
                <div v-if="sliderState">
                  <v-subheader class="pl-0">
                    {{ slider.label }}: {{ slidersValues[slider.model] ? `${slidersValues[slider.model]}` : '0' }} {{ slider.prepend }}
                  </v-subheader>
                  <v-slider v-model="slidersValues[slider.model]" :step="slider.step" :min="slider.min" :max="slider.max" thumb-label />
                </div>
                <!-- End Sliders -->

                <!-- Start Inputs -->
                <div v-else>
                  <v-subheader class="pl-0">
                    {{ slider.label }}: {{ slidersValues[slider.model] ? `${slidersValues[slider.model]}` : '0' }} {{ slider.prepend }}
                  </v-subheader>
                  <v-text-field
                    v-model="slidersValues[slider.model]"
                    type="number"
                    :label="slider.label"
                  />
                </div>
                <!-- End Inputs -->
              </div>
            </v-col>
            <!-- End Inputs -->

            <!-- Start Table -->
            <v-col cols="12" md="8" class="px-3">
              <loansTable />
            </v-col>
            <!-- End Table -->
          </v-row>
          <b>Aminuity : {{ aminuity }} kr</b>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn color="primary" to="/form">
          Continue
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import loansTable from '@/components/loansTable'
export default {
  name: 'StepOne',
  components: {
    loansTable
  },
  data () {
    return {
      today: null,
      sliderState: true,
      aminuity: 0,
      slidersValues: {
        loan: 0,
        term: 0,
        interest: 0
      },
      sliders: [
        { label: 'Lånebelopp', prepend: 'Kr', model: 'loan', min: 5000, max: 430000, step: 5000 },
        { label: 'löptid', prepend: 'månad', model: 'term', min: 1, max: 180, step: 1 },
        { label: 'Årsränta', prepend: '%', model: 'interest', min: 2.95, max: 39.50, step: 0.01 }
      ]
    }
  },
  watch: {
    slidersValues: {
      deep: true,
      immediate: true,
      handler (value) {
        console.log('changed')
        // Make sure the user will enter value between max and min
        this.slidersValues.loan = (value.loan > this.sliders[0].max) ? this.sliders[0].max : value.loan
        this.slidersValues.loan = (value.loan < this.sliders[0].min) ? this.sliders[0].min : value.loan

        this.slidersValues.term = (value.term > this.sliders[1].max) ? this.sliders[1].max : value.term
        this.slidersValues.term = (value.term < this.sliders[1].min) ? this.sliders[1].min : value.term

        this.slidersValues.interest = (value.interest > this.sliders[2].max) ? this.sliders[2].max : value.interest
        this.slidersValues.interest = (value.interest < this.sliders[2].min) ? this.sliders[2].min : value.interest

        this.calculateAmminuity(value.term)
      }
    }
  },
  mounted () {
    this.$forceUpdate()
  },
  methods: {
    changeStep (stepNo) {
      this.$emit('stepChanged', stepNo)
    },
    calculateAmminuity (val) {
      const p = this.slidersValues.interest / 12 / 100
      const A = (this.slidersValues.loan * (p * Math.pow(1 + p, this.slidersValues.term))) / (Math.pow(1 + p, this.slidersValues.term) - 1)
      const PA = Math.round((A + Number.EPSILON) * 100) / 100

      this.aminuity = PA
      this.updateTable()
    },
    updateTable () {
      const rows = []
      this.today = new Date(new Date()).getMonth()

      let S = this.slidersValues.loan
      for (let i = 1; i < this.slidersValues.term; i++) {
        const P = this.slidersValues.interest / 12 / 100
        const r = S * P
        const R = r.toFixed(2)
        const Am = this.aminuity - R

        S = S - Am

        const row = {
          manad: i,
          bet: this.aminuity.toFixed(2),
          amortering: Am.toFixed(2),
          ranta: R,
          status: false,
          dueDate: new Date().setMonth(this.today + (i - 1))
        }
        rows.push(row)
      }
      this.$store.dispatch('updateRows', rows)
    }
  }
}
</script>
