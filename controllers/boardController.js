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

//게시글 입력 프로세스
router.post("/insert/:category", function (req, res, next) {
  //내가 허용한 category값이 아니면 홈으로 사출해야 함(카테고리가 abcd 이런거 나오면 안되기 때문)

  //로그인 안됐으면 로그인화면으로 사출(로그인여부는 req.cookie.isLogined에 저장되어 있음)
  if (!req.cookie.isLogined) {
    res.redirect("/auth/login");
  }

  //변수 설정(로그인이 되어 있으므로 세션에서 사용자 정보를 가져와도 됨)
  var seq = req.session.user_seq;
  var category = req.params.category;
  mainService.selectIdandTierBySeqAndCategory(seq, category);

  res.render("pages/board/insert", {
    category: category,
  });
});

router.get("/list/:category", function (req, res, next) {
  console.log(req.params.category);
  mainService.selectBoardByCategory(req, res, next);
});

/* 디아블로 board 관련 라우터 */
router.get("/:className", function (req, res, next) {
  console.log(req.params.className);
  res.render("pages/board/detail_class", {
    className: req.params.className,
  });
});

module.exports = router;
