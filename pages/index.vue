<template>
  <div>
    {{ message }}
  </div>
</template>
<script lang="ts">
import { createComponent, ref } from '@vue/composition-api'
export default createComponent({
  setup() {
    return {
      message: ref('This is a message'),
    }
  },
})
</script>
