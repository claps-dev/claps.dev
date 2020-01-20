<template>
  <a
    v-if="isExternal"
    target="_blank"
    v-bind="$attrs"
    :href="href"
    rel="noreferrer noopener"
  >
    <slot />
  </a>
  <n-link v-else v-bind="$attrs" :to="href">
    <slot />
  </n-link>
</template>
<script lang="ts">
export default {
  name: 'CLink',
  props: {
    href: {
      type: String,
      required: true,
    },
  },
  computed: {
    isExternal() {
      return /^(https?:)?\/\//.test(this.href)
    },
  },
}
</script>
