<template>
  <donations
    v-bind="project"
    :assets="allAssets"
    :transactions="transactions"
  />
</template>
<script lang="ts">
import { mapState } from 'vuex'

import { Donations } from '@/components'

export default {
  components: {
    Donations,
  },
  async asyncData({ app, route }) {
    const [
      {
        data: { data: transactions },
      },
      project,
    ] = await Promise.all([
      app.http.get<{ data: Transaction[] }>('/external/transactions'),
      app.store.dispatch('getProject', route.params.name),
      app.store.dispatch('getAssets'),
    ])
    return {
      project,
      transactions,
    }
  },
  computed: mapState(['allAssets']),
}
</script>
