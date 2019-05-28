<template>
  <v-ons-card>
    <div class="title">{{freetext.question}}</div>
    <div class="content">
      <v-ons-input 
      :placeholder="freetext.responseLabel"
      v-model="response"
      modifier="underbar"
      ></v-ons-input>
      <vue-simple-markdown v-if="showClue" :source="freetext.media.mkdown"></vue-simple-markdown>
      <v-ons-list v-if="freetext.media">
        <ons-list-item>
          <label class="center" for="switch1">Indice</label>
          <div class="right">
            <v-ons-switch input-id="switch1" v-model="showClue"></v-ons-switch>
          </div>
        </ons-list-item>
      </v-ons-list>
          <p style="text-align:center;">

      <v-ons-button :disabled="correct||incorrect" class="center" @click="validate">Valider</v-ons-button>
          </p>
      <p v-if="correct"><v-ons-icon icon="fa-check-circle"></v-ons-icon> {{freetext.correctMessage}}</p>
      <p v-if="incorrect"><v-ons-icon icon="fa-times-circle"></v-ons-icon> {{freetext.wrongMessage}}</p>

    </div>
  </v-ons-card>
</template>

<script>
export default {
  data() {
    return {
        showClue:false,
        response:'',
        correct:false,
        incorrect:false
    };
  },
  computed: {},
  props: {
    freetext:Object
  },
  methods: {
    validate() {
        if(this.response.toLowerCase()==this.freetext.response.toLowerCase()){
            this.correct=true
            this.$toasted.show('Vous avez gagner '+this.freetext.score+' points',{ duration:2000,position:'bottom-center',theme:'bubble' } )
            this.$store.commit('activities/addScore',this.freetext.score)
        } 
        else{
            this.incorrect=true
        }
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
