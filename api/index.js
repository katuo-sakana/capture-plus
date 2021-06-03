const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const fs = require("fs");
const pg = require("pg");
const Page = require("./models/page");
const Staff = require("./models/staff");
app.use(bodyParser.urlencoded({ extended: false }));
// app.listen(process.env.PORT || 3000);
const LAUNCH_OPTION = process.env.DYNO
  ? { args: ["--no-sandbox", "--disable-setuid-sandbox"] }
  : { headless: true };

app.get("/test", (req, res, next) => {
  Page.findAll().then(pages => {
    res.send(pages[0].url);
  });
});

app.post("/caps", (req, res) => {
  const DCL = { waitUntil: "domcontentloaded" };
  const requestUrl01 = req.body.urldata01;
  // const widthSets = ["full", 700, 400];
  const widthSets = ["full"];
  // const requestUrl02 = req.body.urldata02;
  // const requestUrls = [requestUrl01, requestUrl02];
  const capsId = uuid.v4();
  let recentId = 0; // 最新のIDを取得
  Page.findAll().then(pages => {
    if (pages.length) {
      recentId = pages[pages.length - 1].id;
    }
  });
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
