<template>
  <v-app>
    <admin-sidebar />
    <v-container>
      <nuxt />
    </v-container>
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
