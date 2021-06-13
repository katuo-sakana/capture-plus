const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const fs = require("fs");
const pg = require("pg");
const Page = require("./models/page");
const Comment = require("./models/comment");
const Staff = require("./models/staff");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.listen(process.env.PORT || 3000);
const LAUNCH_OPTION = process.env.DYNO
  ? { args: ["--no-sandbox", "--disable-setuid-sandbox"] }
  : { headless: true };

// _id.vueのasyncDataでページURLを取得してそれをもとに、page_idを返却
app.post("/url", (req, res) => {
  const pageUrl = req.body.url;
  Page.findOne({ where: { url: pageUrl } }).then(page => {
    res.send(page.id.toString()); // 文字列にしないと「Invalid status code: 3 」というエラーが出る
  });
});

app.post("/commentCreate", (req, res) => {
  // console.log(req);
  console.log(req.body);
  // console.log(req.params);
  // console.log(req.body.message);
  let recentId = 0; // 最新のIDを取得
  (async () => {
    await Comment.findAll().then(comments => {
      if (comments.length) {
        recentId = comments[comments.length - 1].id;
      }
    });

    await Comment.build({
      id: recentId + 1,
      status: req.body.status,
      form_status: req.body.form_status,
      done: req.body.done,
      is_readonly: req.body.is_readonly,
      message: req.body.message,
      index: req.body.index,
      position_x: req.body.position_x,
      position_y: req.body.position_y,
      position_form_x: req.body.position_form_x,
      position_form_y: req.body.position_form_y,
      page_id: req.body.page_id
      // createdAt: "2021-06-06 16:46:14",
      // updatedAt: "2021-06-06 16:46:14"
    }).save();

    await res.send("text");
  })();
});

app.post("/caps", (req, res) => {
  const DCL = { waitUntil: "networkidle0" };
  // const DCL = { waitUntil: "domcontentloaded" };
  const requestUrl01 = req.body.urldata01;
  // const widthSets = ["full", 700, 400];
  const widthSets = ["full"];
  // const requestUrl02 = req.body.urldata02;
  // const requestUrls = [requestUrl01, requestUrl02];
  const capsId = uuid.v4();
  let recentId = 0; // 最新のIDを取得
  fs.mkdirSync(`static/images/${capsId}`, err => {
    if (err) {
      throw err;
    }
  });
  (async () => {
    const browser = await puppeteer.launch(LAUNCH_OPTION); //Chromiumを起動
    const promiseList = [];
    const titleList = [];
    widthSets.forEach((widthSet, index) => {
      promiseList.push(
        (async () => {
          const page = await browser.newPage(); //新しいタブを開く
          if (widthSet !== "full") {
            await page.setViewport({
              width: widthSet,
              height: 768
            });
          }
          const puppeteerRes = await page.goto(requestUrl01, DCL); //指定したURLに移動
          if (puppeteerRes.status() !== 200)
            return `${puppeteerRes.status()} ERROR`;

          const result = await page.screenshot({
            path: `static/images/${capsId}/0${index}.png`,
            fullPage: true
          }); //スクリーンショットを撮る

          await page.close();
          return result;
        })().catch(e => console.error(e))
      );
    });

    await Promise.all(promiseList).then(vList => {
      vList.forEach(title => titleList.push(title));
    });

    await browser.close(); //Chromiumを閉じる

    await Page.findAll().then(pages => {
      if (pages.length) {
        recentId = pages[pages.length - 1].id;
      }
    });
    await Page.build({
      id: recentId + 1,
      processing: true,
      url: capsId
    }).save();

    await res.redirect(`/${capsId}`); // awaitしてリダイレクトしないとページ遷移時に画像が表示されないため。（スクリーンショットが撮り終わったタイミングの処理をvueに記述すればうまくいくかも？）
  })();

  // res.send("req" + req.body.urldata);
  // res.render('schedule', {
  //   user: req.user,
  //   schedule: schedule,
  //   candidates: candidates,
  //   users: [req.user],
  //   availabilityMapMap: availabilityMapMap
  // });
});

module.exports = {
  path: "/api",
  handler: app
};
