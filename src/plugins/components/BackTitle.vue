<template>
  <div class="headline title" :class="$style.container">
    <router-link :to="$prevRoutePath">
      <v-icon @click="$router.back()">{{ svgPath }}</v-icon>
    </router-link>
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
