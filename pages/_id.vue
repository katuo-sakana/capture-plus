<template>
  <div class="container">
    <div class="container__contents" id="js-mark">{{name}}</div>
    <div class="container__images" id="js-targe" v-on:click="updateMessage">
      <img :src="imgSrc" />
      <div class="click-btn" v-bind:style="{ top: positionY + 'px', left: positionX + 'px' }">0</div>
    </div>
    <!-- id:{{ $route.path }} -->
  </div>
</template>

<script>
export default {
  asyncData({ params }) {
    return { imgSrc: "images/" + params.id + "/00.png" };
  },
  data() {
    return {
      name: "北山本駅", // data ...（4）
      positionX: 0,
      positionY: 0,
    };
  },
  methods: {
    updateMessage: function (e) {
      let offsetX = e.offsetX; // =>要素左上からのx座標
      let offsetY = e.offsetY; // =>要素左上からのy座標
      // let pageX = e.pageX; // =>ウィンドウ左上からのx座標
      // let pageY = e.pageY; // =>ウィンドウ左上からのy座標
      // let clientX = e.clientX; // =>ページ左上からのx座標
      // let clientY = e.clientY; // =>ページ左上からのy座標
      this.positionX = offsetX;
      this.positionY = offsetY;
      this.name = `要素左上からのx座標:${offsetX} 要素左上からのy座標:${offsetY}`;
    },
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
  /* padding-left: 5%;
  padding-right: 5%; */
  position: relative;
}
.click-btn {
  position: absolute;
  top: 0;
  left: 0;
  width: 2em;
  height: 2em;
  border-radius: 50%;
  background-color: blue;
  color: #fff;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.2em;
  border: 2px solid #fff;
  box-shadow: 2px 2px 2px #333;
}
</style>