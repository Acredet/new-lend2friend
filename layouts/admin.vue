<template>
  <v-app>
    <admin-sidebar />
    <v-container class="pl-15 pt-15">
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
