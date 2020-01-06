<template>
  <v-dialog v-model="visible" fullscreen hide-overlay>
    <template v-slot:activator="{ on }">
      <div :class="$style.container" class="d-flex align-center" v-on="on">
        <v-avatar
          v-if="activeItem.avatar"
          class="rounded"
          color="grey"
          size="32"
        >
          <v-img :src="activeItem.avatar" />
        </v-avatar>
        <div class="ml-2 flex-grow-1">
          <div style="line-height:20px">{{ activeItem.title }}</div>
          <div v-if="!concise" class="caption" :class="$style.description">
            {{ activeItem.description }}
          </div>
        </div>
        <v-icon color="#c4c4c4">{{ right }}</v-icon>
      </div>
    </template>
    <v-app>
      <v-container>
        <c-back-title @click="visible = false">
          <slot />
        </c-back-title>
        <v-list class="transparent">
          <template v-for="(item, index) of items">
            <v-divider v-if="index" :key="'_' + item.title" />
            <v-list-item
              :key="item.title"
              class="mx--4"
              @click="
                $emit('change', item.value)
                visible = false
              "
            >
              <v-list-item-avatar
                v-if="item.avatar"
                size="32"
                color="grey"
                class="mr-3 rounded"
              >
                <v-img :src="item.avatar" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="subtitle-2 mb-0">
                  {{ item.title }}
                </v-list-item-title>
                <v-list-item-subtitle
                  class="caption"
                  :class="$style.description"
                >
                  {{ item.description }}
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

import { SelectItem } from '@/types'

export interface FullSelectProps {
  items: SelectItem[]
}

export default createComponent({
  model: {
    event: 'change',
  },
  props: {
    concise: Boolean,
    items: {
      type: Array,
      default: [],
    },
    value: {
      type: [String, Number, Symbol],
    },
  },
  computed: {
    activeItem(): SelectItem {
      if (!this.items.length) {
        return
      }

      return this.items.find(item => item.value === this.value) || this.items[0]
    },
  },
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

.description {
  color: rgba(51, 51, 51, 0.6) !important;
  line-height: 14px !important;
}
</style>
