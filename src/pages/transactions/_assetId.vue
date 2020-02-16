<template>
  <v-container>
    <c-back-title>Transactions</c-back-title>
    <template v-if="transfers.length">
      <template
        v-for="({ amount, assetId, createdAt, snapshotId }, index) of transfers"
      >
        <v-divider
          v-if="index"
          :key="'_' + snapshotId"
          class="mr-4"
          style="margin-left:60px"
        />
        <v-list-item :key="snapshotId">
          <local-scope v-slot="{ icon_url, symbol }" v-bind="getAsset(assetId)">
            <v-list-item-avatar size="32" color="grey" class="mr-3 rounded">
              <v-img :src="icon_url" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 mb-0">
                {{ amount }} {{ symbol }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                at {{ $utils.formatDistanceToNow(createdAt) }} ago
              </v-list-item-subtitle>
            </v-list-item-content>
          </local-scope>
        </v-list-item>
      </template>
    </template>
    <v-card v-else>
      <v-card-text>
        No transaction yet
      </v-card-text>
    </v-card>
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
    const [{ data }] = await Promise.all([
      app.http.get('/user/transactions', {
        params: {
          assetId: route.params.assetId,
        },
      }),
      app.store.dispatch('getAssets'),
    ])
    return {
      transfers: data,
    }
  },
  computed: mapState(['allAssets']),
  methods: {
    getAsset(assetId: string) {
      return this.allAssets.find(_ => _.asset_id === assetId)
    },
  },
}
</script>
