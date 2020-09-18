<template>
  <v-row>
    <!-- Start Dialog -->
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline">
          Lån skapades framgångsrikt
        </v-card-title>

        <v-card-text>Grattis, ditt lån läggs till på instrumentpanelen. Du kan logga in och kontrollera alla dina lån.</v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn color="green darken-1" text @click="dialog = false">
            annullera
          </v-btn>

          <v-btn color="green darken-1" text @click="dialog = false">
            skapa nytt lån
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- End Dialog -->

    <!-- Start Inputs -->
    <v-col cols="12" md="4">
      <v-card outlined>
        <v-stepper v-model="qustionNo">
          <v-stepper-items>
            <!-- Start The first 12 Step -->
            <v-stepper-content v-for="(q, index) in renderQuestions" :key="q.text" :step="index++">
              <p v-text="q.text" />
              <v-select
                v-if="q.type === 'select'"
                v-model="questions[q.model.parent][q.model.property]"
                :items="q.options"
                :label="q.label"
              />
              <div v-else-if="q.type === 'date'">
                <v-date-picker
                  v-model="questions[q.model.parent][q.model.property]"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                />
              </div>
              <v-text-field
                v-else
                v-model="questions[q.model.parent][q.model.property]"
                dense
                :label="q.label"
                :type="q.type"
              />
            </v-stepper-content>
            <!-- End The first 12 Step -->

            <!-- Start step 13 -->
            <v-stepper-content :step="13">
              <p>Hur ska lånet överlämnas från långivaren till låntagaren?</p>
              <v-select v-model="questions.amount.transferWay" :items="securityOptions" />

              <div v-if="questions.amount.transferWay === 2">
                <v-text-field
                  v-model="questions.amount.bank"
                  dense
                  label="Vilken bank ska lånet föras över till?"
                  type="text"
                />
                <v-text-field
                  v-model="questions.amount.bankAccountNumber"
                  dense
                  label="Ange låntagarens kontonummer."
                  type="number"
                />
              </div>

              <div v-if="questions.amount.transferWay === 3">
                <v-text-field
                  v-model="questions.amount.tel"
                  dense
                  label="Vilket telefonnummer ska lånet swishas till?"
                  type="text"
                />
              </div>

              <div v-if="questions.amount.transferWay === 4">
                <p>Ange på vilket sätt lånet ska överlämnas till låntagaren.</p>
                <v-textarea
                  v-model="questions.amount.mannar"
                  outlined
                  hint="ex: T.ex. Insättning till plusgiro: 1234-55, Insättning till bankgiro: 1234-5667."
                />
              </div>
            </v-stepper-content>
            <!-- End step 13 -->

            <!-- Start step 14 -->
            <v-stepper-content :step="14">
              <p>Vilken valuta betalas lånet ut ? (Samma valuta kommer att tillämpas på alla summor och avgifter i detta avtal)</p>
              <v-radio-group v-model="questions.term.limited" row>
                <v-radio label="Ja" :value="true" />
                <v-radio label="nej" :value="false" />
              </v-radio-group>
              <div v-if="questions.term.limited">
                <v-date-picker
                  v-model="questions.term.to"
                  year-icon="mdi-calendar-blank"
                  prev-icon="mdi-skip-previous"
                  next-icon="mdi-skip-next"
                />
              </div>
            </v-stepper-content>
            <!-- End step 14 -->

            <!-- Start step 15 -->
            <v-stepper-content :step="15">
              <p>Ska lånet ges i utbyte mot pant/säkerhet?</p>
              <v-radio-group v-model="questions.security.exchange" row>
                <v-radio label="Ja" :value="true" />
                <v-radio label="nej" :value="false" />
              </v-radio-group>

              <div v-if="questions.security.exchange">
                <p>Vilken egendom ska ges i pant för lånet?</p>
                <v-text-field
                  v-model="questions.security.pledgedProperty"
                  dense
                  placeholder="T.ex. motorcykel, Honda, ASD 123"
                  type="text"
                />
              </div>
            </v-stepper-content>
            <!-- End step 15 -->

            <!-- Start step 16 -->
            <v-stepper-content :step="16">
              <p>Vilket typ av lån ska skuldebrevet omfatta?</p>
              <v-select v-model="questions.loanType.promissoryNoteCover" :items="loanTypeOptions" />

              <p>Hur ofta ska inbetalning på lånet ske?</p>
              <v-select v-model="questions.loanType.repaidOften" :items="repaidOftenOtions" />

              <!-- Start First choice inputs -->
              <div v-if="questions.loanType.promissoryNoteCover === 'Annuitetslån'">
                <p>Vad är det fasta som låntagaren ska betala till långivaren?</p>
                <v-text-field
                  v-model="questions.loanType.fixedAmount"
                  dense
                  placeholder="Ange en siffra"
                  type="number"
                />

                <p>När ska den första annuitetsbetalningen ske?</p>
                <v-menu
                  ref="firstAnnuity"
                  v-model="datePickersModelStates.firstAnnuity"
                  :close-on-content-click="false"
                  :return-value.sync="questions.loanType.firstAnnuity"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="questions.loanType.firstAnnuity"
                      dense
                      prepend-icon="mdi mdi-calendar-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="questions.loanType.firstAnnuity" no-title scrollable>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="datePickersModelStates.firstAnnuity = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.firstAnnuity.save(questions.loanType.firstAnnuity)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <p>När ska den sista annuitetsbetalningar ske?</p>

                <v-menu
                  ref="lastAnnuity"
                  v-model="datePickersModelStates.lastAnnuity"
                  :close-on-content-click="false"
                  :return-value.sync="questions.loanType.lastAnnuity"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="questions.loanType.lastAnnuity"
                      dense
                      prepend-icon="mdi mdi-calendar-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="questions.loanType.lastAnnuity" no-title scrollable>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="datePickersModelStates.lastAnnuity = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.lastAnnuity.save(questions.loanType.lastAnnuity)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
              <!-- End First Choice inoputs -->

              <!-- Start Second choice inputs -->
              <div v-else-if="questions.loanType.promissoryNoteCover === 'Rak amortering'">
                <p>Hur stort belopp av varje ska amorteringen uppgå till?</p>
                <v-text-field
                  v-model="questions.loanType.installmentAmount"
                  dense
                  placeholder="Ange en siffra"
                  type="text"
                />

                <p>Ange den ränta som ska gälla för lånet? (Ange i siffror, en procentenhet)</p>
                <v-text-field
                  v-model="questions.loanType.interestRate"
                  dense
                  placeholder="Ange en siffra"
                  type="text"
                />

                <p>Vilket datum ska den första inbetalningen på lånet ske?</p>
                <v-menu
                  ref="firstPayment"
                  v-model="datePickersModelStates.firstPayment"
                  :close-on-content-click="false"
                  :return-value.sync="questions.loanType.firstPayment"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="questions.loanType.firstPayment"
                      dense
                      prepend-icon="mdi mdi-calendar-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="questions.loanType.firstPayment" no-title scrollable>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="datePickersModelStates.firstPayment = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.firstPayment.save(questions.loanType.firstPayment)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <p>När ska lånet vara återbetalt?</p>

                <v-menu
                  ref="lastPayment"
                  v-model="datePickersModelStates.lastPayment"
                  :close-on-content-click="false"
                  :return-value.sync="questions.loanType.lastPayment"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="questions.loanType.lastPayment"
                      dense
                      prepend-icon="mdi mdi-calendar-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="questions.loanType.lastPayment" no-title scrollable>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="datePickersModelStates.lastPayment = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.lastPayment.save(questions.loanType.lastPayment)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
              <!-- End Second Choice inoputs -->

              <!-- Start third choice inputs -->
              <div v-else>
                <p>Vilket belopp uppgår månadsinbetalningen till?</p>
                <v-text-field
                  v-model="questions.loanType.monthlyPayment"
                  dense
                  placeholder="Ange en siffra"
                  type="text"
                />

                <p>När ska den första inbetalningen på lånet ske?</p>
                <v-menu
                  ref="thirdFirstPayment"
                  v-model="datePickersModelStates.thirdFirstPayment"
                  :close-on-content-click="false"
                  :return-value.sync="questions.loanType.thirdFirstPayment"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="questions.loanType.thirdFirstPayment"
                      dense
                      prepend-icon="mdi mdi-calendar-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="questions.loanType.thirdFirstPayment" no-title scrollable>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="datePickersModelStates.thirdFirstPayment = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.thirdFirstPayment.save(questions.loanType.thirdFirstPayment)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>

                <p>När ska lånet vara återbetalt?</p>

                <v-menu
                  ref="thirdLastPayment"
                  v-model="datePickersModelStates.thirdLastPayment"
                  :close-on-content-click="false"
                  :return-value.sync="questions.loanType.thirdLastPayment"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="questions.loanType.thirdLastPayment"
                      dense
                      prepend-icon="mdi mdi-calendar-clock"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker v-model="questions.loanType.thirdLastPayment" no-title scrollable>
                    <v-spacer />
                    <v-btn
                      text
                      color="primary"
                      @click="datePickersModelStates.thirdLastPayment = false"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.thirdLastPayment.save(questions.loanType.thirdLastPayment)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </div>
              <!-- End third Choice inoputs -->

              <p>Ska låntagaren ha rätt att betala av hela eller en del av lånet i förskott?</p>
              <v-radio-group v-model="questions.loanType.payOffAllTheLoan" row>
                <v-radio label="Ja" :value="true" />
                <v-radio label="nej" :value="false" />
              </v-radio-group>
            </v-stepper-content>
            <!-- End step 16 -->

            <v-stepper-content :step="17">
              <p>Ska låntagaren betala dröjsmålsränta vid en försenad inbetalning på lånet?</p>
              <v-radio-group v-model="questions.InterestOnArrears.heShouldPay" row>
                <v-radio label="Ja" :value="true" />
                <v-radio label="nej" :value="false" />
              </v-radio-group>

              <div v-if="questions.InterestOnArrears.heShouldPay">
                <p>Hur mycket ränta, i procent, ska utgå vid en försenad betalning??</p>
                <v-text-field
                  v-model="questions.InterestOnArrears.amount"
                  type="number"
                  dense
                  placeholder="Ange en siffra"
                />
              </div>
            </v-stepper-content>

            <v-stepper-content :step="18">
              <p>Ska långivaren ha rätt att säga upp lånet om en inbetalning är försenad?</p>
              <v-radio-group v-model="questions.TermsOfDelay.shouldHeCancelLoan" row>
                <v-radio label="Ja" :value="true" />
                <v-radio label="nej" :value="false" />
              </v-radio-group>

              <div v-if="questions.TermsOfDelay.shouldHeCancelLoan">
                <p>Hur många dagar har låntagaren på sig att betala en förfallen inbetalning innan lånet sägs upp?</p>
                <v-text-field
                  v-model="questions.TermsOfDelay.daysToPay"
                  dense
                  placeholder="Ange en siffra"
                />

                <p>Ska en dröjsmålsränta utgå för det kvarvarande belopp efter att långivaren sagt upp lånet?</p>
                <v-radio-group
                  v-model="questions.TermsOfDelay.shouldHePayInterestAfterLoanCancle"
                  row
                >
                  <v-radio label="Ja" :value="true" />
                  <v-radio label="nej" :value="false" />
                </v-radio-group>

                <div v-if="questions.TermsOfDelay.shouldHePayInterestAfterLoanCancle">
                  <p>Vilken procentsats ska dröjsmålsräntan vid ett uppsagt lån uppgå till?</p>
                  <v-text-field
                    v-model="questions.TermsOfDelay.percentage"
                    dense
                    placeholder="Ange en siffra"
                  />
                </div>
              </div>
            </v-stepper-content>

            <v-stepper-content :step="19">
              <p>Ska skuldebrevet vara enkelt eller löpande? (Ska långivaren kunna överlåta skulden till en ny långivare?)</p>
              <v-radio-group v-model="questions.paymentHolder">
                <v-radio label="Enkelt (kan inte överlåtas)" value="simple" />
                <v-radio label="Löpande (kan överlåtas)" value="ongoing" />
              </v-radio-group>
            </v-stepper-content>
          </v-stepper-items>

          <v-card-actions>
            <div v-if="qustionNo === 19">
              <v-btn color="success" small @click="submitProject">
                submit
              </v-btn>

              <v-btn color="warning" small @click="prevQuestion">
                Back
              </v-btn>
            </div>
            <div v-else class="flex">
              <v-btn color="primary" small @click="nextQuestion">
                Continue
              </v-btn>
              <v-btn color="warning" small @click="prevQuestion">
                Back
              </v-btn>
            </div>
          </v-card-actions>
        </v-stepper>
      </v-card>
    </v-col>
    <!-- Start Inputs -->

    <!-- Start preview -->
    <v-col cols="12" md="8">
      <previewComponent :question-no="qustionNo" />
    </v-col>
    <!-- Start Inputs -->

    <downloadPDF :download="downloadPdf" @downloaded="downloadPdf = false; dialog = false" />

    <v-col cols="12" class="d-flex">
      <v-btn color="warning" to="/">
        Back
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import previewComponent from '@/components/preview'
import downloadPDF from '@/components/downloadPDF'

