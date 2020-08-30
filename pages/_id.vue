<template>
  <div class="container">
    id:{{ $route.path }}
    <img :src="imgSrc" />
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    return { imgSrc: "images/" + params.id + "/01.png" };
  },
  // data: () => {
  //   return {
  //     imgSrc: $nuxt.$route.path + ".png"
  //   };
  // }
};
</script>
