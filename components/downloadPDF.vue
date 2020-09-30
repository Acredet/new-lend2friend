<template>
  <div>
    <client-only>
      <vue-html2pdf
        ref="html2Pdf"
        :paginate-elements-by-height="1400"
        filename="Loan"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="100%"
        enable-download
        @hasGenerated="hasGenerated($event)"
      >
        <section slot="pdf-content" class="d-flex justify-contetn-center ">
          <v-card elevation="2" style="padding: 50px">
            <h3 style="text-align: center">
              SKULDEBREV
            </h3>
            <v-row>
              <v-col cols="6">
                <!-- Start Lender -->
                <b style="margin: 15px 10px 0 0; display: block;  color: black;">Låntagare</b>
                <p id="lender-Namn">
                  Namn :
                  <span style="color: red">{{ (preview && preview.taker && preview.taker.name) ? preview.taker.name : '_________' }}</span>
                </p>
                <p id="lender-Personnummer">
                  Personnummer :
                  <span style="color: red">{{ (preview && preview.taker && preview.taker.SSN) ? preview.taker.SSN : '_________' }}</span>
                </p>
                <p id="lender-Adress">
                  Adress :
                  <span style="color: red">{{ (preview && preview.taker && preview.taker.address) ? preview.taker.address : '_________' }}</span>
                </p>
                <p id="lender-Telefonnummer">
                  Telefonnummer :
                  <span style="color: red">{{ (preview && preview.taker && preview.taker.tel) ? preview.taker.tel : '_________' }}</span>
                </p>
                <p id="lender-Email">
                  Email :
                  <span style="color: red">{{ (preview && preview.taker && preview.taker.email) ? preview.taker.email : '_________' }}</span>
                </p>
                <!-- End Lender -->
              </v-col>

              <v-col cols="6">
                <!-- Start Borrower -->
                <b style="margin: 15px 10px 0 0; display: block;  color: black;">Låntagivre</b>
                <p id="borrower-Namn">
                  Namn :
                  <span style="color: red">{{ (preview && preview.giver && preview.giver.name) ? preview.giver.name : '_________' }}</span>
                </p>
                <p id="borrower-Personnummer">
                  Personnummer :
                  <span style="color: red">{{ (preview && preview.giver && preview.giver.SSN) ? preview.giver.SSN : '_________' }}</span>
                </p>
                <p id="borrower-Adress">
                  Adress :
                  <span style="color: red">{{ (preview && preview.giver && preview.giver.address) ? preview.giver.address : '_________' }}</span>
                </p>
                <p id="borrower-Telefonnummer">
                  Telefonnummer :
                  <span style="color: red">{{ (preview && preview.giver && preview.giver.tel) ? preview.giver.tel : '_________' }}</span>
                </p>
                <p id="borrower-Email">
                  Email :
                  <span style="color: red">{{ (preview && preview.giver && preview.giver.email) ? preview.giver.email : '_________' }}</span>
                </p>
                <!-- End Borrower -->
              </v-col>
            </v-row>

            <!-- Start Loan -->
            <b style="margin: 15px 10px 0 0; display: block;  color: black;">Lånebelopp</b>
            <p id="loan-amount">
              Till låntagaren utlånar långivaren
              <span id="loan-amount-input" style="color: red">{{ (preview && preview.loanAmount && preview.loanAmount.amount) ? preview.loanAmount.amount : '_________' }}</span>
              {{ (preview && preview.loanAmount && preview.loanAmount.currency) ? preview.loanAmount.currency : 'SEK' }} den
              <span id="loan-amount-date" style="color: red">{{ (preview && preview.loanAmount && preview.loanAmount.date) ? preview.loanAmount.date : '_________' }}</span>
              enligt bestämmelserna i detta skuldebrev. Överlämnande av lånet sker

              <span v-if="preview && preview.amount && preview.amount.transferWay" id="loan-amount-opts" style="color: red">
                <i v-if="preview.amount.transferWay === 1">via kontant överlämnande</i>
                <i v-else-if="preview.amount.transferWay === 2">
                  via Insättning på bankkonto
                  {{ preview.amount.bank ? preview.amount.bank : '_________' }}
                  {{ preview.amount.bankAccountNumber ? preview.amount.bankAccountNumber : '_________' }}
                </i>
                <i v-else-if="preview.amount.transferWay === 3">
                  via överföring med Swish till följande nummer:
                  {{ (!preview.amount.tel) ? '_________' : preview.amount.tel }}
                </i>
                <i v-else-if="preview.amount.transferWay === 4">
                  på följande sätt:
                  <p>{{ (preview && preview.amount && preview.amount.mannar) ? preview.amount.mannar : '_________' }}</p>
                </i>
              </span>.
            </p>
            <!-- End Loan -->

            <!-- Start loan term -->
            <b style="margin: 15px 10px 0 0; display: block;  color: black;">Lånets löptid.</b>
            <p id="loan-term">
              Lånet löper från den
              <span style="color: red">{{ (preview && preview.loanAmount && preview.loanAmount.date) ? preview.loanAmount.date : '_________' }}</span>
              <span v-if="preview && preview.term && preview.term.limited" style="color: red">till den {{ preview.term.to }}</span>
              <span v-else style="margin: 0; color: red;display: inline" class="not-block">fram till dess full betalning sker</span>.
            </p>

            <div v-if="preview && preview.security && preview.security.exchange" id="security">
              <b style="margin: 15px 10px 0 0; display: block;  color: black;">Säkerhet</b>
              <p>
                Som säkerhet för lånet lämnas
                <span style="color: red">{{ (preview && preview.security.pledgedProperty) ? preview.security.pledgedProperty : '' }}</span>
                som ska återlämnas/återkallas dagen då lånet är till fullo betalt och detta skuldebrev kvitterats som återkallat. Vid eventuell tvist om lånet, har långivaren rätt att behålla säkerheten tills att ärendet är beslutat i tingsrätt eller på annat sätt kommit till avslut.
              </p>
            </div>
            <!-- End loan term -->

            <!-- Start loanType -->
            <b id="loan-type" style="margin: 15px 10px 0 0; display: block;  color: black;">Amortering och ränta</b>
            <div v-if="preview && preview.loanType">
              <!-- start first choice inputs -->
              <p v-if="preview.loanType.promissoryNoteCover === 'Annuitetslån'">
                Lånet klassificeras som ett
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">annuitetslån</b>
                vilket innebär att låntagaren ska betala en lika stor summa vid varje betalningstillfälle, denna summa består av både ränta och amortering. Lånets annuitet är
                <span style="margin: 0; color: red;display: inline">{{ preview.loanType.fixedAmount ? preview.loanType.fixedAmount : '_________' }}</span>
                <span style="margin: 0; color: red;display: inline">{{ (preview && preview.loanAmount && preview.loanAmount.currency) ? preview.loanAmount.currency : 'SEK' }}</span> per
                <span style="margin: 0; color: red;display: inline">{{ preview.loanType.repaidOften ? preview.loanType.repaidOften : '_________' }}</span>.
                Första inbetalningen ska ske den
                <span style="margin: 0; color: red;display: inline">{{ preview.loanType.firstAnnuity ? preview.loanType.firstAnnuity : '_________' }}</span>
                , eller närmsta föregående vardag, och den sista
                <span
                  v-if="preview.loanType.payOffAllTheLoan"
                  style="margin: 0; color: red;display: inline"
                  class="not-block"
                >, om inte betalning sker i förskott</span>, den
                <span style="color: red">{{ preview.loanType.lastAnnuity ? preview.loanType.lastAnnuity : '_________' }}</span>,
                eller närmsta föregående vardag.
              </p>
              <!-- End first choice inputs -->

              <!-- Start Second choice inputs -->
              <p v-else-if="preview.loanType.promissoryNoteCover === 'Rak amortering'">
                Lånet ska betalas tillbaka med
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">rak amortering</b>
                vilket innebär att amorteringsbeloppet ligger fast medan räntan minskar för varje
                inbetalning. Inbetalningsbeloppet kommer således vara högre i början för att sedan minska över tid. Amorteringsbeloppet uppgår till
                <span style="color: red">{{ preview.loanType.installmentAmount ? preview.loanType.installmentAmount : '_________' }}</span>
                <b
                  style="margin: 15px 10px 0 0; display: block;  color: black;"
                  class="not-block"
                >{{ (preview.loanAmount.currency) ? preview.loanAmount.currency : 'SEK' }}</b>
                per
                <span style="color: red">{{ preview.loanType.repaidOften ? preview.loanType.repaidOften : '_________' }}</span>
                och ska betalas tillsammans med
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">räntan</b> för lånet som ligger på
                <span style="color: red">{{ (preview && preview.loanType && preview.loanType.interestRate) ? preview.loanAmount.interestRate : '_________' }}</span>
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">procent</b>. Första inbetalningen ska ske den
                <span style="color: red">{{ (preview && preview.loanType && preview.loanType.firstPayment) ? preview.loanAmount.firstPayment : '_________' }}</span>,
                eller närmsta föregående vardag,
                <span
                  v-if="preview.loanType.payOffAllTheLoan"
                  style="margin: 0; color: red;display: inline"
                  class="not-block"
                >och den sista , om inte betalning sker i förskott,</span>
                den
                <span style="color: red">{{ (preview && preview.loanType && preview.loanType.lastPayment) ? preview.loanAmount.lastPayment : '_________' }}</span>, eller närmsta föregående vardag.
              </p>
              <!-- End Second choice inputs -->

              <!-- Start third choice inputs -->
              <p v-else-if="preview.loanType.promissoryNoteCover === 'Lån utan ränta'">
                Lånet ska betalas tillbaka med
                <span style="color: red">{{ preview.loanType.monthlyPayment ? preview.loanType.monthlyPayment : '_________' }}</span>

                <b
                  style="margin: 15px 10px 0 0; display: block;  color: black;"
                  class="not-block"
                >{{ (preview.loanAmount.currency) ? preview.loanAmount.currency : 'SEK' }}</b>
                per
                <span style="color: red">{{ preview.loanType.repaidOften ? preview.loanType.repaidOften : '_________' }}</span>. Första inbetalningen ska ske den
                <span style="color: red">{{ (preview.loanType.thirdFirstPayment) ? preview.loanType.thirdFirstPayment : '_________' }}</span>
                , eller närmsta föregående vardag, och den sista , om inte betalning sker i förskott,
                den
                <span style="color: red">{{ (preview.loanType.thirdLastPayment) ? preview.loanType.thirdLastPayment : '_________' }}</span>
                , eller närmast föregående vardag.
              </p>
              <!-- End third choice inputs -->
            </div>
            <!-- End Loan type -->

            <div v-if="preview && preview.InterestOnArrears && preview.InterestOnArrears.heShouldPay" id="heShouldPay">
              <b style="margin: 15px 10px 0 0; display: block;  color: black;">Dröjsmålsränta</b>
              <p>
                Om en inbetalning på lånet inte betalas på utsatt tid utgår dröjsmålsränta med
                <span style="color: red">{{ (preview && preview.InterestOnArrears && preview.InterestOnArrears.amount) ? preview.InterestOnArrears.amount : '_________' }}</span>
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">procent</b>
                på det belopp som inte betalats i rätt tid.
              </p>
            </div>

            <div v-if="preview && preview.TermsOfDelay && preview.TermsOfDelay.shouldHeCancelLoan" id="shouldHeCancelLoan">
              <b style="margin: 15px 10px 0 0; display: block;  color: black;">Dröjsmålsvillkor</b>
              <p>
                Långivaren har rätt att säga upp lånet till omedelbar betalning om förfallen inbetalning inte erläggs senast inom
                <span style="color: red">{{ (preview && preview.TermsOfDelay && preview.TermsOfDelay.daysToPay) ? preview.TermsOfDelay.daysToPay : '_________' }}</span>
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">dagar</b> efter förfallodagen.
              </p>
              <p v-if="preview.TermsOfDelay.shouldHePayInterestAfterLoanCancle">
                Är lånet uppsagt till betalning utgår en
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">dröjsmålsränta</b> om
                <span style="color: red">{{ (preview && preview.TermsOfDelay && preview.TermsOfDelay.percentage) ? preview.TermsOfDelay.percentage : '_________' }}</span>
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">procent</b>.
              </p>
            </div>

            <div v-if="preview && preview.paymentHolder === 'ongoing'" id="paymentHolder">
              <b style="margin: 15px 10px 0 0; display: block;  color: black;">Betalning till innehavaren</b>
              <p>
                Långivaren kan
                <b style="margin: 15px 10px 0 0; display: block;  color: black;" class="not-block">fritt överlåta detta skuldebrev</b> till någon annan. Inbetalning på lån enligt detta löpande skuldebrev ska betalas till innehavaren av detta skuldebrev.
                Innehavaren av detta skuldebrev ska visa upp detta skuldebrev för låntagaren och meddela hur betalning ska göras.
                En betalning från låntagaren kan med bindande verkan endast göras till den innehavare som sist har visat upp detta löpande skuldebrev för låntagaren med underskrift från tidigare ägare enligt en obruten kedja.
              </p>
            </div>
          </v-card>
        </section>
      </vue-html2pdf>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    download: {
      type: Boolean,
      default: () => false
    }
  },
  computed: {
    ...mapGetters(['preview'])
  },
  watch: {
    download: {
      handler (newValue) {
        console.log('newValue', newValue)
        if (newValue === true) {
          this.downloadPdf()
        }
      }
    }
  },
  methods: {
    hasGenerated (e) {
      console.log(e)
    },
    downloadPdf () {
      console.log('downloading')
      this.$refs.html2Pdf.generatePdf()
      this.$emit('downloaded')
    }
  }
}
</script>

<style lang="sass" scoped>
b
  margin: 15px 10px 0 0
  display: block
span
  color: red
span.not-block, b.not-block
  margin: 0
  color: black
  display: inline
p
  padding: 0 !important
  margin: 0 !important
</style>