export default {
  name: 'StepTwo',
  components: {
    previewComponent,
    downloadPDF
  },
  data () {
    return {
      downloadPdf: false,
      dialog: false,
      qustionNo: 0,
      refresh: 0,
      datePickersModelStates: {
        firstAnnuity: false,
        lastPayment: false,
        thirdFirstPayment: false,
        thirdLastPayment: false
      },
      renderQuestions: [
        //  START TAKER
        {
          type: 'text',
          label: 'namn',
          text: 'Vad heter den person som ska ta lånet i för- och efternamn?',
          model: {
            parent: 'taker',
            property: 'name'
          }
        },
        {
          type: 'number',
          label: 'Personnummer',
          text: 'Vad har låntagaren för personnummer?',
          model: {
            parent: 'taker',
            property: 'SSN'
          }
        },
        {
          type: 'text',
          label: 'Adress',
          text: 'Ange låntagarens adress:',
          model: {
            parent: 'taker',
            property: 'address'
          }
        },
        {
          type: 'tel',
          label: 'Telefonnummer',
          text: 'Vilket telefonnummer kan låntagaren nås på?',
          model: {
            parent: 'taker',
            property: 'tel'
          }
        },
        {
          type: 'email',
          label: 'Email',
          text: 'Vilket EMAIL kan låntagaren nås på?',
          model: {
            parent: 'taker',
            property: 'email'
          }
        },
        //  START giver
        {
          type: 'text',
          label: 'Namn',
          text: 'Vad heter långivaren i för- och efternamn?',
          model: {
            parent: 'giver',
            property: 'name'
          }
        },
        {
          type: 'number',
          label: 'Telefonnummer',
          text: 'Vad har långivaren för personnummer?',
          model: {
            parent: 'giver',
            property: 'SSN'
          }
        },
        {
          type: 'text',
          label: 'Adress',
          text: 'Ange långivarens adress:',
          model: {
            parent: 'giver',
            property: 'address'
          }
        },
        {
          type: 'tel',
          label: 'Telefonnummer',
          text: 'Vilket telefonnummer har långivaren?',
          model: {
            parent: 'giver',
            property: 'tel'
          }
        },
        {
          type: 'email',
          label: 'Email',
          text: 'Vilket Email har långivaren?',
          model: {
            parent: 'giver',
            property: 'email'
          }
        },
        // Start loanAmount
        {
          type: 'select',
          options: ['SEK', 'EUR', 'USD', 'GBP'],
          text:
            'Vilken valuta betalas lånet ut ? (Samma valuta kommer att tillämpas på alla summor och avgifter i detta avtal)',
          model: {
            parent: 'loanAmount',
            property: 'currency'
          }
        },
        {
          type: 'number',
          label: 'Ange en siffra',
          text: 'Vilket belopp är det som ska lånas ?',
          model: {
            parent: 'loanAmount',
            property: 'amount'
          }
        },
        {
          type: 'date',
          text: 'Vilket datum togs eller kommer lånet tas?',
          model: {
            parent: 'loanAmount',
            property: 'date'
          }
        }
      ],
      securityOptions: [
        { text: 'Kontant överlämnande', value: 1 },
        { text: 'Insättning på bankkonto', value: 2 },
        { text: 'Swish', value: 3 },
        { text: 'Annat', value: 4 }
      ],
      loanTypeOptions: [
        { text: 'Annuitetslån', value: 'Annuitetslån' },
        { text: 'Rak amortering', value: 'Rak amortering' },
        { text: 'Lån utan ränta', value: 'Lån utan ränta' }
      ],
      repaidOftenOtions: [
        { text: 'En gång per vecka', value: 'vecka' },
        { text: 'En gång per månad', value: 'månad' },
        { text: 'En gång per kvartal', value: 'kvartal' },
        { text: 'En gång per år', value: 'år' }
      ],
      questions: { taker: { name: 'midodasd', SSN: '333124123', address: 'dsasaddsafwsadeqw', tel: '4215872139142', email: 'emidobibo20@gmail.com' }, giver: { name: '123dsadsa', SSN: '01092548125', address: 'dsdsdssadasdsda', tel: '+201153297653', email: 'hey@gmail.com' }, loanAmount: { currency: 'SEK', amount: '45323124123412', date: '2020-09-10' }, amount: { transferWay: 2, bank: 'eeqw', bankAccountNumber: '214213', tel: '', mannar: '' }, term: { limited: false, to: '2020-09-16' }, security: { exchange: false, pledgedProperty: '' }, loanType: { promissoryNoteCover: 'Annuitetslån', repaidOften: 'vecka', fixedAmount: '54343234', firstAnnuity: '2020-09-16', lastAnnuity: '2020-09-16', payOffAllTheLoan: false, installmentAmount: null, interestRate: null, firstPayment: '2020-09-16', lastPayment: '2020-09-16', monthlyPayment: null, thirdFirstPayment: '2020-09-16', thirdLastPayment: '2020-09-16' }, InterestOnArrears: { heShouldPay: false, amount: '' }, TermsOfDelay: { shouldHeCancelLoan: false, daysToPay: '', shouldHePayInterestAfterLoanCancle: false, percentage: null }, signature: { lender: '', brrower: '' }, paymentHolder: 'simple' }
    }
  },
  computed: {
    ...mapGetters(['preview'])
  },
  watch: {
    questions: {
      deep: true,
      handler (newValue) {
        this.$store.dispatch('updatePreview', newValue)
      }
    }
  },
  methods: {
    submitProject () {
      this.$axios
        .post('/project/', this.preview)
        .then((res) => {
          console.log(res)
          this.downloadPdf = true
          this.dialog = true
        })
        .catch(err => console.log(err))
    },
    changeStep (stepNo) {
      this.$emit('stepChanged', stepNo)
    },
    nextQuestion () {
      if (this.qustionNo <= 21) {
        this.qustionNo++
        this.refresh++
      }
    },
    prevQuestion () {
      if (this.qustionNo !== 0) {
        this.qustionNo--
        this.refresh--
      }
    }
  }
}
</script>
