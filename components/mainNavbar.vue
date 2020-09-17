<template>
  <div>
    <v-app-bar dense dark>
      <v-toolbar-title>
        Lend2friend
      </v-toolbar-title>
      <v-spacer />
      <v-btn v-if="$auth.loggedIn" text to="/admin/">
        Admin panel
      </v-btn>
      <v-btn v-if="!$auth.loggedIn" text to="/login">
        login
      </v-btn>
      <v-btn v-else color="danger" @click="$auth.logout('local')">
        logout
      </v-btn>
    </v-app-bar>
  </div>
</template>
