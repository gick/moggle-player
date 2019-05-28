<template>
  <v-ons-page>

      <div v-for="(question,index) in mcq" :key="index">
      <MCQ :mcq="question"></MCQ>
      </div>
      <div v-for="(question,index2) in freetext" :key="index2">
      <Freetext :freetext="question"></Freetext>
      </div>
      <p style="text-align:center;margin-top:20px; ">
        <v-ons-button @click="next">Suivant</v-ons-button>
      </p>
  </v-ons-page>
</template>

<script>
import MCQ from '../components/MCQ.vue'
import Freetext from '../components/Freetext.vue'
export default {
  data () {
    return {
            inventoryItem:{},
    };
  },
  props:['mcq','freetext']
  ,
  computed:{
  },
  components:{
    MCQ,
    Freetext
  },
  methods: {
      next(){
          this.$store.dispatch('activities/nextPage')
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
