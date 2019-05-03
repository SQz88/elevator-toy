<template lang="pug">
  .floor-controls
    .floor-number
      floor-number(:floorNo="floorNo")
    .floor-buttons(:id="floorNo")
      button.up(@click="buttonClick")
        | &uarr;
      br
      button.down(@click="buttonClick")
        | &darr;
</template>

<script>
import { EventBus } from "../eventBus";
import floorNumber from "./floorNumber.vue";
export default {
  components: { floorNumber },
  data() {
    return { floorNo: this.$vnode.key };
  },
  methods: {
    buttonClick(e) {
      let floor = e.target.parentElement.id;
      let dir = e.target.className;
      EventBus.$emit("button", [floor, dir]);
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
