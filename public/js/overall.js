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
$(".isLogined").val(isLogined_value);
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

//recruitBlock의 게시 시간 계산해주는 함수
function getTimeDifferenceString(postTime) {
  const currentTime = new Date();
  const writeTime = new Date(postTime);
  const diffInMilliseconds = currentTime - writeTime;
  const minutes = Math.floor(diffInMilliseconds / (60 * 1000));

  if (minutes < 1) {
    return "방금 게시됨";
  } else if (minutes < 60) {
    return `${minutes}분 전 게시됨`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    return `${hours}시간 전 게시됨`;
  } else {
    const days = Math.floor(minutes / 1440);
    return `${days}일 전 게시됨`;
  }
}

// 게시글 목록에서 각 게시글의 작성 시간을 가져와서 시간 차이 문자열로 표시
const postItems = document.querySelectorAll(".time-difference");

postItems.forEach((item) => {
  const writeTime = item.previousElementSibling.innerText;
  const timeDifferenceString = getTimeDifferenceString(writeTime);

  // 시간 차이 문자열을 각 게시글 아래에 추가
  item.innerText = timeDifferenceString;
});
