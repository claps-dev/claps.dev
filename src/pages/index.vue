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
        <router-link is="v-btn" to="list" rounded block color="primary">
          Getting Started
        </router-link>
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
        <v-btn rounded block color="primary">Sign in with Github</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
