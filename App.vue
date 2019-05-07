<template lang="pug">
    div.shaft-container
        .floor-controls-wrapper
            floorControls(v-for="floor in floors+1" :key="floor-1" :totalFloors="floors")
        .shaft-flexbox
            shaft(:shaftId="shaft" :totalFloors="floors" v-for="shaft in shafts")
</template>

<script>
import { EventBus } from "./eventBus";

import shaft from "./components/shaft.vue";
import floorControls from "./components/floorControls.vue";

const fpQueue = require("fastpriorityqueue");

export default {
  components: { shaft, floorControls },
  name: "elevator",
  data() {
    return {
      floors: 11,
      shafts: ["A", "B", "C", "D"], //, "F", "G"],
      upQueue: new fpQueue(),
      downQueue: new fpQueue((a, b) => {
        return a > b;
      })
    };
  },
  methods: {},
  beforeDestroy() {
    EventBus.$off();
  },
  created() {
    EventBus.$on("button", ({ floor, dir }) => {
      if (dir == "up") {
        this.upQueue.add(floor);
      } else if (dir == "down") {
        this.downQueue.add(floor);
      }
    });
  },
  mounted() {
    setInterval(() => {
      while (!this.upQueue.isEmpty()) {
        console.log(this.upQueue.poll());
      }
    }, 800);
  }
};
</script>
<style>
.shaft-container {
  width: auto;
  margin: auto;
  display: grid;
  justify-content: center;
  grid-template-columns: [controls] auto [shaft] auto [col-end];
  grid-template-rows: 1fr;
  grid-gap: 0.6em;
}
.floor-controls-wrapper {
  display: flex;
  flex-direction: column-reverse;
}
.shaft-flexbox {
  display: flex;
  flex-direction: row;
}
body {
  margin: 20px 0 20px 0;
  font-family: Arial, Helvetica, sans-serif;
}
</style>
