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
  // res.send("API server works fine");
  // var pool = new pg.Pool({
  //   database: process.env.DB_DATABASE,
  //   user: process.env.DB_USERNAME,
  //   password: process.env.DB_PASSWORD,
  //   host: process.env.DB_HOST,
  //   port: process.env.DB_PORT
  // });
  // pool.connect(function(err, client) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     client.query("SELECT name FROM staff", function(err, result) {
  //       res.send(result.rows[0].name);
  //       // res.render("index", {
  //       //   title: "Express",
  //       //   datas: result.rows[0].name
  //       // });
  //       // console.log(result); //コンソール上での確認用なため、この1文は必須ではない。
  //     });
  //   }
  // });
});

app.post("/caps", (req, res) => {
  const DCL = { waitUntil: "domcontentloaded" };
  const requestUrl01 = req.body.urldata01;
  // const widthSets = ["full", 700, 400];
  const widthSets = ["full"];
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

    await Page.build({
      id: 2,
      // counter: 1,
      // processing: true,
      url: capsId
      // createdAt: new Date(),
      // updatedAt: new Date()
    }).save();

    // await Staff.build({
    //   id: 4,
    //   name: "tarou",
    //   age: 21
    // }).save();

    // await Staff.create({
    //   name: "tarou",
    //   age: 21
    // }).then(staff => {
    //   res.redirect(`/${capsId}`);
    // });

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
