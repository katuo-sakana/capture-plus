<template>
  <v-app>
    <div>
      <v-app-bar color="deep-purple accent-4" dense dark>
        <v-toolbar-title>Capture plus</v-toolbar-title>
      </v-app-bar>
    </div>
    <div class="container">
      <p class="mb-0">指定のURLを入力ください</p>
      <form class="top-form" action="api/caps" method="post">
        <v-text-field
          type="url"
          name="urldata01"
          :rules="rules"
          hide-details="auto"
        ></v-text-field>
        <!-- <input type="url" name="urldata02" id /> -->
        <v-btn
          class="mt-5"
          type="submit"
          name="submit_name"
          depressed
          color="primary"
        >
          送信
        </v-btn>
      </form>
    </div>
  </v-app>
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