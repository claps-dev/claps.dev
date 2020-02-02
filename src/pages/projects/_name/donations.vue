<template>
  <donations v-bind="_data" :assets="[]" />
</template>
<script lang="ts">
import { Donations } from '@/components'

export default {
  components: {
    Donations,
  },
  asyncData({ app, route }) {
    return app.store.dispatch('getProject', route.params.name)
  },
}
</script>
