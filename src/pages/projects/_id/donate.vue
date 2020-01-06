<template>
  <v-container>
    <c-back-title>Donate</c-back-title>
    <v-card>
      <v-card-subtitle>Choose a asset you want to donate</v-card-subtitle>
      <v-card-text>
        <full-select v-model="coin" :items="COINS">Choose Coin</full-select>
      </v-card-text>
      <v-card-subtitle class="py-0">
        How much
        <strong>BTC</strong>
        you offer
      </v-card-subtitle>
      <v-card-text>
        <v-text-field
          :class="$style.input"
          type="number"
          height="80"
          value="1.52105"
        ></v-text-field>
        <v-btn block color="primary" rounded>Donate</v-btn>
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
              <span class="float-right">0.91 BTC (59.82%)</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'

import { FullSelect, Tips } from '@/components'
import { Coin, DonationDistribution } from '@/types'
import { COINS, DONATION_DISTRIBUTIONS } from '@/utils'

export default createComponent({
  components: {
    FullSelect,
    Tips,
  },
  setup() {
    return {
      COINS,
      DONATION_DISTRIBUTIONS,
      coin: Coin.BTC,
      donationDistribution: DonationDistribution.PersperAlgorithm,
    }
  },
})
</script>
<style lang="scss" module>
.input {
  font-size: 64px;

  &:global(.v-input) input {
    max-height: unset;
  }
}
</style>
