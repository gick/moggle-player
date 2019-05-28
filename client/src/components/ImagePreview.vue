<template>
<div>
  <img class="small" @click="modalVisible=true" :src="'http://localhost:8080/file/'+imageId">
  <v-ons-modal :visible="modalVisible" @click="modalVisible=false">
      <img :src="'http://localhost:8080/file/'+imageId" style="width:100%">
  </v-ons-modal>
</div>
</template>

<script>
export default {
  data() {
      return {
          modalVisible:false
      }
  },
  computed: {},
  props: {
    imageId: String
  },
  methods: {
    next() {
      this.$store.dispatch("activities/nextPage");
    }
  }
};
</script>

<style>
.small {
  width: 50px;
  height: 50px;
  cursor: pointer;
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
    0 2px 4px -1px rgba(0, 0, 0, 0.4);
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
