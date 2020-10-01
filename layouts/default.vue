<template>
  <v-app>
    <v-app-bar app dense dark>
      <v-toolbar-title>
        Lend2friend
      </v-toolbar-title>
      <v-spacer />
      <v-btn v-if="$auth && !$auth.loggedIn" text to="/login">
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

    <main class="mt-15">
      <v-container>
        <nuxt />
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {

}
</script>
