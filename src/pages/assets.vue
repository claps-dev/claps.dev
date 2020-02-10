<template>
  <v-container>
    <c-back-title>Assets</c-back-title>
    <div class="headline">≈0.00783823 BTC</div>
    <div class="subtitle-1">≈$53.30</div>
    <n-link
      is="v-btn"
      v-if="mixinAuth"
      to="withdraw"
      class="mt-5"
      block
      color="primary"
      rounded
    >
      Withdraw to Fox.ONE
    </n-link>
    <template v-else>
      <tips>
        Because we store assets in Mixin Network, you must connect to Mixin or
        Fox.ONE App to withdraw your assets.
      </tips>
      <a
        is="v-btn"
        :href="mixinOauthUrl"
        class="mb-4"
        block
        color="primary"
        rounded
        @click="$utils.setCookie('redirectPath', $route.fullPath)"
      >
        Connect with Mixin
      </a>
      <a is="v-btn" :href="foxoneOauthUrl" block color="primary" rounded>
        Connect with Fox.ONE
      </a>
    </template>
    <v-list class="mt-2 mx--4 transparent">
      <v-list-item
        v-for="{ asset_id, icon_url, name, symbol } of assets"
        :key="asset_id"
      >
        <v-list-item-avatar size="42" color="grey" class="mr-3 rounded">
          <v-img :src="icon_url" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="subtitle-2 mb-0">
            {{ symbol }}
            <span class="float-right">0.00783</span>
          </v-list-item-title>
          <v-list-item-subtitle class="caption">
            {{ name }}
            <span class="float-right">$5147.85</span>
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { mapState } from 'vuex'

import { Tips } from '@/components'

export default {
  meta: {
    auth: true,
  },
  components: {
    Tips,
  },
  asyncData({ app }) {
    return app.store.dispatch('getAssets')
  },
  computed: {
    ...mapState(['assets', 'envs', 'mixinAuth', 'randomUid']),
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
}
</script>
