<template>
  <v-container>
    <div class="headline title">
      <router-link to="/">
        <v-icon @click="$router.back()">{{ leftSvg }}</v-icon>
      </router-link>
      Explore
    </div>
    <v-text-field
      clearable
      outlined
      rounded
      single-line
      placeholder="type to search"
      :class="$style.search"
    ></v-text-field>
    <v-card :class="$style.card">
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar :class="$style.avatar" color="grey" size="48">
          <v-img />
        </v-avatar>
        <div>
          <v-card-title>
            Project Name A
          </v-card-title>
          <v-card-subtitle>
            PN is an operating system aiming to simplify as much as possible the
            administration of a server. This repository corresponds to the core
            code.
          </v-card-subtitle>
        </div>
      </div>
      <div class="split-line"></div>
      <v-card-actions
        class="d-flex justify-space-between"
        :class="$style.cardFooter"
      >
        <div>
          <strong class="primary--text">$10.23</strong>
          / Mon
        </div>
        <div>
          <strong class="primary--text">$10.23</strong>
          Patrons
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { createComponent } from '@vue/composition-api'
import { mdiArrowLeft } from '@mdi/js'

export default createComponent({
  setup() {
    return {
      leftSvg: mdiArrowLeft,
    }
  },
})
</script>
<style lang="scss" module>
.search:global(.v-input) {
  margin-top: $top-spacing;

  input {
    text-align: center;
  }
}

.card {
  border-radius: $square-radius;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.avatar {
  margin: $top-spacing;
  margin-right: 0;
  border-radius: $square-radius;
}

.card-footer {
  padding: $secondary-spacing $top-spacing;
}
</style>
