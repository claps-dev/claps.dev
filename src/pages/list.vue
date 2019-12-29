<template>
  <v-container>
    <c-back-title>Explore</c-back-title>
    <v-text-field
      clearable
      outlined
      rounded
      single-line
      placeholder="type to search"
      :class="$style.search"
    ></v-text-field>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar :class="$style.avatar" color="grey" size="48">
          <v-img />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title>Project Name A</v-card-title>
          <v-card-subtitle>
            PN is an operating system aiming to simplify as much as possible the
            administration of a server. This repository corresponds to the core
            code.
          </v-card-subtitle>
        </div>
      </div>
      <v-divider class="ml-4 mr-4" />
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
<style lang="scss" module>
.search:global(.v-input) input {
  text-align: center;
}

.avatar {
  margin: $top-spacing;
  margin-right: 0;
}

.card-footer {
  padding: $secondary-spacing $top-spacing;
}
</style>
