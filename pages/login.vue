<template>
  <div id="login-wrapper">
    <v-container>
      <v-row justify="center" align="center">
        <v-col cols="8">
          <v-card>
            <v-card-title class="d-block text-h5 text-center">
              Sign in
            </v-card-title>
            <!-- Start login form -->
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="user.email" dense label="Email" outlined />
                  <v-text-field
                    v-model="user.password"
                    outlined
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.required, rules.min]"
                    :type="showPassword ? 'text' : 'password'"
                    name="Password"
                    label="Password"
                    hint="At least 8 characters"
                    counter
                    dense
                    @click:append="showPassword = !showPassword"
                    @keyup.enter="login"
                  />

                  <v-btn color="primary" class="mx-auto d-block" @click="login">
                    Sign in
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
            <!-- End login form -->
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="snackbar.state" :timeout="2000">
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar.state = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data () {
    return {
      snackbar: {
        state: false,
        text: 'Hey'
      },
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => ('The email and password you entered don\'t match')
      },
      showPassword: false,
      user: {
        name: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$auth.loginWith('local', { data: this.user })
      } catch (err) {
        this.snackbar = {
          state: true,
          text: err.response.data.msg
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#login-wrapper {
  background-image: url('~assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center center;
  min-height: 100vh;

  .container, .row {
    height: 100%
  }
}
</style>
