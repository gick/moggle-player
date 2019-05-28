<template>
  <v-ons-page>
    <v-ons-card v-if="page.type=='staticmedia'">
      <vue-simple-markdown :source="page.mkdown"></vue-simple-markdown>
    </v-ons-card>
    <youtube v-if="page.type=='youtube'" :video-id="page.videoId" fit-parent ref="youtube"></youtube>
    <p style="text-align:center;">
      <v-ons-button @click="next">Suivant</v-ons-button>
    </p>
  </v-ons-page>
</template>

<script>
export default {
  data() {
    return {
      inventoryItem: {}
    };
  },
  props: ["page"],
  computed: {},

  methods: {
    next() {
      if(this.$refs.youtube)
        this.$refs.youtube.player.pauseVideo()
      this.$store.dispatch("activities/nextPage");
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
