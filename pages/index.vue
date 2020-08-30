<template>
  <div class="container">
    <button v-on:click="fetch">キャプション</button>
    <form action="api/caps" method="post">
      <input type="url" name="urldata01" id />
      <input type="url" name="urldata02" id />
      <input type="submit" name="submit_name" value="送るよ!" />
    </form>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data: () => ({
    item: [],
  }),
  methods: {
    fetch() {
      const response = this.$axios
        .$post("api/caps")
        .then((response) => {
          console.log("response data", response);
        })
        .catch((error) => {
          console.log("response error", error);
        });
    },
  },
  // async asyncData({ $axios }) {
  //   // 取得先のURL
  //   const url = "api/caps";
  //   // リクエスト（Get）
  //   const response = await $axios.$post(url);
  //   // 配列で返ってくるのでJSONにして返却
  //   return {
  //     posts: response
  //   };
  // }
};
</script>
