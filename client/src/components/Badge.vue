<template>
<div v-if="value>0">{{value}}</div>
</template>

<script>
export default {
  data() {
      return {}
  },
  props:["value"]

};
</script>

<style scoped>
div {
       position: absolute;
    border-radius: 50%;
    background-color: red;
    color: white;
    width: 15px;
    top: 25px;
    height: 15px;
    right: 11px;
    line-height: 16px;
    text-align: center;
    font-size: 12px;
  
}
</style>
