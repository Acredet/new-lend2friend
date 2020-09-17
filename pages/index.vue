<template>
  <v-layout column>
    <v-container>
      <v-stepper v-model="e1">
        <v-stepper-header>
          <template v-for="n in 2">
            <v-stepper-step :key="`${n}-step`" :complete="e1 > n" :step="n" editable>
              Step {{ n }}
            </v-stepper-step>

            <v-divider v-if="n !== 2" :key="n" />
          </template>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <step-one @stepChanged="e1 = $event" />
          </v-stepper-content>

          <v-stepper-content step="2">
            <step-two @stepChanged="e1 = $event" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>
  </v-layout>
</template>

<script>
export default {
  name: 'HomePage',
  data () {
    return {
      e1: 1
    }
  },
  methods: {
    // deleteUsers () {
    //   this.$axios.delete('/users')
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
    // },
    // deleteProjects () {
    //   this.$axios.delete('/project')
    //     .then(res => console.log(res))
    //     .catch(err => console.log(err))
    // }
  }
}
</script>
