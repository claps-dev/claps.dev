<template>
  <v-dialog v-model="visible" fullscreen hide-overlay>
    <template v-slot:activator="{ on }">
      <div :class="$style.container" class="d-flex align-center" v-on="on">
        <v-avatar class="rounded" color="grey" size="32" />
        <div class="ml-2 flex-grow-1">
          <div style="line-height:20px">BTC</div>
          <div class="caption" :class="$style.subTitle">Bitcoin</div>
        </div>
        <v-icon color="#c4c4c4">{{ right }}</v-icon>
      </div>
    </template>
    <v-app>
      <v-container>
        <div class="d-flex mb-4 headline font-weight-bold">
          <v-icon
            class="d-inline-flex align-center mr-3 black--text"
            @click="visible = false"
          >
            {{ arrowLeft }}
          </v-icon>
          Choose Coin
        </div>
        <v-list class="transparent">
          <template v-for="(item, index) of 3">
            <v-divider v-if="index" :key="'_' + item" />
            <v-list-item :key="item" class="mx--4">
              <v-list-item-avatar size="32" color="grey" class="mr-3 rounded">
                <v-img />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="subtitle-2 mb-0">
                  BTC
                </v-list-item-title>
                <v-list-item-subtitle class="caption" :class="$style.subTitle">
                  Bitcoin
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-container>
    </v-app>
  </v-dialog>
</template>
<script lang="ts">
import { mdiArrowLeft, mdiChevronRight } from '@mdi/js'
import { createComponent } from '@vue/composition-api'

export default createComponent({
  name: 'c-coin-select',
  setup() {
    return {
      arrowLeft: mdiArrowLeft,
      right: mdiChevronRight,
      visible: false,
    }
  },
})
</script>
<style lang="scss" module>
.container {
  padding: 5px;
  background-color: rgba(51, 51, 51, 0.1);
  border-radius: 22px;
}

.sub-title {
  color: rgba(51, 51, 51, 0.6) !important;
  line-height: 14px !important;
}
</style>
