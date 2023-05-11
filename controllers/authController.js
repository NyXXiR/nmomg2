var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
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
router.post("/join", function (req, res, next) {
  mainService.insertMember(req, res, next);
});

router.post("/id_check", function (req, res, next) {
  res.write("<script>alert('success')</script>");
  res.write('<script>window.location="/auth/join"</script>');
});

module.exports = router;
