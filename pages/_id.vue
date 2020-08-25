<template>
  <div class="container">
    id:{{ $route.path }}
    <img :src="imgSrc" />
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    console.log(params);
    return { imgSrc: "images/" + params.id + ".png" };
  }
  // data: () => {
  //   return {
  //     imgSrc: $nuxt.$route.path + ".png"
  //   };
  // }
};
</script>
