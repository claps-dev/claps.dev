<template>
  <div class="d-flex mb-4 headline align-center font-weight-bold">
    <v-icon
      v-if="$listeners.click"
      class="d-inline-flex  mr-3 black--text"
      @click="$listeners.click"
    >
      {{ svgPath }}
    </v-icon>
    <n-link v-else class="d-inline-flex mr-3" :to="$prevRoutePath">
      <v-icon class="black--text" @click="$router.back()">{{ svgPath }}</v-icon>
    </n-link>
    <slot />
  </div>
</template>
<script lang="ts">
import { mdiArrowLeft } from '@mdi/js'

export default {
  name: 'CBackTitle',
  data() {
    return {
      svgPath: mdiArrowLeft,
    }
  },
}
</script>
