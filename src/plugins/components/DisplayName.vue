<template>
  <span>
    {{ name }}
    <small v-if="displayName && name !== displayName" class="gray--text">
      ({{ displayName }})
    </small>
  </span>
</template>
<script lang="ts">
export default {
  name: 'CDisplayName',
  props: {
    name: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      default: null,
    },
  },
}
</script>
