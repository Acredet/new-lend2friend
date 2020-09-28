<template>
  <v-container>
    <div class="d-flex">
      <h2>Details:</h2>
      <v-spacer />
      <v-btn color="primary" outlined tag="a" download>
        Download PdF
      </v-btn>
    </div>
    <v-row v-if="project._id">
      <v-col cols="12" md="6">
        <!-- Start Lender -->
        <b style="margin: 15px 10px 0 0; display: block;  color: black;">Låntagare</b>
        <p id="lender-Namn">
          Namn :
          <span style="color: red">{{ project.borrower.name }}</span>
        </p>
        <p id="lender-Personnummer">
          Personnummer :
          <span style="color: red">{{ project.borrower.SSN }}</span>
        </p>
        <p id="lender-Adress">
          Adress :
          <span style="color: red">{{ project.borrower.address }}</span>
        </p>
        <p id="lender-Telefonnummer">
          Telefonnummer :
          <span style="color: red">{{ project.borrower.tel }}</span>
        </p>
        <p id="lender-Email">
          Email :
          <span style="color: red">{{ project.borrower.email }}</span>
        </p>
        <!-- End Lender -->
      </v-col>

      <v-col cols="12" md="6">
        <!-- Start Borrower -->
        <b style="margin: 15px 10px 0 0; display: block;  color: black;">Låntagivre</b>
        <p id="borrower-Namn">
          Namn :
          <span style="color: red">{{ project.lender.name }}</span>
        </p>
        <p id="borrower-Personnummer">
          Personnummer :
          <span style="color: red">{{ project.lender.SSN }}</span>
        </p>
        <p id="borrower-Adress">
          Adress :
          <span style="color: red">{{ project.lender.address }}</span>
        </p>
        <p id="borrower-Telefonnummer">
          Telefonnummer :
          <span style="color: red">{{ project.lender.tel }}</span>
        </p>
        <p id="borrower-Email">
          Email :
          <span style="color: red">{{ project.lender.email }}</span>
        </p>
        <!-- End Borrower -->
      </v-col>
    </v-row>
    <v-divider />
    <h2 class="mt-5 mb-3" v-text="'Loans:'" />
    <loansTable :items="project.tableRows" />
  </v-container>
</template>

<script>
import loansTable from '@/components/loansTable'

export default {
  name: 'SingleProject',
  layout: 'admin',
  components: {
    loansTable
  },
  data () {
    return {
      project: {}
    }
  },
  async beforeCreate () {
    await this.$axios.get(`/project/${this.$route.params.id}`)
      .then(async (loan) => {
        this.project = loan.data

        const users = [
          this.$axios.get(`/users/${this.project.lender}`),
          this.$axios.get(`/users/${this.project.borrower}`)
        ]

        await Promise.all(users)
          .then((users) => {
            this.project.lender = users[0].data
            this.project.borrower = users[1].data
          })
      })
      .catch(err => console.log(err))
  }
}
</script>
