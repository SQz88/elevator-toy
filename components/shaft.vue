<template lang="pug">
.shaft( @click='clicked')
    .car.car-anim(:id="`car-${shaftId}`" :ref="`car-${shaftId}`" :style='carStyle')
      | {{shaftId}}{{dirArrow}} {{Math.ceil(marginToFloor)}}
</template>
<script>
import { EventBus } from "../eventBus";

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
    carStyle() {
      let styleObj = { "margin-top": this.floorToMargin };
      if (this.isMoving === true) {
        Object.assign(styleObj, {
          "border-color": "darkred",
          "transition-timing-function": "ease-out"
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
      } else return "";
    }
  },
  watch: {
    isMoving(newval, old) {
      var self = this;
      if (newval === true && old === false) {
        var interv = setInterval(function() {
          // console.log(self.shaftId);
          self.currentTime = Date.now();
          if (self.currentMargin == self.floorToMargin.slice(0, -2)) {
            self.isMoving = false;
            self.openDoor = true;
            EventBus.$emit("floor", {
              floor: self.currentFloor,
              dir: self.movingDirection == 1 ? "up" : "down"
            });
            clearInterval(interv);
          }
        }, 100);
      } else {
        setTimeout(() => {
          self.openDoor = false;
          self.floorQueue.shift();
          if (self.floorQueue.length > 0) {
            self.moveCar();
          } else {
            EventBus.$emit("floor", {
              floor: self.currentFloor,
              dir: self.movingDirection == 1 ? "down" : "up"
            });
            self.movingDirection = 0;
          }
        }, 3500);
      }
    }
  },
  methods: {
    clicked() {
      // console.log(this.carStyleObj.marginTop);
      this.enqueueFloor(Math.floor(Math.random() * (this.totalFloors + 1)));
    },
    enqueueFloor(goto) {
      this.floorQueue.push(goto);
      console.log(`Shaft ${this.shaftId} # ${goto} floor added to the queue`);
      if (this.floorQueue.length == 1) {
        this.moveCar();
      }
    },
    moveCar() {
      let toFloor = this.floorQueue[0];
      if (toFloor <= this.totalFloors) {
        console.log(`Shaft ${this.shaftId} going to ${toFloor}`);
        //css anim attempt
        this.$refs[
          `car-${this.shaftId}`
        ].style.transitionDuration = this.distanceToDuration(toFloor);
        this.currentFloor = toFloor;
        this.determineDirection(this.marginToFloor);
        this.isMoving = true;
      }
      // js anim old attempt
      /*let mv = setInterval(() => {
        if (Math.abs(this.currentFloor - toFloor) <= 0.11) {
          this.currentFloor = toFloor;
          clearInterval(mv);
        } else if (toFloor > this.currentFloor) {
          this.currentFloor += 0.05;
        } else if (toFloor < this.currentFloor) {
          this.currentFloor -= 0.05;
        }
      }, 16);*/
    },
    distanceToDuration(toFloor) {
      let distance = Math.abs(toFloor - this.marginToFloor) * 1.5;
      // console.log(`distance # ${distance}`);
      return `${distance}s`;
      // return `transition-duration: ${distance}s`;
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
  line-height: 38px;
}
.car-anim {
  transition-property: margin-top;
  transition-timing-function: ease-in-out;
}
</style>
