<template>
  <div>
    <v-app-bar dark clipped-right app>
      <v-spacer />
      <v-toolbar-title>Lend2friend</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      app
      dark
      fixed
      mini-variant
      expand-on-hover
      permanent
    >
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
    drawer: false,
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
