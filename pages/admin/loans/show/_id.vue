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
      <v-col cols="12" md="5" class="cinereousTable pa-3">
        <div style="border: 1px solid #325d88; ">
          <h4 style="background: #325d88; color: white; " class="pa-3 mb-2">
            Project Information
          </h4>
          <div class="ma-2">
            <table v-for="(person, index) in peopleInfo" :key="`person-${index}`" style="width: 100%">
              <tbody style="width: 100%">
                <tr style="width: 100%">
                  <td colspan="2" class="font-weight-bolder" v-text="person.header" />
                </tr>
                <tr v-for="info in rows" :key="info.key" style="width: 100%">
                  <td><b>{{ info.key }}</b></td>
                  <td>{{ project[person.obj][info.value] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Start Lender -->
      </v-col>

      <v-col cols="12" md="7" class="cinereousTable">
        <div style="border: 1px solid #f47c3c; ">
          <h4 style="background: #f47c3c; color: white; " class="pa-3 mb-2">
            Project Information
          </h4>
          <loansTable class="ma-2" :items="project.tableRows" />
        </div>
      </v-col>
    </v-row>
    <v-divider />
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
      project: {},
      rows: [
        { key: 'Namn', value: 'name' },
        { key: 'Personnummer', value: 'SSN' },
        { key: 'Adress', value: 'address' },
        { key: 'Telefonnummer', value: 'tel' },
        { key: 'Email', value: 'email' }
      ],
      peopleInfo: {
        1: {
          header: 'Låntagare',
          obj: 'borrower'
        },
        2: {
          header: 'Låntagivre',
          obj: 'lender'
        }
      }
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
  },
  head () {
    return {
      link: [
        { rel: 'stylesheet', href: '/css/main.css', body: true }
      ]
    }
  }
}
</script>
