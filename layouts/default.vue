<template>
  <div>
    <v-app-bar dense dark>
      <v-toolbar-title>
        Lend2friend
      </v-toolbar-title>
      <v-spacer />
      <v-btn v-if="!$auth.loggedIn" text to="/login">
        login
      </v-btn>
      <div v-else>
        <v-btn text to="/admin/">
          Admin panel
        </v-btn>
        <v-btn color="danger" @click="$auth.logout('local')">
          logout
        </v-btn>
      </div>
    </v-app-bar>

    <v-app>
      <nuxt />
    </v-app>
  </div>
</template>

<script>
export default {

}
</script>
