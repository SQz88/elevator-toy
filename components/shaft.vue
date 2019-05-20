<template lang="pug">
.shaft
    .car(:id="`car-${shaftId}`" :ref="`car-${shaftId}`" :style='carStyle' @click="clicked")
      | {{shaftId}}{{dirArrow}} {{Math.ceil(marginToFloor)}}
      .queue {{floorQueue}}
</template>
<script>
import { EventBus } from "../eventBus";
const fpQueue = require("fastpriorityqueue");

export default {
  props: ["shaftId", "totalFloors"],
  data() {
    return {
      floorQueue: [],
      currentFloor: 0,
      isMoving: false,
      movingDirection: 0,
      carStyleObj: false,
      openDoor: false,
      currentTime: 0
    };
  },
  computed: {
    floorToMargin() {
      let total = 50 * (this.totalFloors - 1);
      let target = 50 * (this.totalFloors - this.currentFloor);
      return `${target}px`;
    },
    marginToFloor() {
      let currentPx = this.currentMargin;
      let currentFl = this.totalFloors - currentPx / 50;
      return currentFl;
    },
    halfFloor() {
      return Math.round(this.marginToFloor * 4) / 4;
    },
    carStyle() {
      let styleObj = { "margin-top": this.floorToMargin };
      if (this.isMoving) {
        Object.assign(styleObj, {
          "border-color": "darkred"
        });
      }
      if (this.openDoor) {
        Object.assign(styleObj, {
          "border-color": "yellow",
          "background-color": "red"
        });
      }
      return styleObj;
    },
    currentMargin() {
      this.currentTime;
      if (this._isMounted) {
        return this.carStyleObj.marginTop.slice(0, -2);
      } else {
        return this.totalFloors * 50;
      }
    },
    dirArrow() {
      if (this.movingDirection != 0) {
        return this.movingDirection == 1 ? "↑" : "↓";
      } else return this.movingDirection;
    }
  },
  watch: {
    floorQueue(_new, old) {
      console.warn(old, _new);
    },
    isMoving(_new, _old) {
      var self = this;
      if (_new === true && _old === false) {
        var interv = setInterval(function() {
          // console.log(self.shaftId);
          self.currentTime = Date.now();
          if (self.currentMargin == self.floorToMargin.slice(0, -2)) {
            self.isMoving = false;
            self.openDoor = true;
            self.arriveAtFloor(self.currentFloor, self.movingDirection);
            clearInterval(interv);
          }
        }, 100);
      } else if (_new === false && _old === true) {
        setTimeout(() => {
          self.openDoor = false;
          self.floorQueue.shift();
          if (self.floorQueue.length > 0) {
            self.moveCar();
          } else {
            self.arriveAtFloor(self.currentFloor, -self.movingDirection);
            self.movingDirection = 0;
            self.reportState();
          }
        }, 3500);
      }
    },
    movingDirection(_new, _old) {
      if (_new !== 0 && _old !== 0) {
        this.arriveAtFloor(this.halfFloor, _new);
        this.reportState();
      }
    },
    halfFloor() {
      this.reportState();
    }
  },
  methods: {
    clicked() {
      this.enqueueFloor(Math.floor(Math.random() * (this.totalFloors + 1)));
    },
    enqueueFloor(floor, dir) {
      if (this.movingDirection == 0) {
        this.floorQueue.push(floor);
        this.movingDirection = dir;
      } else if (dir == this.movingDirection) {
        this.floorQueue.unshift(floor);
        this.floorQueue.sort((a, b) =>
          this.movingDirection == 1 ? a > b : a < b
        );
      } else {
        console.error(
          this.shaftId,
          "received a wrong type of direction to the shaft queue"
        );
        return false;
      }
      console.log(`Shaft ${this.shaftId} # ${floor} floor added to the queue.`); // console.table(this.floorQueue);
      this.moveCar();
    },
    moveCar() {
      let toFloor = this.floorQueue[0];
      if (toFloor <= this.totalFloors) {
        console.log(`Shaft ${this.shaftId} going to ${toFloor}.`); // console.table(this.floorQueue);
        //css anim attempt
        this.$refs[
          `car-${this.shaftId}`
        ].style.transition = this.distanceToDuration(toFloor);
        this.currentFloor = toFloor;
        // this.determineDirection(this.marginToFloor);
        this.isMoving = true;
      }
    },
    reportState() {
      let stateObj = {
        id: this.shaftId,
        floor: this.halfFloor,
        to: this.currentFloor,
        dir: this.movingDirection
      };
      this.$store.commit("shaftState", stateObj);
    },
    arriveAtFloor(floor, dir) {
      EventBus.$emit("floor", {
        floor,
        dir
      });
    },
    distanceToDuration(toFloor) {
      let distance = Math.abs(toFloor - this.marginToFloor) * 1.5;
      return `margin-top ${distance}s ease-in-out`;
    },
    determineDirection(fromFloor) {
      if (this.currentFloor < fromFloor) {
        this.movingDirection = -1;
      } else if (this.currentFloor > fromFloor) {
        this.movingDirection = 1;
      } else {
        this.movingDirection = 0;
      }
    }
  },
  mounted() {
    this.carStyleObj = getComputedStyle(this.$refs[`car-${this.shaftId}`]);
    EventBus.$on("go", ({ id, floor, dir }) => {
      if (id == this.shaftId) {
        this.enqueueFloor(floor, dir);
      }
    });
  },
  beforeDestroy() {
    EventBus.$off();
  }
};
</script>

<style lang="scss">
.shaft {
  width: 60px;
  height: 100%;
  grid-column: shaft;
  background-size: 50px 50px;
  background-image: linear-gradient(
    to bottom,
    transparent 49px,
    black 50px,
    transparent 51px
  );
  display: flex;
  flex-direction: column;
  margin-right: 2px;
}
.car {
  background-color: gray;
  color: whitesmoke;
  text-align: center;
  padding: 5px;
  box-sizing: border-box;
  font-weight: 1000;
  height: 49px;
  width: 100%;
  border: 1px solid limegreen;
  border-radius: 10px;
  // line-height: 38px;
  user-select: none;
}
.car-anim {
  transition-property: margin-top;
  transition-timing-function: ease-in-out;
}
.queue {
  font-size: 70%;
  font-weight: normal;
  white-space: nowrap;
  // color: black;
}
</style>
