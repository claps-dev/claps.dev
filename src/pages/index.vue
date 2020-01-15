<template>
  <v-container>
    <div class="headline title">👏 Claps.dev</div>
    <p>
      We help you funding the creators and projects you appreciate with crypto
      currencies.
    </p>
    <v-card>
      <v-card-text>
        <div class="subtitle-2 font-weight-bold">for Users</div>
        <p>
          People who contribute to opensource projects need you to support their
          work. Both do the initial work and to maintain it take time and cost
          money.
        </p>
        <p style="margin-bottom:0">
          <strong>Claps.dev</strong>
          's donations system is designed to provide a great way to fund basic
          income to creators and team, enabling them to keep doing great work
          that benefits everyone. Ready to contribute? Then let's get started:
        </p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <n-link is="v-btn" to="projects" rounded block color="primary">
          Getting Started
        </n-link>
      </v-card-actions>
    </v-card>
    <v-card style="margin-top:25px">
      <v-card-text>
        <div class="subtitle-2 font-weight-bold">for Creators</div>
        <p>
          Are you a developer of open source projects?
        </p>
        <p style="margin-bottom:0">
          Yes? Then
          <strong>Clasps.dev</strong>
          is for you! Create your account and ask your supporters to financially
          support your work.
        </p>
      </v-card-text>
      <v-card-actions class="justify-center">
        <n-link
          is="v-btn"
          v-if="user"
          to="profile"
          rounded
          block
          color="primary"
        >
          View My Profile
        </n-link>
        <a
          is="v-btn"
          v-else
          :href="githubOauthUrl"
          rounded
          block
          color="primary"
        >
          Sign in with Github
        </a>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { mapState } from 'vuex'

import { GITHUB_OAUTH_URL, normalizeUrl } from '@/utils'

export default {
  computed: {
    ...mapState(['envs', 'user', 'randomUid']),
    githubOauthUrl() {
      return normalizeUrl(GITHUB_OAUTH_URL, {
        client_id: this.envs.GITHUB_CLIENT_ID,
        state: this.randomUid,
        redirect_uri: `${this.envs.GITHUB_OAUTH_CALLBACK}?path=/profile`,
      })
    },
  },
}
</script>
