<template>
  <v-container>
    <c-back-title>Withdraw BTC</c-back-title>
    <v-card>
      <v-card-text>
        <full-select v-model="assetId" :items="items" />
        <v-text-field
          v-model="mount"
          :hint="'≈$' + usdt"
          persistent-hint
          :suffix="asset.symbol"
          type="number"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" rounded>Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { multiply } from 'mathjs'

import { FullSelect } from '@/components'

export default {
  components: {
    FullSelect,
  },
  async asyncData({ app }) {
    const { data } = await app.http.get<Array<import('mixin-node-sdk').Asset>>(
      '/mixin/assets',
    )
    return {
      assets: data,
      items: data.map(({ symbol, name, icon_url, asset_id }) => ({
        title: symbol,
        description: name,
        avatar: icon_url,
        value: asset_id,
      })),
    }
  },
  data() {
    return {
      assetId: null,
      mount: 0.0001,
    }
  },
  computed: {
    asset() {
      if (!this.assetId || !this.assets) {
        return {}
      }
      return this.assets.find(asset => asset.asset_id === this.assetId) || {}
    },
    usdt() {
      return multiply(this.asset.price_usd || 0, this.mount)
    },
  },
}
</script>
