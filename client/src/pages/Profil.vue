<template>
  <v-ons-page @show='resetBadges'>
      <div class="content">
    <v-ons-card v-for="(badge,index) in badges" v-bind:key="index+'badges'">
        <GameBadge :item="badge"></GameBadge>
    </v-ons-card>
    </div>
  </v-ons-page>
</template>

<script>
import GameBadge from '../components/GameBadge.vue'
export default {
  data() {
    return {
    };
  },
  components:{GameBadge},
  computed: {
      badges(){
          return this.$store.state.users.allBadges.concat(this.$store.state.users.sessionBadges)
      }
  },

  methods: {
    resetBadges(){
      this.$store.commit('users/resetProfilBadge')
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
  color: rgba(0, 0, 0, 0.54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
