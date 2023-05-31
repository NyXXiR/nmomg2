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
  //로그인 가능 여부를 체크하고 seq, user_id, nickname을 세션에 저장
  mainService.loginCheck(req, res, next);
  // res.render("index", { title: "너만오면고" });
});

router.get("/join", function (req, res, next) {
  res.render("pages/auth/join");
});
router.post("/join", function (req, res, next) {
  mainService.insertMember(req, res, next);
});

router.post("/id_check", function (req, res, next) {
  mainService.memberIdCheck(req, res, next);
  // res.write("<script>alert('success')</script>");
  // res.write('<script>window.location="/auth/join"</script>');
});

router.get("/session_check", function (req, res, next) {
  console.log(req.session.user_seq);
  console.log(req.session.user_id);
  console.log(req.session.nickname);
  res.redirect("/");
});

router.get("/logout", function (req, res, next) {
  req.session.destroy(function (error) {
    if (error) throw error;
    res.cookie("isLogined", false);
    res.redirect("/");
  });
});

//카카오 로그인 핸들러
router.get("/kakao/start", function (req, res, next) {
  mainService.getKakaoLoginUrl(req, res, next);
});

router.get("/kakao/finish", function (req, res, next) {
  mainService.finishKakaoLogin(req, res, next);
});
module.exports = router;
