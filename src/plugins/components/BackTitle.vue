<template>
  <div class="d-flex headline font-weight-bold" :class="$style.container">
    <n-link class="d-inline-flex align-center mr-3" :to="$prevRoutePath">
      <v-icon class="black--text" @click="$router.back()">{{ svgPath }}</v-icon>
    </n-link>
    <slot />
  </div>
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { mdiArrowLeft } from '@mdi/js'

export default createComponent({
  name: 'c-back-title',
  setup() {
    return {
      svgPath: mdiArrowLeft,
    }
  },
})
</script>
<style lang="scss" module>
.container {
  margin-bottom: $top-spacing;
}
</style>
