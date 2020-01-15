<template>
  <v-app>
    <v-text-field v-if="loading" color="success" loading disabled />
    <nuxt v-else />
  </v-app>
</template>
<script lang="ts">
import { mapState } from 'vuex'
export default {
  computed: mapState(['loading']),
}
</script>
