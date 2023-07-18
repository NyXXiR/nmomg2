var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
const cors = require("cors");
const fs = require("fs");

//미들웨어 목록
router.use(cors());

//여기가 컨트롤러 격인 것 같음

/* GET home page. */
router.get("/", function (req, res, next) {
  /*첫 페이지를 발로란트 구인 화면으로 대체 */
  res.redirect("/board/main/diablo4");
  // res.render("index", { title: "너만오면고" });
});

router.get("/riot.txt", function (req, res, next) {
  fs.readFile("riot.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});

router.get("/sidebar", function (req, res, next) {
  res.render("index_with_sidebar", { title: "너만오면고", game: "lol" });
});

router.get("/test/:seq", function (req, res, next) {
  mainService.getAllUser(req, res, next);
});

router.get("/hanpy/:id", (req, res) => {
  res.json({ id: req.params.id });
});

router.get("/mybatisTest1/:boardNum", (req, res, next) => {
  var param = {
    boardNum: req.params.boardNum,
  };
  var query = mybatisMapper.getStatement(
    "sqlMapper",
    "getAllQuery",
    param,
    format
  );
  mysql.query(query, (error, rows) => {
    console.log(rows);
    res.json(rows);
  });
});

module.exports = router;
