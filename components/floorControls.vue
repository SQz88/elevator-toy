<template lang="pug">
  .floor-controls
    .floor-number
      floor-number(:floorNo="floorNo")
    .floor-buttons(:id="floorNo")
      button.up(@click="buttonClick" v-if="floorNo != totalFloors" ref="up")
        | &uarr;
      br
      button.down(@click="buttonClick" v-if="floorNo != 0" ref="down")
        | &darr;
</template>

<script>
import { EventBus } from "../eventBus";
import floorNumber from "./floorNumber.vue";
export default {
  components: { floorNumber },
  props: ["totalFloors"],
  data() {
    return { floorNo: this.$vnode.key };
  },
  methods: {
    buttonClick(e) {
      let floor = e.target.parentElement.id;
      let dir = e.target.className;
      this.$refs[dir].disabled = true;
      EventBus.$emit("button", { floor, dir });
    }
  },
  mounted() {
    EventBus.$on("floor", payload => {
      let { floor, dir } = payload;
      if (floor == this.floorNo) {
        this.$refs[dir].disabled = false;
      }
    });
  },
  beforeDestroy() {
    EventBus.$off();
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
.floor-controls button:disabled {
  background-color: brown;
}
</style>
