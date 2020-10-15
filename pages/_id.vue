<template>
  <div class="container">
    <div class="container__contents" id="js-mark">
      <template v-for="item in positionList">
        <div v-if="item.status === true" :key="item.index">
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-card>
                  <v-card-title
                    >{{ item.index }}：{{ item.message }}</v-card-title
                  >
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </template>
    </div>
    <div class="container__images" id="js-targe" v-on:click="updateMessage">
      <img :src="imgSrc" />

      <template v-for="item in positionList">
        <div v-if="item.status === true" :key="item.index">
          <div
            class="click-btn"
            v-on:click.stop
            v-bind:style="{
              top: item.positionY + 'px',
              left: item.positionX + 'px',
            }"
          >
            {{ item.index }}
          </div>
          <!-- <form
            class="update-form"
            action
            method="post"
            v-bind:style="{
              top: item.positionFormY + 'px',
              left: item.positionFormX + 'px'
            }"
          >
            <button>sousin</button>
          </form> -->
          <v-form
            class="update-form"
            v-if="item.formStatus === true"
            action
            method="post"
            v-bind:style="{
              top: item.positionFormY + 'px',
              left: item.positionFormX + 'px',
            }"
          >
            <v-container fluid>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-on:click.stop
                    v-model="item.message"
                    solo
                    name="input-7-4"
                    label="Solo textarea"
                  ></v-textarea>
                  <v-btn
                    v-on:click.stop="isProcessing(item.index)"
                    small
                    color="primary"
                    dark
                    >送信</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
            <!-- <button>sousin</button> -->
          </v-form>
        </div>
      </template>
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
      name: "",
      message: "",
      counter: 1,
      processing: true,
      positionList: [
        {
          status: false,
          formStatus: false,
          index: 0,
          positionX: 0,
          positionY: 0,
          positionFormX: 0,
          positionFormY: 0,
        },
      ],
    };
  },
  methods: {
    updateMessage: function (e) {
      if (this.processing === false) {
        return;
      }

      let offsetX = e.offsetX; // =>要素左上からのx座標
      let offsetY = e.offsetY; // =>要素左上からのy座標
      // let pageX = e.pageX; // =>ウィンドウ左上からのx座標
      // let pageY = e.pageY; // =>ウィンドウ左上からのy座標
      // let clientX = e.clientX; // =>ページ左上からのx座標
      // let clientY = e.clientY; // =>ページ左上からのy座標
      this.positionList.push({
        status: true,
        formStatus: true,
        message: "",
        index: this.counter,
        positionX: offsetX,
        positionY: offsetY,
        positionFormX: offsetX,
        positionFormY: offsetY + 50,
      });
      this.counter++;
      this.processing = false;
    },
    isProcessing: function (currentIndex) {
      this.processing = true;
      this.positionList[currentIndex].formStatus = false;
    },
  },
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

.update-form {
  position: absolute;
}
</style>
