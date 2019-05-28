<template>
    <p style="text-align:center">
      {{item.itemText}}
      <vue-simple-markdown :source="item.media.mkdown"></vue-simple-markdown>
    </p>
</template>

<script>
export default {
  data() {
      return {}
  },
  props:["item"]

};
</script>

<style scoped>
div {

}
</style>
