<template>
  <div>
    <v-app-bar dark clipped-right app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-spacer />
      <v-menu :rounded="false" offset-y>
        <template v-slot:activator="{ attrs, on }">
          <div class="d-flex justify-center align-center" v-bind="attrs" v-on="on">
            <v-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
            </v-avatar>
            <v-spacer />
            <p class="ma-0" v-text="'Mohammed'" />
          </div>
        </template>

        <v-list>
          <v-list-item link to="/admin/profile">
            Profile
          </v-list-item>
          <v-list-item>
            <v-btn color="error" text block @click="$auth.logout()">
              Logout
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" dark app :absolute="false">
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <!-- Start Item -->
          <v-list-item v-for="link in links" :key="link.text" :to="link.url" link exact>
            <v-list-item-icon>
              <v-icon v-text="link.icon" />
            </v-list-item-icon>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
          <!-- End Item -->
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: true,
    group: '',
    links: [
      { text: 'Website Home', url: '/', icon: 'mdi-home' },
      { text: 'Admin Home', url: '/admin', icon: 'mdi-home' },
      { text: 'Users', url: '/admin/users', icon: 'mdi-account' },
      { text: 'Taken Loans', url: '/admin/loans/taken', icon: 'mdi mdi-cash' },
      { text: 'Given Loans', url: '/admin/loans/given', icon: 'mdi mdi-cash-refund' }

    ]
  })
}
</script>
