<template>
  <v-container>
    <c-back-title>Assets</c-back-title>
    <div class="headline">≈{{ userPrices.btc }} BTC</div>
    <div class="mb-4 subtitle-1">≈${{ userPrices.usd }}</div>
    <tips v-if="!mixinAuth && !foxoneAuth" class="mb-4">
      Because we store assets in Mixin Network, you must connect to Mixin or
      Fox.ONE App to withdraw your assets.
    </tips>
    <n-link
      is="v-btn"
      v-if="mixinAuth"
      to="withdraw"
      class="mb-4"
      block
      color="primary"
      rounded
    >
      Withdraw to Mixin
    </n-link>
    <a
      is="v-btn"
      v-else
      :href="mixinOauthUrl"
      class="mb-4"
      block
      color="primary"
      rounded
      @click="$utils.setCookie('redirectPath', $route.fullPath)"
    >
      Connect with Mixin
    </a>
    <n-link
      is="v-btn"
      v-if="foxoneAuth"
      to="withdraw"
      class="mb-4"
      block
      color="primary"
      rounded
    >
      Withdraw to Fox.ONE
    </n-link>
    <a
      is="v-btn"
      v-else
      :href="foxoneOauthUrl"
      class="mb-4"
      block
      color="primary"
      rounded
    >
      Connect with Fox.ONE
    </a>
    <v-list class="mx--4 py-0 transparent">
      <v-list-item v-for="a of assets" :key="a.asset_id">
        <v-list-item-avatar size="42" color="grey" class="mr-3 rounded">
          <v-img :src="a.icon_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <local-scope v-slot="{ amount, usd }" v-bind="getAssetAmount(a)">
            <v-list-item-title class="subtitle-2 mb-0">
              {{ a.symbol }}
              <span class="float-right">{{ amount }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="caption">
              {{ a.name }}
              <span class="float-right">${{ usd }}</span>
            </v-list-item-subtitle>
          </local-scope>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { bignumber } from 'mathjs'
import { mapGetters, mapState } from 'vuex'

import { LocalScope, Tips } from '@/components'
import { Asset } from '@/types'

export default {
  meta: {
    auth: true,
  },
  components: {
    LocalScope,
    Tips,
  },
  fetch({ app }) {
    return Promise.all([
      app.store.dispatch('getAssets'),
      app.store.dispatch('getUserAssets'),
    ])
  },
  computed: {
    ...mapGetters(['userPrices']),
    ...mapState([
      'assets',
      'userAssets',
      'envs',
      'mixinAuth',
      'foxoneAuth',
      'randomUid',
    ]),
    mixinOauthUrl() {
      return this.$utils.normalizeUrl(this.$utils.MIXIN_OAUTH_URL, {
        client_id: this.envs.MIXIN_CLIENT_ID,
        scope: this.$utils.authScopes(this.$utils.ALL_AUTH_SCOPES, true),
        state: this.randomUid,
      })
    },
    foxoneOauthUrl() {
      return this.$utils.normalizeUrl(this.$utils.FOXONE_OAUTH_URL, {
        client_id: this.envs.FOXONE_CLIENT_ID,
        code_challenge: '',
        response_type: 'code',
        scope: this.$utils.authScopes(),
        state: this.randomUid,
      })
    },
  },
  methods: {
    getAssetAmount(asset: Asset) {
      const amount = this.userAssets?.[asset.asset_id] || 0
      return {
        amount,
        usd: bignumber(asset.price_usd).mul(amount),
      }
    },
  },
}
</script>
