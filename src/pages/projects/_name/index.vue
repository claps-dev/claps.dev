<template>
  <v-container>
    <c-back-title>Project Detail</c-back-title>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-4 mr-0" color="grey" size="48">
          <v-img :src="avatarUrl" />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title class="subtitle-2">
            {{ $route.params.name }}
          </v-card-title>
          <v-card-subtitle class="caption">
            {{ description }}
          </v-card-subtitle>
        </div>
      </div>
      <v-divider class="ml-4 mr-4" />
      <div class="body-2 pa-4">
        <div class="mb-4">
          {{ $route.params.name }} receives
          <strong class="primary--text">
            ${{ perMonth(total, createdAt) }}
          </strong>
          per month from
          <strong class="primary--text">{{ patrons }}</strong>
          patrons.
        </div>
        <div class="d-flex flex-no-wrap justify-space-between">
          <n-link
            is="v-btn"
            :to="`/projects/${$route.params.name}/donate`"
            rounded
            color="primary"
            class="flex-grow-1 font-weight-bold"
          >
            Donate
          </n-link>
          <n-link
            is="v-btn"
            :to="`/projects/${$route.params.name}/donations`"
            rounded
            outlined
            color="primary"
            class="flex-grow-1 ml-4 font-weight-bold border-2"
          >
            Details
          </n-link>
        </div>
      </div>
      <v-divider class="ma-4 mt-0 mb-3" />
      <v-list subheader>
        <v-subheader class="black--text font-weight-bold">Members</v-subheader>
        <template v-for="{ __user__: user } of members">
          <v-list-item :key="user.id">
            <v-list-item-avatar size="32" color="grey" class="mr-3">
              <v-img :src="user.avatarUrl" />
            </v-list-item-avatar>
            <v-list-item-content class="pa-1">
              <v-list-item-title class="subtitle-2 mb-0">
                <c-display-name v-bind="user" />
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ user.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-list subheader>
        <v-subheader class="black--text font-weight-bold">
          Repositories
        </v-subheader>
        <template v-for="item of repositories">
          <v-list-item :key="item.id">
            <v-list-item-content class="pa-1">
              <v-list-item-title class="subtitle-2 mb-0">
                <c-link
                  :href="
                    GIT_CLIENT_PREFIXES[RepositoryType[item.type]] + item.slug
                  "
                >
                  {{ item.name }}
                </c-link>
                @ {{ RepositoryType[item.type] }}
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                {{ item.stars }} stars, updated
                {{ formatDistanceToNow(item.updatedAt) }} ago
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { RepositoryType } from '@/types'
import { GIT_CLIENT_PREFIXES, formatDistanceToNow, perMonth } from '@/utils'

export default {
  async asyncData({ app, route }) {
    const { data } = await app.http.get(`/projects/${route.params.name}`)
    return data
  },
  created() {
    this.GIT_CLIENT_PREFIXES = GIT_CLIENT_PREFIXES
    this.RepositoryType = RepositoryType
  },
  methods: {
    perMonth,
    formatDistanceToNow,
  },
}
</script>
