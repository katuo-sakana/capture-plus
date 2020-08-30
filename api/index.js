const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
const bodyParser = require("body-parser");
const uuid = require("uuid");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/test", (req, res) => {
  res.send("API server works fine");
});

app.post("/caps", (req, res) => {
  const requestUrl = req.body.urldata;
  const capsId = uuid.v4();
  (async () => {
    const browser = await puppeteer.launch(); //Chromiumを起動
    const page = await browser.newPage(); //新しいタブを開く
    await page.goto(requestUrl); //指定したURLに移動
    await page.screenshot({
      path: `static/images/${capsId}.png`,
      fullPage: true
    }); //スクリーンショットを撮る
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
