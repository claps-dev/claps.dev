<template>
  <v-container :class="$style.container">
    <c-back-title>Profile</c-back-title>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-4 mr-0" color="grey" size="32">
          <v-img />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title class="subtitle-2">Project Name A</v-card-title>
          <v-card-subtitle class="caption">bio from github</v-card-subtitle>
        </div>
      </div>
      <ul class="list-unstyled body-2 pl-4 pr-4" :class="$style.emails">
        <li class="d-flex align-center">
          <v-icon class="mr-2">{{ checkCircle }}</v-icon>
          Email: xxx@gmail.com
        </li>
        <li class="d-flex align-center">
          <v-icon class="mr-2">{{ checkCircle }}</v-icon>
          Email: abc@xyz.com
        </li>
      </ul>
      <a class="d-flex align-center subtitle-2 pa-4 pt-2">
        Claim an Email Address
        <v-icon class="primary--text">{{ doubleRight }}</v-icon>
      </a>
      <v-divider />
      <div class="body-2 pa-4">
        <div class="mb-4">
          You receives
          <strong class="primary--text">$53.30</strong>
          from
          <strong class="primary--text">166</strong>
          patrons.
        </div>
        <div class="d-flex flex-no-wrap justify-space-between mb-4">
          <n-link
            is="v-btn"
            to="assets"
            rounded
            color="primary"
            class="flex-grow-1 font-weight-bold"
          >
            Withdraw
          </n-link>
          <n-link
            is="v-btn"
            to="donations"
            rounded
            outlined
            color="primary"
            class="flex-grow-1 ml-4 font-weight-bold border-2"
          >
            Details
          </n-link>
        </div>
        <div class="d-flex flex-no-wrap justify-space-between align-center">
          <div class="secondary--text caption">
            Transfer donation to Fox.ONE App
          </div>
          <v-switch class="mt-0 pt-0" :class="$style.switch"></v-switch>
        </div>
      </div>
      <v-divider />
      <v-list subheader class="mt-3">
        <v-subheader class="black--text font-weight-bold">Projects</v-subheader>
        <template v-for="(item, index) of 3">
          <v-divider v-if="index" :key="'_' + item" class="ml-4 mr-4" />
          <n-link :key="item" :to="'projects/' + item">
            <v-list-item>
              <v-list-item-avatar size="32" color="grey" class="mr-3">
                <v-img></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="subtitle-2 mb-0">
                  Project Name
                </v-list-item-title>
                <v-list-item-subtitle class="caption">
                  412 stars, updated 2 weeks ago
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-icon class="mt-5 mb-5">
                <v-icon color="grey">
                  {{ right }}
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </n-link>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { mdiCheckCircle, mdiChevronDoubleRight, mdiChevronRight } from '@mdi/js'
import { createComponent } from '@vue/composition-api'

export default createComponent({
  setup() {
    return {
      checkCircle: mdiCheckCircle,
      doubleRight: mdiChevronDoubleRight,
      right: mdiChevronRight,
    }
  },
})
</script>
<style lang="scss" module>
.container {
  :global {
    .subtitle-2 {
      line-height: 20px;
    }

    .caption {
      line-height: 12px;
    }

    .v-icon {
      height: $top-spacing;
      width: $top-spacing;
    }
  }
}

.switch {
  :global {
    .v-input__control > {
      .v-input__slot {
        margin-bottom: 0;
      }

      .v-messages {
        display: none;
      }
    }
  }
}

.emails :global(.v-icon) {
  color: #27ae60;
}
</style>
