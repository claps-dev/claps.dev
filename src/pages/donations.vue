<template>
  <donations
    v-bind="donations"
    :assets="allAssets"
    :transactions="transactions"
  />
</template>
<script lang="ts">
import { mapState } from 'vuex'

import { Donations } from '@/components'
import { Transaction } from '@/types'

export default {
  components: {
    Donations,
  },
  async asyncData({ app }) {
    const [
      {
        data: { data: transactions },
      },
      { data },
    ] = await Promise.all([
      app.http.get<{ data: Transaction[] }>('/external/transactions'),
      app.http.get('/user/profile'),
      app.store.dispatch('getAssets'),
    ])
    return Object.assign(data, { transactions })
  },
  computed: {
    ...mapState(['allAssets', 'user']),
    donations() {
      let total = 0
      let patrons = 0
      this.projects.forEach(p => {
        total += p.total
        patrons += p.patrons
      })
      return {
        avatarUrl: this.user.avatar_url,
        createdAt: this.user.created_at,
        total,
        patrons,
      }
    },
  },
}
</script>
