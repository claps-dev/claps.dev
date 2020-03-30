<template>
  <v-container :class="$style.container">
    <c-back-title>Profile</c-back-title>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-4 mr-0" color="grey" size="32">
          <v-img :src="user.avatar_url" />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title class="subtitle-2">
            {{ user.name }}
            <small v-if="user.name !== user.login" class="gray--text">
              ({{ user.login }})
            </small>
          </v-card-title>
          <v-card-subtitle class="caption">{{ user.bio }}</v-card-subtitle>
        </div>
      </div>
      <ul class="list-unstyled body-2 px-4 mb-4" :class="$style.emails">
        <li
          v-for="{ email, verified } of emails"
          :key="email"
          class="d-flex align-center"
          :class="{ [$style.verified]: verified }"
        >
          <v-icon class="mr-2">{{ checkCircle }}</v-icon>
          Email: {{ email }}
        </li>
      </ul>
      <v-divider />
      <div class="body-2 pa-4">
        <div class="mb-4">
          You received
          <strong class="primary--text">${{ donations.total }}</strong>
          from
          <strong class="primary--text">{{ donations.patrons }}</strong>
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
      </div>
      <v-divider />
      <v-list subheader class="mt-3">
        <v-subheader class="black--text font-weight-bold">Projects</v-subheader>
        <template v-for="(project, index) of projects">
          <v-divider v-if="index" :key="'_' + project.id" class="ml-4 mr-4" />
          <n-link :key="project.id" :to="'projects/' + project.name">
            <v-list-item>
              <v-list-item-avatar size="32" color="grey" class="mr-3">
                <v-img :src="project.avatarUrl" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="subtitle-2 mb-0">
                  {{ $utils.unionDisplayName(project) }}
                </v-list-item-title>
                <v-list-item-subtitle class="caption">
                  {{ project.description }}
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
import { mdiCheckCircle, mdiChevronRight } from '@mdi/js'
import { mapState } from 'vuex'

export default {
  meta: {
    auth: true,
  },
  async asyncData({ app }) {
    const { data } = await app.http.get('/user/profile')
    return data
  },
  data() {
    return {
      checkCircle: mdiCheckCircle,
      right: mdiChevronRight,
    }
  },
  computed: {
    ...mapState(['user']),
    donations() {
      return this.projects.reduce(
        (donations, p) => {
          donations.total += p.total
          donations.patrons += p.patrons
          return donations
        },
        { total: 0, patrons: 0 },
      )
    },
  },
}
</script>
<style lang="scss" module>
.container :global .v-card {
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

.emails .verified :global(.v-icon) {
  color: #27ae60;
}
</style>
