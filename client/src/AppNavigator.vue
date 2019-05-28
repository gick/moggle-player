<template>
  <v-ons-navigator
    swipeable
    swipe-target-width="50px"
    :page-stack="pageStack"
    :pop-page="storePop"
    :options="options"
    :class="{ 'border-radius': borderRadius }"
  ></v-ons-navigator>
</template>

<script>
import AppSplitter from "./AppSplitter.vue";
import GameToolBar from "./partials/GameToolbar.vue";
import axios from "axios";
export default {
  beforeCreate() {

    this.$store.commit("navigator/push", AppSplitter);
  },
  data() {
    return {
      activity:false
    };
  },
  watch: {
    startActivity: function(activity) {
      if (activity) {
        this.activity=true
        let pageIndex = this.$store.state.activities.currentPage;
        let currentPage = this.$store.state.activities.pages[pageIndex];
        this.$store.commit("navigator/push", {
          extends: GameToolBar,
          data() {
            return {};
          }
        });
      }
    },
    sessionBadges:function(badges){
      let lastBadge=badges[badges.length -1]
      this.showBadgeToast(lastBadge)
    }
  },
  computed: {
    sessionBadges(){
      return this.$store.state.users.sessionBadges;
    },
    allBadges(){
      return this.$store.state.users.allBadges
    },
    startActivity() {
      return this.$store.state.activities.startActivity;
    },
    pageStack() {
      return this.$store.state.navigator.stack;
    },
    options() {
      return this.$store.state.navigator.options;
    },
    borderRadius() {
      return new URL(window.location).searchParams.get("borderradius") !== null;
    }
  },
  methods: {
    showBadgeToast(badge){
        let isNew=this.allBadges.every(val=>val._id!=badge._id)
        if(isNew){
        this.$toasted.show('Vous avez gagné un badge en complétant ce jeux!',{ duration: 3000,position:'bottom-center',theme:'bubble' } )
        }
        else{
         this.$toasted.show('Vous possedez déjà le badge de ce jeu!',{ duration: 3000,position:'bottom-center',theme:'bubble' } )
        }
      
    },
    storePop() {
      this.$store.commit("navigator/pop");
    },
  }
};
</script>
