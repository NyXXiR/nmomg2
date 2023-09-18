var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
var myMiddleware = require("./myMiddleware");
const request = require("request");

const cors = require("cors");

//미들웨어 목록
router.use(cors());

var appBaseUrl = "https://nmomg.com",
  appCallbackUrl = appBaseUrl + "/auth/riot";

var provider = "https://auth.riotgames.com",
  authorizeUrl = provider + "/authorize",
  tokenUrl = provider + "/token";

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

//라이엇 RSO 통합 매핑
router.get("/riot", function (req, res) {
  var accessCode = req.query.code;

  // make server-to-server request to token endpoint
  // exchange authorization code for tokens
  request.post(
    {
      url: tokenUrl,
      auth: {
        // sets "Authorization: Basic ..." header
        user: clientID,
        pass: clientSecret,
      },
      form: {
        // post information as form-data
        grant_type: "authorization_code",
        code: accessCode,
        redirect_uri: appCallbackUrl,
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // parse the response to JSON
        var payload = JSON.parse(body);

        // separate the tokens from the entire response body
        var tokens = {
          refresh_token: payload.refresh_token,
          id_token: payload.id_token,
          access_token: payload.access_token,
        };

        // legibly print out our tokens
        res.send("<pre>" + JSON.stringify(tokens, false, 4) + "</pre>");
      } else {
        res.send("/token request failed");
      }
    }
  );
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
