<template lang="pug">
    div.shaft-container
        .floor-controls-wrapper
            floorControls(v-for="floor in floors+1" :key="floor-1")
        .shaft-flexbox
            shaft(:shaftId="shaft" :totalFloors="floors" v-for="shaft in shafts")
</template>

<script>
import { EventBus } from "./eventBus";

import shaft from "./components/shaft.vue";
import floorControls from "./components/floorControls.vue";

export default {
  components: { shaft, floorControls },
  name: "elevator",
  data() {
    return {
      floors: 11,
      shafts: ["A", "B", "C", "G"]
    };
  },
  beforeDestroy() {
    EventBus.$off();
  }
};

EventBus.$on("button", e => {
  console.log(e);
});
</script>
<style>
.shaft-container {
  width: 130px;
  margin: auto;
  display: grid;
  justify-content: right;
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
