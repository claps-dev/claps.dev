<template>
  <v-container>
    <c-back-title>Project Name</c-back-title>
    <v-card>
      <div class="d-flex flex-no-wrap justify-space-between">
        <v-avatar class="ma-4 mr-0" color="grey" size="48">
          <v-img />
        </v-avatar>
        <div class="flex-grow-1">
          <v-card-title class="subtitle-2">Project Name A</v-card-title>
          <v-card-subtitle class="caption">
            PN is an operating system aiming to simplify as much as possible the
            administration of a server. This repository corresponds to the core
            code.
          </v-card-subtitle>
        </div>
      </div>
      <v-divider class="ml-4 mr-4" />
      <div class="body-2 pa-4">
        <div class="mb-4">
          Project Name receives
          <strong class="primary--text">$53.30</strong>
          per month from
          <strong class="primary--text">166</strong>
          patrons.
        </div>
        <div class="d-flex flex-no-wrap justify-space-between">
          <v-btn rounded color="primary" class="flex-grow-1 font-weight-bold">
            Donate
          </v-btn>
          <v-btn
            rounded
            outlined
            color="primary"
            class="flex-grow-1 ml-4 font-weight-bold border-2"
          >
            Details
          </v-btn>
        </div>
      </div>
      <v-divider class="ma-4 mt-0 mb-3" />
      <v-list subheader>
        <v-subheader class="black--text font-weight-bold">Members</v-subheader>
        <template v-for="item of 3">
          <v-list-item :key="item">
            <v-list-item-avatar size="32" color="grey" class="mr-3">
              <v-img></v-img>
            </v-list-item-avatar>
            <v-list-item-content class="pa-1">
              <v-list-item-title class="subtitle-2 mb-0">
                Charlie Wu
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                abc@123.com
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-list subheader>
        <v-subheader class="black--text font-weight-bold">
          Repositories
        </v-subheader>
        <template v-for="item of 2">
          <v-list-item :key="item">
            <v-list-item-content class="pa-1">
              <v-list-item-title class="subtitle-2 mb-0">
                <a>super.mixin.one</a>
                @ GitHub
              </v-list-item-title>
              <v-list-item-subtitle class="caption">
                412 stars, updated 2 weeks ago
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>
