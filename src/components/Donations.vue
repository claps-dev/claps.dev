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
      <template v-for="(item, index) of 3">
        <v-divider
          v-if="index"
          :key="'_' + item"
          class="mr-4"
          style="margin-left:60px"
        />
        <n-link :key="item" :to="'/transactions/' + item">
          <v-list-item>
            <v-list-item-avatar size="32" color="grey" class="mr-3">
              <v-img />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2 mb-0">
                0.001 EOS
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                from anonymous
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-icon class="mt-5 mb-5">
              <v-icon color="grey">
                {{ right }}
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </n-link>
      </template>
    </v-list>
  </v-container>
</template>
<script lang="ts">
import { mdiChevronRight } from '@mdi/js'

export default {
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
  },
  data() {
    return {
      right: mdiChevronRight,
    }
  },
}
</script>
