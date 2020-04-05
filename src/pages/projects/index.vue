<template>
  <v-container>
    <c-back-title>Explore</c-back-title>
    <v-text-field
      v-model="keyword"
      clearable
      outlined
      rounded
      single-line
      placeholder="type to search"
      :class="$style.search"
    ></v-text-field>
    <n-link
      is="v-card"
      v-for="item of items"
      :key="item.id"
      :to="`projects/${item.name}`"
      class="mt-4"
    >
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-4 mr-0" color="grey" size="48">
          <v-img :src="item.avatarUrl" />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title class="subtitle-2">{{ item.name }}</v-card-title>
          <v-card-subtitle class="caption">
            {{ item.description }}
          </v-card-subtitle>
        </div>
      </div>
      <v-divider class="ml-4 mr-4" />
      <v-card-actions class="d-flex justify-space-between px-4 py-3 body-2">
        <div>
          <strong class="primary--text">
            ${{ $utils.perMonth(item.total, item.createdAt) }}
          </strong>
          / Mon
        </div>
        <div>
          <strong class="primary--text">{{ item.patrons }}</strong>
          Patrons
        </div>
      </v-card-actions>
    </n-link>
  </v-container>
</template>
<script lang="ts">
import { throttle } from 'lodash'

export default {
  async asyncData({ app }) {
    const { data } = await app.http.get('/projects', {
      params: app.router.currentRoute.query,
    })
    app.store.commit('SET_PROJECTS', data)
    return data
  },
  data() {
    return {
      keyword: this.$route.query.keyword,
    }
  },
  watch: {
    keyword: throttle(async function (keyword: string) {
      this.$router.replace(
        this.$utils.normalizeUrl(this.$route.path, {
          keyword,
        }),
      )
      const { data } = await this.$http.get('/projects', {
        params: {
          ...this.$route.query,
          keyword,
        },
      })

      Object.assign(this, data)
    }, 500),
  },
}
</script>
<style lang="scss" module>
.search :global {
  .v-text-field__details {
    display: none;
  }

  .v-input {
    &__slot {
      margin-bottom: 0;
    }

    &__control input {
      text-align: center;
    }

    &__append-inner {
      margin-top: 4px;
    }
  }
}
</style>
