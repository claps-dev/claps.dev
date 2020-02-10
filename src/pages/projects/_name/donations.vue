<template>
  <donations v-bind="_data" :assets="assets" />
</template>
<script lang="ts">
import { mapState } from 'vuex'

import { Donations } from '@/components'

export default {
  components: {
    Donations,
  },
  async asyncData({ app, route }) {
    const [project] = await Promise.all([
      app.store.dispatch('getProject', route.params.name),
      app.store.dispatch('getAssets'),
    ])
    return project
  },
  computed: mapState(['assets']),
}
</script>
