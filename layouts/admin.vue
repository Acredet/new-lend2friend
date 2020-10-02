<template>
  <v-app style="background-color: #ededed">
    <admin-sidebar />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import adminSidebar from '@/components/admin/sidebar'

export default {
  components: {
    adminSidebar
  }
}
</script>
