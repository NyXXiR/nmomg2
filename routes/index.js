var express = require("express");
var router = express.Router();
var mainController = require("../controllers/mainController");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

//여기가 컨트롤러 격인 것 같음

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "너만오면고" });
});

router.get("/sidebar", function (req, res, next) {
  res.render("index_with_sidebar", { title: "너만오면고" });
});

router.get("/index_league_of_legend", function (req, res, next) {
  res.render("index_league_of_legend", { title: "너만오면고" });
});

router.get("/index_valorant", function (req, res, next) {
  res.render("index_valorant", { title: "너만오면고" });
});

router.get("/test/:seq", function (req, res, next) {
  mainController.getAllUser(req, res, next);
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
