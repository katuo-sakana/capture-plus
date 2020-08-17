const express = require("express");
const puppeteer = require("puppeteer");
const app = express();

app.get("/test", (req, res) => {
  res.send("API server works fine");
});

app.get("/caps", (req, res) => {
  (async () => {
    const browser = await puppeteer.launch(); //Chromiumを起動
    const page = await browser.newPage(); //新しいタブを開く
    await page.goto("https://liginc.co.jp/"); //指定したURLに移動
    await page.screenshot({ path: "caps02.png" }); //スクリーンショットを撮る

    await browser.close(); //Chromiumを閉じる
  })();
  res.send("API server works fine");
});

module.exports = {
  path: "/api",
  handler: app
};
