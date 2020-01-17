<template>
  <v-container>
    <c-back-title @[donatingEvent]="donating = false">
      Donate
    </c-back-title>
    <v-card>
      <template v-if="donating">
        <v-card-subtitle>
          You will give
          <strong class="primary--text">{{ amount }}</strong>
          <strong>{{ asset.symbol }}</strong>
          to
          <strong class="primary--text">{{ $route.params.name }}</strong>
          Follow one of those approaches to donate:
        </v-card-subtitle>
        <div class="px-4" :class="$style.step">
          <div class="mb-4 subtitle font-weight-bold">
            Use Mixin Messenger or Fox.ONE
          </div>
          <div class="d-flex">
            <qrcode
              :class="$style.qrcode"
              value="https://1stG.me"
              :width="118"
            />
            <div
              class="d-flex flex-column flex-grow-1 justify-space-around ml-5"
              :class="$style.downloads"
            >
              <v-btn
                class="flex-grow-0"
                block
                color="primary"
                outlined
                rounded
                large
              >
                <div class="overline">DOWNLOAD</div>
                <strong>Mixin Messenger</strong>
              </v-btn>
              <v-btn
                class="flex-grow-0"
                block
                color="primary"
                outlined
                rounded
                large
              >
                <div class="overline">DOWNLOAD</div>
                <strong>Fox.ONE App</strong>
              </v-btn>
            </div>
          </div>
          <v-card-subtitle class="mx--4">
            Use the App scan the QrCode to Donate
          </v-card-subtitle>
        </div>
        <div class="px-4" :class="$style.step">
          <div class="mb-4 subtitle font-weight-bold">
            Use {{ asset.symbol }} Network
          </div>
          <div class="mb-4 pa-3" :class="$style.token">
            {{ token }}
          </div>
          <v-btn
            v-clipboard="token"
            class="font-weight-bold"
            color="primary"
            outlined
            rounded
            @clipboard-success="copied = true"
          >
            Copy
          </v-btn>
          <v-snackbar
            v-model="copied"
            :class="$style.copied"
            color="success"
            top
          >
            Copied Successfully!
          </v-snackbar>
        </div>
        <v-card-text class="pt-0">
          <tips>
            Use the address to donate in {{ asset.name }} network. It may take
            30 mins to be confirmed.
          </tips>
        </v-card-text>
      </template>
      <template v-else>
        <v-card-subtitle>Choose a asset you want to donate</v-card-subtitle>
        <v-card-text>
          <full-select v-model="assetId" :items="items">
            Choose Coin
          </full-select>
        </v-card-text>
        <v-card-subtitle class="py-0">
          How much
          <strong>{{ asset.symbol }}</strong>
          you offer
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="amount"
            :class="$style.input"
            type="number"
            height="80"
            placeholder="Amount"
            min="0"
          ></v-text-field>
          <v-btn
            block
            :disabled="amount <= 0"
            color="primary"
            rounded
            @click="donating = true"
          >
            Donate
          </v-btn>
        </v-card-text>
        <v-card-subtitle class="font-weight-bold">
          Donation Distributions
        </v-card-subtitle>
        <v-card-text>
          <full-select
            v-model="donationDistributionValue"
            :items="DONATION_DISTRIBUTIONS"
            concise
          >
            Choose Distribution
          </full-select>
          <tips class="mb-0">
            {{ donationDistribution.description }}
          </tips>
        </v-card-text>
        <v-list class="pt-0">
          <v-list-item v-for="{ __user__: user } of members" :key="user.id">
            <v-list-item-avatar size="32" color="grey" class="mr-3">
              <v-img :src="user.avatarUrl" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 mb-0">
                {{ user.name }}
                <span class="float-right">
                  <local-scope
                    v-slot="{ distributed: [x, y] }"
                    :distributed="distributeDonation(user)"
                  >
                    {{ x }} {{ asset.symbol }} ({{ y }}%)
                  </local-scope>
                </span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import Qrcode from 'vue-qrcode'
import { multiply } from 'mathjs'
import { mapState } from 'vuex'

import { FullSelect, LocalScope, Tips } from '@/components'
import { DonationDistribution } from '@/types'
import { DONATION_DISTRIBUTIONS } from '@/utils'

export default {
  components: {
    FullSelect,
    LocalScope,
    Tips,
    Qrcode,
  },
  fetch({ app }) {
    return app.store.dispatch('fetchAssets')
  },
  async asyncData({ app, route }) {
    const { data } = await app.http.get(
      `/projects/${route.params.name}/members`,
    )
    return {
      members: data,
    }
  },
  data() {
    return {
      assetId: null,
      DONATION_DISTRIBUTIONS,
      donationDistributionValue: DONATION_DISTRIBUTIONS[0].value,
      donating: false,
      amount: null,
      token: '1PqcopKzdg8ZM22f6cAoCpJ8WS7xvsFJ3n',
      copied: false,
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
      return multiply(this.asset.price_usd || 0, this.mount)
    },
    donatingEvent() {
      return this.donating ? 'click' : null
    },
    donationDistribution() {
      return this.DONATION_DISTRIBUTIONS.find(
        distribution => distribution.value === this.donationDistributionValue,
      )
    },
  },
  methods: {
    distributeDonation() {
      const membersNum = this.members.length
      // eslint-disable-next-line sonarjs/no-small-switch
      switch (this.donationDistributionValue) {
        case DonationDistribution.IdenticalAmount: {
          return [this.amount / membersNum, 100 / membersNum]
        }
      }
      return []
    },
  },
}
</script>
<style lang="scss" module>
.input {
  font-size: 64px;

  &:global(.v-input) input {
    max-height: unset;

    &::-webkit-inner-spin-button {
      display: none;
    }
  }
}

.qrcode {
  border: 1px solid #888;
}

.downloads :global .v-btn {
  border-width: 2px;

  &__content {
    flex-direction: column;
  }
}

.token {
  background: rgba(0, 0, 0, 0.03);
  color: rgba(51, 51, 51, 0.6);
  border-radius: 7px;
  font-family: DIN Alternate, serif;

  + :global(.v-btn) {
    border-width: 2px;
  }
}

.copied :global(.v-snack__content) {
  justify-content: center;
}
</style>
