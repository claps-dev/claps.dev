<template>
  <v-container>
    <c-back-title @[donatingEvent]="donating = false">
      Donate
    </c-back-title>
    <v-card>
      <template v-if="donating">
        <v-card-subtitle>
          You will give
          <strong class="primary--text">1.52105</strong>
          <strong>{{ asset.symbol }}</strong>
          to
          <strong class="primary--text">Project Name</strong>
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
            1PqcopKzdg8ZM22f6cAoCpJ8WS7xvsFJ3n
          </div>
          <v-btn class="font-weight-bold" color="primary" outlined rounded>
            Copy
          </v-btn>
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
          ></v-text-field>
          <v-btn block color="primary" rounded @click="donating = true">
            Donate
          </v-btn>
        </v-card-text>
        <v-card-subtitle class="font-weight-bold">
          Donation Distributions
        </v-card-subtitle>
        <v-card-text>
          <full-select
            v-model="donationDistribution"
            :items="DONATION_DISTRIBUTIONS"
            concise
          >
            Choose Distribution
          </full-select>
          <tips class="mb-0">
            The algorithm of Persper use code analytics to calculate each
            developer’s contribution.
          </tips>
        </v-card-text>
        <v-list class="pt-0">
          <v-list-item v-for="item of 3" :key="item">
            <v-list-item-avatar size="32" color="grey" class="mr-3">
              <v-img />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 mb-0">
                Charlie Wu
                <span class="float-right">
                  0.91 {{ asset.symbol }} (59.82%)
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

import { FullSelect, Tips } from '@/components'
import { DonationDistribution } from '@/types'
import { DONATION_DISTRIBUTIONS } from '@/utils'

export default {
  components: {
    FullSelect,
    Tips,
    Qrcode,
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
      DONATION_DISTRIBUTIONS,
      donationDistribution: DonationDistribution.PersperAlgorithm,
      donating: false,
      amount: 1.52105,
    }
  },
  computed: {
    asset() {
      return (
        (this.assets &&
          this.assetId &&
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
  },
}
</script>
<style lang="scss" module>
.input {
  font-size: 64px;

  &:global(.v-input) input {
    max-height: unset;
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
</style>
