<template>
  <div>
    <div class="container">
      <div class="container__contents" id="js-mark">
        <div class="container__contents-inner p-3">
          <!-- <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm">
            <div class="container d-flex justify-content-end">
              <button v-on:click.stop="commentCreate(positionList)" class="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">保存する</button>
            </div>
          </nav> -->
          <template v-for="item in positionList">
            <div v-bind:class="{ 'comment-done' : item.done }" class="mt-5" v-if="item.status === true" :key="item.index">
              <div class="rounded overflow-hidden shadow-lg">
                <div>
                    <span class="click-btn click-btn--comment">
                      {{ item.index }}
                    </span>
                    <textarea
                      name=""
                      id=""
                      class="update-form-textarea"
                      placeholder=""
                      v-model="item.message"
                      v-bind:readonly="item.is_readonly"
                      cols="30"
                      rows="4"
                    ></textarea>
                </div>
                <button v-on:click.stop="commentScroll(item.positionY)" class="mt-3 bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded">移動</button>
                <button v-on:click.stop="commentDelete(item.index)" class="mt-3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">削除</button>
                <button v-show="!item.done" v-on:click.stop="commentDone(item.index)" class="mt-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">完了</button>
                <button v-show="item.done" v-on:click.stop="commentNotDone(item.index)" class="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">未完了</button>
                <button v-show="item.is_readonly" v-on:click.stop="commentEdit(item.index)" class="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">編集</button>
                <button v-show="!item.is_readonly" v-on:click.stop="commentEditEnd(item.index)" class="mt-3 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">コメント保存</button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="container__images">
        <img :src="imgSrc" v-on:click="updateMessage" id="js-targe" />

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
                  <span class="close-mark">×</span>
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
                <button v-on:click.stop="isProcessing(item.index)">
                  送信
                </button>
              </div>
            </form>
          </div>
        </template>
      </div>
      <!-- id:{{ $route.path }} -->
      <!-- {{pageid}}
      {{this.page_id}} -->
    </div>
  </div>
</template>

<script>
export default {
  head () {
    return {
      meta: [
        { name: 'robots', content: 'noindex,follow',}
      ]
    }
  },
  async asyncData({ params,$axios }) {
    const getPageId = await $axios.$post('/api/url',{url:params.id});
    // this.page_id = getPageId;
    return {
      pageid: getPageId,
      imgSrc: "images/" + params.id + "/00.png"
    };
  },
  // async fetch() {
  //     this.mountains = await fetch(
  //       'https://api.nuxtjs.dev/mountains'
  //     ).then(res => res.json())
  //   },
  data() {
    return {
      name: "",
      message: "",
      counter: 1,
      processing: true,
      page_id: 1,
       // 初期値としてからのオブジェクトを入れてないと、updateMessageがうまく動作しないため
      positionList:
      [
        {}
      ],
    };
  },
  mounted: function () {
    this.$nextTick(async function () {
      // ビュー全体がレンダリングされた後にのみ実行されるコード
      const getPageId = await this.$axios.$post('/api/url',{url:this.$nuxt.$route.params.id});
      const commentsdata = await this.$axios.$post('/api/getComment',{pageId:getPageId});
      console.log(commentsdata);
      if(await commentsdata != 0) {
        // counter
        await console.log(commentsdata.length);
        this.counter = await commentsdata.length + 1;

        // positionList
        const positionList = await commentsdata;
        const positionListChange = [{}];
        for await (const positionListItem of positionList) {
          console.log(positionListItem);
          positionListChange.push({
            status: Boolean(positionListItem.status),
            formStatus: Boolean(positionListItem.form_status),
            done: Boolean(positionListItem.done),
            is_readonly: Boolean(positionListItem.is_readonly),
            message: positionListItem.message,
            index: positionListItem.index,
            positionX: positionListItem.position_x,
            positionY: positionListItem.position_y,
            positionFormX: positionListItem.position_form_x,
            positionFormY: positionListItem.position_form_y,
          })
        }
        this.positionList = await positionListChange;
      }
    })
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
      console.log(currentIndex);
      this.processing = true;
      this.positionList[currentIndex].formStatus = false;

      this.commentCreate(this.positionList); // 自動保存
    },
    closeMessage: function (currentIndex) {
      console.log(currentIndex);
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

      this.commentCreate(this.positionList); // 自動保存
    },
    commentDone: function (currentIndex) {
      this.positionList[currentIndex].done = true;

      this.commentCreate(this.positionList); // 自動保存
    },
    commentNotDone: function (currentIndex) {
      this.positionList[currentIndex].done = false;

      this.commentCreate(this.positionList); // 自動保存
    },
    commentEdit: function (currentIndex) {
      this.positionList[currentIndex].is_readonly = false;
    },
    commentEditEnd: function (currentIndex) {
      this.positionList[currentIndex].is_readonly = true;
      this.commentCreate(this.positionList); // 自動保存
    },
    async commentCreate(positionList) {

      console.log('test');
      console.log(this.$nuxt.$route.params.id); // url取得ここからpostでID取得
      const getPageId = await this.$axios.$post('/api/url',{url:this.$nuxt.$route.params.id});
      await console.log(getPageId);
      for await (let positionListItem of positionList){
        // オブジェクトが空ならばループをスキップ
        if (0 === Object.keys(positionListItem).length) {
          continue;
        }
        const request = {
          status: positionListItem.status,
          form_status: positionListItem.formStatus,
          done: positionListItem.done,
          is_readonly: positionListItem.is_readonly,
          message: positionListItem.message,
          index: positionListItem.index,
          position_x: positionListItem.positionX,
          position_y: positionListItem.positionY,
          // window_y: positionListItem.window_y,
          position_form_x: positionListItem.positionFormX,
          position_form_y: positionListItem.positionFormY,
          page_id: parseInt(getPageId),
        };

        const response = await this.$axios.$post('api/commentCreate', request);
        console.log(response);
      }
      // this.isLikedBy = true
      // this.countLikes = response.data.countLikes



      // await axios.post('/' + this.url, article).then(res => {
      //   console.log(res.data.title);
      //   console.log(res.data.content);
      // });
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
  justify-content: space-between;
  width: 1500px;
  max-width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-left: 3%;
  padding-right: 3%;
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

.click-btn--comment {
  position: relative;
  z-index: 1;
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
  width: 280px;
}

.update-form-content-upper {
  text-align: right;
}

.update-form-content {
  /* border-top: 1px solid #aaa; */
  border-bottom: 1px solid #aaa;
  padding: 0.5em;
}

.update-form-upper {
  padding-right: 0.3em;
}

.close-mark {
  font-size: 2em;
  font-weight: bold;
  line-height: .6;
}


.update-form-textarea {
  padding: 0.3em;
  width: 100%;
}

.update-form-bottom {
  padding: 0.5em;
}
</style>
