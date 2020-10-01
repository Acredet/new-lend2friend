<template>
  <v-row>
    <v-col cols="12" class="cinereousTable">
      <div style="border: 1px solid #f47c3c; ">
        <h4 style="background: #f47c3c; color: white; " class="pa-3 mb-2">
          All Given Projects
        </h4>
        <v-data-table
          class="cinereousTable"
          :headers="headers"
          :items="loans"
          :items-per-page="10"
        >
          <template v-slot:item.action="{ item }">
            <v-btn :to="`/admin/loans/show/${item._id}`" color="warning">
              See details
            </v-btn>
          </template>

          <template v-slot:item.amount="{ item }">
            {{ item.amount }} Kr
          </template>
          <template v-slot:item.loptid="{ item }">
            {{ item.loptid }} manad
          </template>

          <template v-slot:body.append>
            <tr>
              <td v-for="header in headers" :key="header.text" class="font-weight-black text-start" v-text="header.text" />
            </tr>
          </template>
        </v-data-table>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  layout: 'admin',
  data () {
    return {
      headers: [
        { text: 'Project id', value: '_id' },
        { text: 'Giver', value: 'giver' },
        { text: 'loptid ', value: 'loptid' },
        { text: 'Ranta', value: 'amuunity' },
        { text: 'Amount', value: 'amount' },
        { text: 'action', value: 'action', sortable: false }
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
            console.log(loan)
            await this.$axios.get(`/users/${loan.lender}`)
              .then((user) => {
                this.loans.push({
                  _id: loan._id,
                  giver: user.data.name,
                  amount: loan.loanAmount.amount,
                  amuunity: loan.amuunity || 0,
                  loptid: loan.tableRows.length,
                  createdAt: loan.loanAmount.date.substr(0, 10)
                })
              })
              .catch(err => console.log(err))
          })
        })
        .catch(err => console.log(err))
    }
  },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: '@/assets/css/main.scss', body: true }
      ]
    }
  }
}
</script>
