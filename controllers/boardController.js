var express = require("express");
var router = express.Router();
var boardService = require("../services/boardService");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

router.get("/", function (req, res, next) {
  req.params.game = "valorant";
  req.params.category = "recruit";
  boardService.selectBoardByCategoryAndGame(req, res, next);

  // res.render("pages/board/boardMain");
});

router.get("/main/:game", async function (req, res, next) {
  let game = req.params.game;
  //가져올 row의 갯수를 설정
  let limit = 8;
  const result = await boardService.selectNotExpiredBoardByGameAndLimit(
    game,
    limit
  );

  console.log("result는" + result[0]);
  res.render("index_" + req.params.game, {
    title: "너만오면고",
    game: req.params.game,
    result: result,
  });
});

/* 게시글 작성 라우터*/
router.get("/:category/:game/insert", function (req, res, next) {
  const isLogined = JSON.parse(req.cookies.isLogined || "false"); // 문자열 'false'를 boolean 값 false로 변환
  if (!isLogined) {
    console.log("!!");
    return res.redirect("/auth/login");
  }
  res.render("pages/board/insert", {
    category: req.params.category,
    game: req.params.game,
  });
});

router.post("/:category/:game/insert", async function (req, res, next) {
  //여기에 insert 서비스 입력

  console.log(req.body.isLogined);
  if (!Boolean(req.body.isLogined)) {
    return res.redirect("/auth/login");
  }
  let voice;
  if (req.body.voice == "on") {
    voice = 1;
  } else {
    voice = 0;
  }
  var param = {
    writerSeq: req.session.user_seq,
    howLong: req.body.howLong,
    title: req.body.title,
    content: req.body.content,
    game: req.params.game,
    category: req.params.category,
    voice: voice,
  };

  await boardService.insertBoard(param);

  if (param.category != "community") {
    console.log("expired if문 진입");
    await boardService.willExpired();
  }

  res.redirect(`/board/${req.params.category}/${req.params.game}`);
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
  boardService.selectIdandTierBySeqAndCategory(seq, category);

  // res.render("pages/board/insert", {
  //   category: category,
  // });
});

//게시글 리스트 불러오기
router.get("/:category/:game", function (req, res, next) {
  boardService.selectBoardByCategoryAndGame(req, res, next);
});

router.get("/:category/:game/detail", async function (req, res, next) {
  const boardSeq = req.query.boardSeq;

  await boardService.viewCountPlusByBoardSeq(boardSeq);
  //selectBoardByBoardSeq을 만들어서 result를 불러옴
  let result = await boardService.selectBoardByBoardSeq(boardSeq);
  console.log(result);
  result = result[0];
  //viewCountPlusByBoardSeq를 만들어서 viewCount를 1 올림
  //result를 전달

  res.render("pages/board/detail_board", {
    game: req.params.game,
    category: req.params.category,
    result: result,
  });
});
/* 디아블로 board 관련 라우터 */

module.exports = router;
