<template>
  <donations v-bind="donations" :assets="assets" />
</template>
<script lang="ts">
import { mapState } from 'vuex'

import { Donations } from '@/components'

export default {
  meta: {
    auth: true,
  },
  components: {
    Donations,
  },
  async asyncData({ app }) {
    const [{ data }] = await Promise.all([
      app.http.get('/user/profile'),
      app.store.dispatch('getAssets'),
    ])
    return data
  },
  computed: {
    ...mapState(['assets', 'user']),
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
