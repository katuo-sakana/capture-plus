<template>
  <div class="container">
    <div class="container__contents"></div>
    <div class="container__images">
      <img :src="imgSrc" />
    </div>
    <!-- id:{{ $route.path }} -->
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    return { imgSrc: "images/" + params.id + "/00.png" };
  },
  // data: () => {
  //   return {
  //     imgSrc: $nuxt.$route.path + ".png"
  //   };
  // }
};
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
.container {
  display: flex;
}
.container__contents {
  width: 30%;
}
.container__images {
  width: 70%;
  padding-left: 5%;
  padding-right: 5%;
}
</style>