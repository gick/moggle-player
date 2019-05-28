<template>
  <v-ons-card>
    <div class="title">{{mcq.question}}</div>
    <div class="content">
      <v-ons-list>
        <v-ons-list-item  modifier="nodivider"  v-for="(response, $index) in responses" :key="$index" tappable>
          <label class="left">
            <v-ons-radio
              modifier="material"
              :input-id="'radio-' + $index"
              :value="response"
              v-model="currentResponse"
            ></v-ons-radio>
          </label>
          <label :for="'radio-' + $index" class="center" v-if="!mcq.imageMode">{{ response }}</label>
          <ImagePreview :image-id="response" v-if="mcq.imageMode"></ImagePreview>
        </v-ons-list-item >
        <v-ons-list-item  modifier="nodivider">
          <div class="center">
            <v-ons-button :disabled="!currentResponse.length || showSuccess || showFail" @click="validate">Valider</v-ons-button>
          </div>

        </v-ons-list-item>
        <v-ons-list-item  v-show="showSuccess || showFail" modifier="nodivider">
          <div v-if="showSuccess" class="center">{{mcq.correctMessage}}</div>
          <div v-if="showFail" class="center">{{mcq.wrongMessage}}</div>
        </v-ons-list-item>
      </v-ons-list>
    </div>
  </v-ons-card>
</template>

<script>
import ImagePreview from "./ImagePreview.vue";
export default {
  data() {
    return {
      currentResponse: "",
      showSuccess: false,
      showFail: false
    };
  },
  components: {
    ImagePreview
  },
  props: {
    mcq: Object
  },
  computed: {
    responses() {
      let responseArray = [this.mcq.response];
      Array.prototype.push.apply(
        responseArray,
        this.mcq.distractors.map(val => val.value)
      );
      return this.shuffle(responseArray);
    }
  },

  methods: {
    validate() {
      if (this.currentResponse == this.mcq.response) {
        this.$toasted.show('Vous avez gagner '+this.mcq.score+' points',{ duration: 2000 } )
        this.$store.commit('activities/addScore',this.mcq.score)
        this.showSuccess = true;
      } else {
        this.showFail = true;
      }
    },
    shuffle(array) {
      var currentIndex = array.length,
        temporaryValue,
        randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
  }
};
</script>

<style>
ons-card {
  cursor: pointer;
  color: #333;
}

.card__title,
.card--material__title {
  font-size: 20px;
}
</style>
