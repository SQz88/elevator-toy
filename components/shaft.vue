<template lang="pug">
// .shaft-header
//   | {{shaftId}}
.shaft( @click='clicked')
    // car(:carId='shaftId' :style='carStyle' :currentFloor="movingFloor"  :ref="`car-${shaftId}`")
    .car.car-anim(:id="`car-${shaftId}`" :ref="`car-${shaftId}`" :style='carStyle')
      | {{marginToFloor.toFixed(2)}}
</template>
<script>
// import car from "./car.vue";
export default {
  // components: { car },
  props: ["shaftId", "totalFloors"],
  computed: {
    floorToMargin() {
      let total = 50 * (this.totalFloors - 1);
      let current = 50 * (this.totalFloors - this.currentFloor);
      return `${current}px`;
    },
    marginToFloor() {
      let currentPx = this.movingFloor;
      let currentFl = this.totalFloors - currentPx / 50;
      return currentFl;
    },
    carStyle() {
      return { "margin-top": this.floorToMargin };
    },
    movingFloor() {
      this.currentTime;
      if (this._isMounted) {
        // console.log(this.carStyleObj.marginTop);
        return this.carStyleObj.marginTop.slice(0, -2);
      } else {
        return "550";
      }
    }
  },
  watch: {
    isMoving(newval, old) {
      if (newval === true && old === false) {
        var self = this;
        var interv = setInterval(function() {
          // console.log(self.shaftId);
          self.currentTime = Date.now();
          if (self.movingFloor == self.floorToMargin.slice(0, -2)) {
            self.isMoving = false;
            self.movingDirection = 0;
            clearInterval(interv);
          }
        }, 100);
      }
    }
  },
  data() {
    return {
      currentFloor: 0,
      isMoving: false,
      movingDirection: 0,
      carStyleObj: false,
      currentTime: 0
    };
  },
  methods: {
    clicked() {
      // console.log(this.carStyleObj.marginTop);
      this.moveCar(Math.floor(Math.random() * (this.totalFloors + 1)));
      console.log(`going to ${this.currentFloor}`);
    },
    moveCar(toFloor) {
      //check whether the floor is not out of bounds TO DO
      if (toFloor <= this.totalFloors) {
        //css anim attempt
        this.$refs[
          `car-${this.shaftId}`
        ].style.transitionDuration = this.distanceToDuration(toFloor);
        this.isMoving = true;
        this.currentFloor = toFloor;
        this.determineDirection(this.marginToFloor);
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
    // this.$set(
    //   this.carStyleObj,
    //   this.shaftId,
    //   getComputedStyle(this.$refs[`car-${this.shaftId}`])
    // );
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
  border: 1px solid gainsboro;
  border-radius: 10px;
  line-height: 38px;
}
.car-anim {
  transition-property: margin-top;
  // transition-duration: 3s; /*variable!*/
  transition-timing-function: ease-in-out;
}
</style>
