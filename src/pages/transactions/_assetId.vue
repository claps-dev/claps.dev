<template>
  <v-container>
    <c-back-title>Transactions</c-back-title>
    <template
      v-for="({ amount, asset: { asset_id }, created_at, user_id, snapshot_id },
      index) of snapshots"
    >
      <v-divider
        v-if="index"
        :key="'_' + snapshot_id"
        class="mr-4"
        style="margin-left:60px"
      />
      <v-list-item :key="snapshot_id">
        <local-scope v-slot="{ icon_url, symbol }" v-bind="getAsset(asset_id)">
          <v-list-item-avatar size="32" color="grey" class="mr-3 rounded">
            <v-img :src="icon_url" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="subtitle-2 mb-0">
              {{ amount }} {{ symbol }}
            </v-list-item-title>
            <v-list-item-subtitle class="caption">
              from {{ user_id || 'anonymous' }} at
              {{ $utils.formatDistanceToNow(created_at) }} ago
            </v-list-item-subtitle>
          </v-list-item-content>
        </local-scope>
      </v-list-item>
    </template>
  </v-container>
</template>
<script lang="ts">
/* eslint-disable unicorn/filename-case */
import { mapState } from 'vuex'

import { LocalScope } from '@/components'

export default {
  meta: {
    auth: true,
  },
  components: {
    LocalScope,
  },
  async asyncData({ app, route }) {
    const [
      {
        data: { data: snapshots },
      },
    ] = await Promise.all([
      app.http.get('/network/snapshots', {
        params: {
          asset: route.params.assetId,
        },
      }),
      app.store.dispatch('getAssets'),
    ])
    return {
      snapshots: snapshots.filter(({ amount }) => amount > 0),
    }
  },
  computed: mapState(['allUserAssets']),
  methods: {
    getAsset(assetId: string) {
      return this.allUserAssets.find(_ => _.asset_id === assetId)
    },
  },
}
</script>
