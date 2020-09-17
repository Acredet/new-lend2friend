<template>
  <v-row>
    <v-col cols="12" class="d-flex">
      <h2>All Users:</h2>
      <v-spacer />
      <v-btn text color="primary">
        Add User
      </v-btn>
    </v-col>

    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
        class="elevation-1"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'admin',
  data () {
    return {
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'SSN', value: 'SSN' },
        { text: 'Email', value: 'email' },
        { text: 'tel', value: 'tel' }
      ],
      users: []
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    async getUsers () {
      await this.$axios.get('/users/all')
        .then((res) => { this.users = res.data.data })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
