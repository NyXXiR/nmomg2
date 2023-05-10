var express = require("express");
var router = express.Router();
var mainController = require("../controllers/mainController");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

router.get("/login", function (req, res, next) {
  res.render("pages/auth/login");
});

router.post("/login", function (req, res, next) {
  //로그인 프로세스 작성
  res.render("pages/auth/login");
});
router.get("/join", function (req, res, next) {
  res.render("pages/auth/join");
});

module.exports = router;
