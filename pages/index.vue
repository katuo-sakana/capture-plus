<template>
  <div>
    <div class="bg-green-500 p-3 text-white text-xl">
      Capture plus
    </div>
    <div class="container">
      <div class="max-w-screen-lg mx-auto py-3">
        <p class="mb-0">指定のURLを入力ください</p>
        <form class="top-form" action="api/caps" method="post">
          <div class="mt-3">
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="urldata01" id="">
          </div>
          <!-- <v-text-field
            type="url"
            name="urldata01"
            :rules="rules"
            hide-details="auto"
          ></v-text-field>
          <v-btn
            class="mt-5"
            type="submit"
            name="submit_name"
            depressed
            color="primary"
          >
            送信
          </v-btn> -->
          <button class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" name="submit_name" type="submit">送信</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data: () => ({
    rules: [
      (value) => !!value || "必須入力です",
      (value) => (value && value.length >= 3) || "Min 3 characters",
    ],
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

<style>
input {
  border: 1px solid #000;
}
</style>