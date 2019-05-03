<template lang="pug">
  .car.car-anim(:id="`car-${carId}`")
    | {{currentFloor}}
</template>

<script>
export default {
  props: ["carId", "currentFloor", "currentPx"]
};
</script>

<style>
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
  transition-duration: 5s; /*variable!*/
  transition-timing-function: ease-in-out;
}
</style>
