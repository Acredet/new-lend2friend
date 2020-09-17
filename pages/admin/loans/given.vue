<template>
  <v-row>
    <v-col cols="12">
      <h2>Given Loans:</h2>
    </v-col>

    <v-col cols="12">
      <v-data-table
        :headers="headers"
        :items="loans"
        :items-per-page="5"
        class="elevation-1"
        @click:row="(item) => $router.push(`/admin/loans/show/${item._id}`)"
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
        { text: 'Amount', value: 'amount' },
        { text: 'Date', value: 'createdAt' }
      ],
      loans: []
    }
  },
  created () {
    this.getLoans()
  },
  methods: {
    async getLoans () {
      await this.$axios.get('/project/loans/borrower')
        .then((res) => {
          res.data.forEach(async (loan) => {
            await this.$axios.get(`/users/${loan.lender}`)
              .then((user) => {
                this.loans.push({ _id: loan._id, name: user.data.name, amount: loan.loanAmount.amount, createdAt: loan.loanAmount.date.substr(0, 10) })
              })
              .catch(err => console.log(err))
          })
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
