console.log("overAll check");

/*

	p.login-check-false
		a(href="/auth/join") 회원가입
		a(href="/auth/login") 로그인

	p.login-check-true
		a 마이페이지
		a 로그아웃


        req.session.isLogined의 true/false 여부로 표시되는 헤더 목록 결정
*/

//내가만든쿠키를 가져와서 여기저기 쓸거임~
console.log(document.cookie);
const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

var isLogined_value = getCookieValue("isLogined");
var nickname_value = decodeURIComponent(getCookieValue("nickname"));

$(".nickname").text(nickname_value + "님");

//로그인여부를 체크해 헤더 내용 결정
if (isLogined_value == "true") {
  $(".login-check-false").css("display", "none");
  $(".login-check-true").css("display", "inline");
} else {
  $(".login-check-false").css("display", "inline");
  $(".login-check-true").css("display", "none");
}

const setBodyColor = () => {
  const game = document.getElementById("game").getAttribute("value");
  const body = document.body;

  switch (game) {
    case "lol":
      // body.style.background = "#f6edde";
      body.style.background = "url('/../img/lol_background.jpg') no-repeat";
      body.style.backgroundSize = "cover";
      body.style.backgroundAttachment = "fixed";
      break;
    case "valorant":
      // body.style.background = "#FFEBCD";
      body.style.background =
        "url('/../img/valorant_background.png') no-repeat";
      body.style.backgroundSize = "cover";
      body.style.backgroundAttachment = "fixed";

      break;
    case "diablo4":
      body.style.background = "#D3D3D3";
      body.style.background =
        "url('/../img/diablo4_background.jpg') no-repeat center center";
      body.style.backgroundSize = "cover";
      body.style.backgroundAttachment = "fixed";

      break;
    default:
      body.style.background = "#f6edde";
  }
};

// setBackgroundColor 함수 호출
setBodyColor();
