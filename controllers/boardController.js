var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

router.get("/", function (req, res, next) {
  res.render("pages/board/boardMain");
});

router.get("/recruit", function (req, res, next) {
  res.render("pages/board/recruit");
});

router.get("/humor", function (req, res, next) {
  res.render("pages/board/humor");
});

router.get("/free", function (req, res, next) {
  res.render("pages/board/free");
});

router.get("/insert", function (req, res, next) {
  res.render("pages/board/insert");
});

router.get("/list/:category", function (req, res, next) {
  console.log(req.params.category);
  mainService.selectBoardByCategory(req, res, next);
});

module.exports = router;
