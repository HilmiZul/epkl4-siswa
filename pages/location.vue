<template>
  <div>
    <button @click="getMyLoc">Get My Loc.</button>
    <ul>
      <li>lat: {{ lat }}</li>
      <li>long: {{ lon }}</li>
      <li>accuracy: {{ accuracy }}</li>
    </ul>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'public'
})

let lat = ref("")
let lon = ref("")
let accuracy = ref("")

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;
  lat.value = crd.latitude
  lon.value = crd.longitude
  accuracy.value = crd.accuracy

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function getMyLoc() {
  navigator.geolocation.getCurrentPosition(success, error, options);
}

</script>
