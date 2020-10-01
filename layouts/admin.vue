<template>
  <v-app style="background-color: #ededed">
    <admin-sidebar />
    <v-content>
      <v-container class="pl-15 pt-15">
        <nuxt />
      </v-container>
    </v-content>
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
