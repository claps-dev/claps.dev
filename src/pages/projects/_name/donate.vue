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
          <strong class="primary--text">
            {{ $utils.unionDisplayName(project) }}
          </strong>
          Follow one of those approaches to donate:
        </v-card-subtitle>
        <div class="px-4" :class="$style.step">
          <div class="mb-4 subtitle font-weight-bold">
            Use Mixin Messenger or Fox.ONE
          </div>
          <div class="d-flex">
            <qrcode :class="$style.qrcode" :value="qrcode" :width="118" />
            <div
              class="d-flex flex-column flex-grow-1 justify-space-around ml-5"
              :class="$style.downloads"
            >
              <c-link class="flex-grow-0" href="https://mixin.one/messenger">
                <v-btn block color="primary" outlined rounded large>
                  <div class="overline">DOWNLOAD</div>
                  <strong>Mixin Messenger</strong>
                </v-btn>
              </c-link>
              <c-link class="flex-grow-0" href="https://fox.one">
                <v-btn block color="primary" outlined rounded large>
                  <div class="overline">DOWNLOAD</div>
                  <strong>Fox.ONE App</strong>
                </v-btn>
              </c-link>
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
          <local-scope
            v-slot="{ botAsset }"
            :bot-asset="botAssets[assetId] || {}"
          >
            <div class="mb-4 pa-3" :class="$style.destination">
              {{ botAsset.destination || 'Loading...' }}
            </div>
            <v-btn
              v-clipboard="botAsset.destination"
              class="mb-4 font-weight-bold"
              color="primary"
              outlined
              rounded
              :disabled="!botAsset.destination"
              @clipboard-success="copied = true"
            >
              Copy
            </v-btn>
            <template v-if="botAsset.tag">
              <div class="mb-4 subtitle font-weight-bold">
                {{ asset.symbol }} Memo
              </div>
              <div class="mb-4 pa-3" :class="$style.destination">
                {{ botAsset.tag }}
              </div>
              <v-btn
                v-clipboard="botAsset.tag"
                class="mb-4 font-weight-bold"
                color="primary"
                outlined
                rounded
                @clipboard-success="copied = true"
              >
                Copy
              </v-btn>
            </template>
          </local-scope>
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
          <tips class="mb-4">
            Use the address to donate in {{ asset.name }} network. It may take
            30 mins to be confirmed.
          </tips>
        </v-card-text>
      </template>
      <template v-else>
        <v-card-subtitle>Choose a asset you want to donate</v-card-subtitle>
        <v-card-text>
          <full-select v-model="assetId" :items="assetItems">
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
            :disabled="!assetId || amount <= 0"
            color="primary"
            rounded
            @click="donate"
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
            :items="$utils.DONATION_DISTRIBUTIONS"
            concise
          >
            Choose Distribution
          </full-select>
          <tips class="mt-4 mb-0">
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
import { multiply } from 'mathjs'
import Qrcode from 'vue-qrcode'
import { mapGetters, mapState } from 'vuex'
import { v4 as uuid } from 'uuid'

import { FullSelect, LocalScope, Tips } from '@/components'

export default {
  components: {
    FullSelect,
    LocalScope,
    Tips,
    Qrcode,
  },
  async asyncData({ app, route }) {
    const { name } = route.params
    const [project, { data }] = await Promise.all([
      app.store.dispatch('getProject', name),
      app.http.get(`/projects/${name}/members`),
      app.store.dispatch('getAssets'),
    ])
    return {
      members: data,
      project,
    }
  },
  data() {
    return {
      assetId: null,
      donationDistributionValue: this.$utils.DONATION_DISTRIBUTIONS[0].value,
      donating: false,
      amount: null,
      copied: false,
      botAssets: {},
    }
  },
  computed: {
    ...mapGetters(['assetItems']),
    ...mapState(['assets']),
    botId() {
      return this.project.botIds[this.donationDistributionValue]
    },
    asset() {
      return this.assets?.find(asset => asset.asset_id === this.assetId) || {}
    },
    qrcode() {
      return (
        this.assetId &&
        this.$utils.normalizeUrl('mixin://pay', {
          recipient: this.botId,
          asset: this.assetId,
          amount: this.amount,
          trace: uuid(),
          memo: 'Donate',
        })
      )
    },
    usdt() {
      return multiply(this.asset.price_usd || 0, this.mount)
    },
    donatingEvent() {
      return this.donating ? 'click' : null
    },
    donationDistribution() {
      return this.$utils.DONATION_DISTRIBUTIONS.find(
        distribution => distribution.value === this.donationDistributionValue,
      )
    },
  },
  methods: {
    distributeDonation() {
      const membersNum = this.members.length
      return [this.amount / membersNum, 100 / membersNum]
    },
    async donate() {
      this.donating = true
      if (this.botAssets[this.assetId]) {
        return
      }
      const { data } = await this.$http.get(
        `/bots/${this.botId}/assets/${this.assetId}`,
      )
      this.$set(this.botAssets, this.assetId, data)
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

.destination {
  background: rgba(0, 0, 0, 0.03);
  color: rgba(51, 51, 51, 0.6);
  border-radius: 7px;
  font-family: DIN Alternate, serif;
  white-space: nowrap;

  + :global(.v-btn) {
    border-width: 2px;
  }
}

.copied :global(.v-snack__content) {
  justify-content: center;
}
</style>
