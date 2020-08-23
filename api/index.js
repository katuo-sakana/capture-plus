const express = require("express");
const puppeteer = require("puppeteer");
const app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/test", (req, res) => {
  res.send("API server works fine");
});

app.post("/caps", (req, res) => {
  const requestUrl = req.body.urldata;
  (async () => {
    const browser = await puppeteer.launch(); //Chromiumを起動
    const page = await browser.newPage(); //新しいタブを開く
    await page.goto(requestUrl); //指定したURLに移動
    await page.screenshot({ path: "caps02.png" }); //スクリーンショットを撮る

    await browser.close(); //Chromiumを閉じる
  })();
  res.send("req" + req.body.urldata);
});

module.exports = {
  path: "/api",
  handler: app
};
