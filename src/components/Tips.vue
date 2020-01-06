<template>
  <div class="my-4 pa-3 caption" :class="$style.tips">
    <slot />
    <div class="font-weight-bold text-right">
      Learn more
      <v-icon color="#b67800" small>{{ doubleRight }}</v-icon>
    </div>
  </div>
</template>
<script lang="ts">
import { mdiChevronDoubleRight } from '@mdi/js'
import { createComponent } from '@vue/composition-api'

export default createComponent({
  setup() {
    return {
      doubleRight: mdiChevronDoubleRight,
    }
  },
})
</script>
<style lang="scss" module>
.tips {
  background-color: #fff6e6;
  border: 1px solid #ffc24a;
  color: #b67800;
}
</style>
