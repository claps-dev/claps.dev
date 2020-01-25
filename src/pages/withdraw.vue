<template>
  <v-container>
    <c-back-title>Withdraw {{ asset.symbol }}</c-back-title>
    <v-card>
      <v-card-text>
        <full-select v-model="assetId" :items="items" />
        <v-text-field
          v-model="amount"
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
import { mapState } from 'vuex'

import { FullSelect } from '@/components'

export default {
  components: {
    FullSelect,
  },
  asyncData({ app }) {
    return app.store.dispatch('getAssets')
  },
  data() {
    return {
      assetId: null,
      amount: 0.0001,
    }
  },
  computed: {
    ...mapState(['assets']),
    items() {
      return this.assets.map(({ symbol, name, icon_url, asset_id }) => ({
        title: symbol,
        description: name,
        avatar: icon_url,
        value: asset_id,
      }))
    },
    asset() {
      return (
        (this.assetId &&
          this.assets.find(asset => asset.asset_id === this.assetId)) ||
        {}
      )
    },
    usdt() {
      return multiply(this.asset.price_usd || 0, this.amount)
    },
  },
}
</script>
