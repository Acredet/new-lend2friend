<template>
  <v-row class="mt-5" dense>
    <v-col v-for="(item, i) in items" :key="i" cols="12" md="4">
      <v-card :color="item.color" dark>
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="headline" v-text="item.title" />

            <v-card-subtitle v-text="item.artist" />
          </div>

          <v-avatar class="ma-3" size="125" tile>
            <v-icon dark x-large v-text="item.icon" />
          </v-avatar>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'admin',
  data () {
    return {
      items: [
        {
          color: '#f47c3c',
          title: 'Users',
          icon: 'mdi-account',
          artist: '16 User'
        },
        {
          color: '#29abe0',
          title: 'Loans',
          icon: 'mdi mdi-cash-usd-outline',
          artist: '106 958 KR'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
