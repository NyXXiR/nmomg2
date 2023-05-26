var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

router.get("/", function (req, res, next) {
  res.render("pages/board/boardMain");
});

/* 게시글 작성 라우터*/
router.get("/insert", function (req, res, next) {
  res.render("pages/board/insert");
});

router.post("/insert", function (req, res, next) {
  res.render("pages/board/insert");
});

router.get("/list/:category", function (req, res, next) {
  console.log(req.params.category);
  mainService.selectBoardByCategory(req, res, next);
});

router.get("/:className", function (req, res, next) {
  console.log(req.params.className);
  res.render("pages/board/detail_class", {
    className: req.params.className,
  });
});

module.exports = router;
