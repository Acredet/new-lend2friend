<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center" v-text="'manad'" />
            <th class="text-center" v-text="'Bet/man'" />
            <th class="text-center" v-text="'Amortering'" />
            <th class="text-center" v-text="'Ranta'" />
            <th v-if="$route.path !== '/'" class="text-center" v-text="'status'" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in (items.length > 0) ? items : rows" :key="`table-${index}`">
            <td class="text-center">
              {{ item.manad }}
            </td>
            <td class="text-center">
              {{ item.bet }} kr
            </td>
            <td class="text-center">
              {{ item.amortering }} kr
            </td>
            <td class="text-center">
              {{ item.ranta }} kr
            </td>
            <td v-if="$route.path !== '/'" class="text-center">
              {{ item.status }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <!-- <v-data-table
      dense
      light
      :headers="(items.length > 0) ? headers : headers.slice(0, 4)"
      item-class="evenOdd"
      :items="(items.length > 0) ? items : rows"
      :items-per-page="10"
      class="evenOdd elevation-1"
    >
      <template v-slot:item.bet="{ item }">
        {{ item.bet }} Kr
      </template>
      <template v-slot:item.amortering="{ item }">
        {{ item.amortering }} Kr
      </template>
      <template v-slot:item.ranta="{ item }">
        {{ item.ranta }} Kr
      </template>

      <template v-if="(items.length > 0)" v-slot:item.status="{ item }">
        <v-checkbox v-model="item.status" @change="updateProjectRow(item._id, $event)" />
      </template>
    </v-data-table> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      headers: [
        { text: 'manad', value: 'manad' },
        { text: 'Bet/man', value: 'bet' },
        { text: 'Amortering', value: 'amortering' },
        { text: 'Ranta', value: 'ranta' },
        { text: 'Status ', value: 'status' }
      ]
    }
  },
  computed: {
    ...mapGetters(['rows'])
  },
  methods: {
    async updateProjectRow (id, val) {
      const index = this.items.findIndex(x => x._id === id)
      if (index !== -1) {
        await this.$axios.patch(`/project/${this.$route.params.id}`, { index, val })
      }
    }
  },
  head () {
    return {
      style: [
        { cssText: ' div > div > div.v-list-item.v-list-item--three-line.theme--light > div > div.row > div.px-3.col-md-8.col-12 > div > div.v-data-table__wrapper > table > tbody > tr:nth-child(even) {background: #CCC} tr:nth-child(odd) {background: #FFF}', type: 'text/css', body: true }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
