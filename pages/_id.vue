<template>
  <v-app>
    <div class="container">
      <div class="container__contents" id="js-mark">
        <div class="container__contents-inner">
          <template v-for="item in positionList">
            <div v-bind:class="{ 'comment-done' : item.done }" v-if="item.status === true" :key="item.index">
              <v-container>
                <v-row justify="center">
                  <v-col cols="12">
                    <v-card>
                      <div>
                        <span class="click-btn">
                          {{ item.index }}
                        </span>
                        <textarea
                          name=""
                          id=""
                          class="update-form-textarea"
                          placeholder=""
                          v-model="item.message"
                          v-bind:readonly="item.is_readonly"
                          v-on:blur="item.is_readonly = true"
                          cols="30"
                          rows="4"
                        ></textarea>
                      </div>
                      <v-btn v-on:click.stop="commentScroll(item.positionY)" depressed>
                      移動
                      </v-btn>
                      <v-btn v-on:click.stop="commentDelete(item.index)" color="error" depressed>
                      削除
                      </v-btn>
                      <v-btn v-on:click.stop="commentDone(item.index)" color="success" depressed>
                      完了
                      </v-btn>
                      <v-btn v-on:click.stop="commentNotDone(item.index)" color="info" depressed>
                      未完了
                      </v-btn>
                      <v-btn
                        color="success"
                        depressed
                         v-on:click.stop="commentEdit(item.index)"
                      >
                        <v-icon left>
                          mdi-pencil
                        </v-icon>
                        編集
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </div>
          </template>
        </div>
      </div>
      <div class="container__images" id="js-targe" v-on:click="updateMessage">
        <img :src="imgSrc" />

        <template v-for="item in positionList">
          <div v-if="item.status === true" :key="item.index" v-on:click.stop>
            <div
              class="click-btn click-btn--position"
              v-bind:style="{
                top: item.positionY + 'px',
                left: item.positionX + 'px',
              }"
            >
              {{ item.index }}
            </div>

            <form
              class="update-form"
              v-if="item.formStatus === true"
              action
              method="post"
              v-bind:style="{
                top: item.positionFormY + 'px',
                left: item.positionFormX + 'px',
              }"
            >
              <div class="update-form-upper">
                <button v-on:click.stop="closeMessage(item.index)">
                  閉じる
                </button>
              </div>
              <div class="update-form-content">
                <textarea
                  name=""
                  id=""
                  class="update-form-textarea"
                  placeholder="コメントを入力してください"
                  v-on:click.stop
                  v-model="item.message"
                  cols="30"
                  rows="4"
                ></textarea>
              </div>
              <div class="update-form-bottom">
                <v-btn
                  v-on:click.stop="isProcessing(item.index)"
                  small
                  color="primary"
                  dark
                  >送信</v-btn
                >
              </div>
            </form>
          </div>
        </template>
      </div>
      <!-- id:{{ $route.path }} -->
    </div>
  </v-app>
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
          done: false,
          is_readonly: true,
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
        done: false,
        is_readonly: true,
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
    closeMessage: function (currentIndex) {
      this.processing = true;
      this.positionList[currentIndex].status = false;
      this.positionList[currentIndex].formStatus = false;
    },
    commentScroll: function (position) {
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      })
    },
    commentDelete: function (currentIndex) {
      this.processing = true;
      this.positionList[currentIndex].status = false;
    },
    commentDone: function (currentIndex) {
      this.positionList[currentIndex].done = true;
    },
    commentNotDone: function (currentIndex) {
      this.positionList[currentIndex].done = false;
    },
    commentEdit: function (currentIndex) {
      this.positionList[currentIndex].is_readonly = false;
    }
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
  justify-content: space-between;
  width: 1400px;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
}
.container__contents {
  width: 30%;
}
.container__contents-inner {
  position: fixed;
  top: 0;
  overflow-y: auto;
  height: 100vh;
  width: 30%;
}
.comment-done {
  opacity: .5;
}
.container__images {
  width: 65%;
  /* padding-left: 5%;
  padding-right: 5%; */
  position: relative;
}
.click-btn {
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

.click-btn--position {
  position: absolute;
}

.update-form {
  position: absolute;
  border: 1px solid #aaa;
  border-radius: 0.8em;
  background-color: #fff;
  text-align: right;
  padding-top: 0.5em;
}

.update-form-content-upper {
  text-align: right;
}

.update-form-content {
  /* border-top: 1px solid #aaa; */
  border-bottom: 1px solid #aaa;
  padding: 0.5em;
}

.update-form-textarea {
  padding: 0.3em;
  width: 100%;
}

.update-form-bottom {
  padding: 0.5em;
}
</style>
