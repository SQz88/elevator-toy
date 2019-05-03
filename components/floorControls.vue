<template>
  <div class="floor-controls">
    <div class="floor-number">
      <floorNumber :floorNo="floorNo"/>
    </div>
    <div class="floor-buttons" :id="floorNo">
      <button class="up-button" @click="buttonClick">&uarr;</button>
      <br>
      <button class="down-button">&darr;</button>
    </div>
  </div>
</template>

<script>
import floorNumber from "./floorNumber.vue";
export default {
  components: { floorNumber },
  data() {
    return { floorNo: this.$vnode.key };
  },
  methods: {
    buttonClick(e) {
      console.log(e.target.parentElement);
    }
  }
};
</script>

<style>
.floor-controls {
  grid-column: controls;
  justify-content: space-between;
  align-items: center;
  display: flex;
  background-color: rgb(255, 248, 152);
}
.floor-controls button {
  color: azure;
  background-color: darkslategray;
  border: none;
  padding: 0.2em !important;
  font: inherit;
  width: 100%;
}
</style>
