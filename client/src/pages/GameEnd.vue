<template>
  <v-ons-page>
      Game end
      <v-ons-button @click="next">Suivant</v-ons-button>
  </v-ons-page>
</template>

<script>

export default {
  data () {
    return {
        id:''
    };
  },
  computed:{
  },

  methods: {
      next(){
          this.$store.commit('activities/endGame')
          this.$store.commit('navigator/pop')
      }
  }
};
</script>

<style>
.intro {
  text-align: left;
  padding: 0 22px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, .54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title, .card--material__title {
  font-size: 20px;
}
</style>
