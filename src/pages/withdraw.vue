<template>
  <v-container>
    <c-back-title>Withdraw {{ asset.symbol }}</c-back-title>
    <v-card>
      <v-card-text>
        <full-select
          v-model="assetId"
          :items="assetItems"
          @change="onAssetChange"
        />
        <v-text-field
          :value="amount"
          :hint="'≈$' + usdt"
          :suffix="asset.symbol"
          persistent-hint
          disabled
          type="number"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="primary"
          :disabled="amount <= 0"
          :loading="loading"
          rounded
          @click="onSend"
        >
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { multiply } from 'mathjs'
import { mapGetters, mapState } from 'vuex'

import { FullSelect } from '@/components'

export default {
  meta: {
    auth: true,
  },
  components: {
    FullSelect,
  },
  fetch({ app }) {
    return Promise.all([
      app.store.dispatch('getAssets'),
      app.store.dispatch('getUserAssets'),
    ])
  },
  data() {
    return {
      assetId: null,
      amount: 0,
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['assetItems']),
    ...mapState(['assets', 'userAssets']),
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
  methods: {
    onAssetChange() {
      this.amount = this.userAssets[this.assetId] || 0
    },
    async onSend() {
      this.loading = true
      try {
        await this.$http.post('/user/withdraw', {
          assetId: this.assetId,
          amount: this.amount,
        })
      } finally {
        this.loading = false
      }
    },
  },
}
</script>
