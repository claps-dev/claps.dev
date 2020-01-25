<template>
  <v-container>
    <c-back-title>Donation Details</c-back-title>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-4 mr-0" color="grey" size="48">
          <v-img :src="avatarUrl" />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-subtitle class="caption grey--text text--darken-4">
            {{ $utils.unionDisplayName($attrs) || 'You' }} will receive
            <strong class="primary--text">
              ${{ $utils.perMonth(total, createdAt) }}
            </strong>
            per month from
            <strong class="primary--text">{{ patrons }}</strong>
            patrons.
          </v-card-subtitle>
        </div>
      </div>
      <v-divider />
      <v-card-actions class="justify-space-between">
        <div>
          <div class="caption grey--text text--darken-1">Total</div>
          <strong class="subtitle-2 font-weight-bold primary--text">
            ${{ total }}
          </strong>
        </div>
        <div class="text-center">
          <div class="caption grey--text text--darken-1">Per Month</div>
          <strong class="subtitle-2 font-weight-bold primary--text">
            ${{ $utils.perMonth(total, createdAt) }}
          </strong>
        </div>
        <div class="text-right">
          <div class="caption grey--text text--darken-1">Patrons</div>
          <strong class="subtitle-2 font-weight-bold primary--text">
            {{ patrons }}
          </strong>
        </div>
      </v-card-actions>
    </v-card>
    <v-list subheader class="mt-5 mx--4 transparent">
      <v-subheader class="black--text font-weight-bold">
        Transactions
      </v-subheader>
      <template
        v-for="({ amount, asset_id, sender, transaction_id },
        index) of transactions"
      >
        <v-divider
          v-if="index"
          :key="'_' + transaction_id"
          class="mr-4"
          style="margin-left:60px"
        />
        <n-link
          is="v-list-item"
          :key="transaction_id"
          :to="'/transactions/' + transaction_id"
        >
          <local-scope
            v-slot="{ icon_url, symbol }"
            v-bind="getAsset(asset_id)"
          >
            <v-list-item-avatar size="32" color="grey" class="mr-3">
              <v-img :src="icon_url" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 mb-0">
                {{ amount }} {{ symbol }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                from {{ sender || 'anonymous' }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon class="mt-5 mb-5">
              <v-icon color="grey">
                {{ right }}
              </v-icon>
            </v-list-item-icon>
          </local-scope>
        </n-link>
      </template>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { mdiChevronRight } from '@mdi/js'

import { LocalScope } from './LocalScope'

export default {
  components: {
    LocalScope,
  },
  props: {
    avatarUrl: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    patrons: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    assets: {
      type: Array,
      required: true,
    },
    transactions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      right: mdiChevronRight,
    }
  },
  methods: {
    getAsset(assetId: string) {
      return this.assets.find(_ => _.asset_id === assetId)
    },
  },
}
</script>
