var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
var myMiddleware = require("./myMiddleware");
const axios = require("axios");
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
  res.render("pages/auth/join", { game: "valorant" });
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
  console.log(req.session.kakao_id);
  console.log(req.session.access_token);
  if (req.session.kakao_id) {
    mainService.kakaoLogout(req, res, next);
  }
  req.session.destroy(function (error) {
    if (error) throw error;
    res.cookie("isLogined", false);
    res.redirect("/");
  });
});

//마이페이지 관련 라우터 - 개인정보변경, 탈퇴 등

router.get(
  "/myPage",
  myMiddleware.requireLogin,
  async function (req, res, next) {
    const memberSeq = req.session.user_seq;

    const selectedMember = await mainService.selectMemberByMemberSeq(memberSeq);
    console.log(selectedMember);

    res.render("pages/member/myPageMain", { result: selectedMember });
  }
);

router.get(
  "/change_password",
  myMiddleware.requireLogin,
  function (req, res, next) {
    res.render("pages/member/change_password");
  }
);
router.get(
  "/change_nickname",
  myMiddleware.requireLogin,
  function (req, res, next) {
    res.render("pages/member/change_nickname");
  }
);
router.get(
  "/quit_member",
  myMiddleware.requireLogin,
  function (req, res, next) {
    res.render("pages/member/quit_member");
  }
);
/* 라이엇 RSO 로그인 관련 전역변수 */
var clientID = "6e705d8e-d2da-4e14-943c-b41bc62e6499",
  clientSecret = "JmKBkL71SniKEE1Zka08yw==";

var appBaseUrl = "https://nmomg.com",
  appCallbackUrl = appBaseUrl + "/auth/riot";

var provider = "https://auth.riotgames.com",
  authorizeUrl = provider + "/authorize",
  tokenUrl = provider + "/token";

//라이엇 RSO 통합 매핑
router.get("/riot", async function (req, res) {
  const accessCode = req.query.code;

  try {
    const response = await axios.post(
      tokenUrl,
      {
        grant_type: "authorization_code",
        code: accessCode,
        redirect_uri: appCallbackUrl,
      },
      {
        auth: {
          username: clientID,
          password: clientSecret,
        },
      }
    );

    if (response.status === 200) {
      const payload = response.data;

      const tokens = {
        refresh_token: payload.refresh_token,
        id_token: payload.id_token,
        access_token: payload.access_token,
      };

      res.status(200).json(tokens); // 토큰을 JSON 형식으로 반환
    } else {
      res.status(response.status).send("Token request failed");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//카카오 로그인 핸들러
router.get("/kakao/start", async function (req, res, next) {
  await mainService.getKakaoLoginUrl(req, res, next);
});

router.get("/kakao/finish", function (req, res, next) {
  mainService.finishKakaoLogin(req, res, next);
});

router.get("/kakao/loginProcess", function (req, res, next) {
  mainService.connectKakaoId(req, res, next);
});

router.get("/kakao/logout", function (req, res, next) {
  mainService.kakaoLogout(req, res, next);
});

module.exports = router;
