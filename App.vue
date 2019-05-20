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
      shafts: ["A"], //, "B", "C", "D", "F", "G"],
      upQueue: new fpQueue((a, b) => {
        return a < b;
      }),
      downQueue: new fpQueue((a, b) => {
        return a > b;
      })
    };
  },
  methods: {
    findBestShaft({ floor, dir }) {
      let shafts = [];
      let all = this.$store.getters.getAllShafts;
      for (let key in all) {
        shafts.push(Object.assign(all[key], { id: key }));
      }
      let direct = shafts.filter(x => x.to == floor && x.dir == dir);
      if (direct.length > 0) {
        // console.log("direct route");
        // console.log(direct[0]);
        return direct[0].id;
      }
      let standingShafts = shafts.filter(x => x.dir == 0);
      let movingShafts = shafts
        .filter(x => x.dir == dir)
        .filter(x => Math.sign(x.floor - floor) != Math.sign(dir));
      shafts = standingShafts.concat(movingShafts);
      shafts.forEach(thisShaft => {
        thisShaft.distance = Math.abs(thisShaft.floor - floor);
      });
      shafts.sort((a, b) => a.distance - b.distance);

      // console.log(shafts[0]);
      if (shafts[0] === undefined) return null;
      return shafts[0].id;
    },
    dispatchShaft(id, floor, dir) {
      console.log(`Dispatch ${id} to floor ${floor} in DIR ${dir}`);
      EventBus.$emit("go", { id, floor, dir });
    }
  },
  beforeDestroy() {
    EventBus.$off();
  },
  created() {
    EventBus.$on("button", ({ floor, dir }) => {
      if (dir == 1) {
        this.upQueue.add({ floor, dir });
      } else if (dir == -1) {
        this.downQueue.add({ floor, dir });
      }
    });
  },
  mounted() {
    this.$store.commit("initShafts", this.shafts);
    var self = this;
    setInterval(() => {
      // TODO refactor this shit to be D R Y
      while (!self.upQueue.isEmpty()) {
        if (self.findBestShaft(self.upQueue.peek()) !== null) {
          let { floor, dir } = self.upQueue.poll();
          self.dispatchShaft(self.findBestShaft({ floor, dir }), floor, dir);
        } else {
          // console.log("No shaft candidate for dir UP", self.upQueue.peek());
          break;
        }
      }
      while (!self.downQueue.isEmpty()) {
        if (self.findBestShaft(self.downQueue.peek()) !== null) {
          let { floor, dir } = self.downQueue.poll();
          self.dispatchShaft(self.findBestShaft({ floor, dir }), floor, dir);
        } else {
          // console.log("No shaft candidate for dir DOWN", self.downQueue.peek());
          break;
        }
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
