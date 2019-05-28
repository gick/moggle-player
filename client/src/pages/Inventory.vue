<template>
  <v-ons-page @show="$store.commit('users/resetInventoryBadge')">
    <custom-toolbar title="Inventory" backLabel></custom-toolbar>
    <v-ons-card v-for="(item,index) in inventoryItems" v-bind:key="index">
      <Inventory :item="item"></Inventory>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import Inventory from '../components/InventoryItem.vue'
export default {
  data() {
    return {
    };
  },
  components:{Inventory},
  computed: {
    inventoryItems(){
    return this.$store.state.users.inventoryItems
  }},
  mounted() {
  },
  methods: {
}}
</script>

<style>
</style>
