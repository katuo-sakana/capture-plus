const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: false }));
// app.listen(process.env.PORT || 3000);
const LAUNCH_OPTION = process.env.DYNO
  ? { args: ["--no-sandbox", "--disable-setuid-sandbox"] }
  : { headless: false };

app.get("/test", (req, res) => {
  res.send("API server works fine");
});

app.post("/caps", (req, res) => {
  const DCL = { waitUntil: "domcontentloaded" };
  const requestUrl01 = req.body.urldata01;
  const widthSets = ["full", 700, 400];
  // const requestUrl02 = req.body.urldata02;
  // const requestUrls = [requestUrl01, requestUrl02];
  const capsId = uuid.v4();
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
          const page = await browser.newPage();
          if (widthSet !== "full") {
            await page.setViewport({
              width: widthSet,
              height: 768
            });
          }
          const puppeteerRes = await page.goto(requestUrl01, DCL);
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

    // const page = await browser.newPage(); //新しいタブを開く
    // await page.goto(requestUrl01); //指定したURLに移動
    // await page.screenshot({
    //   path: `static/images/${capsId}/01.png`,
    //   fullPage: true
    // }); //スクリーンショットを撮る
    // await page.goto(requestUrl02); //指定したURLに移動
    // await page.screenshot({
    //   path: `static/images/${capsId}/02.png`,
    //   fullPage: true
    // }); //スクリーンショットを撮る

    await browser.close(); //Chromiumを閉じる
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
