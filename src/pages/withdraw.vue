<template>
  <v-container>
    <c-back-title>Withdraw BTC</c-back-title>
    <v-card>
      <v-card-text>
        <c-coin-select />
        <v-text-field
          hint="≈$0.67"
          persistent-hint
          suffix="BTC"
          type="number"
          value="0.0001"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn block color="primary" rounded>Send</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
