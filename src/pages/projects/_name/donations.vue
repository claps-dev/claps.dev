<template>
  <donations v-bind="project" />
</template>
<script lang="ts">
import { Donations } from '@/components'

export default {
  components: {
    Donations,
  },
  async asyncData({ app, route }) {
    return {
      project: await app.store.dispatch('getProject', route.params.name),
    }
  },
}
</script>
