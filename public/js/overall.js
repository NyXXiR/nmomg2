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

/* mixins 관련 코드 */

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

document.querySelectorAll("#image-copy").forEach(function (element) {
  element.addEventListener("click", function () {
    var originalSrc = "/img/icon_copy.svg"; // 원래 이미지 경로
    var newSrc = "/img/icon_check.png"; // 변경할 이미지 경로
    var image = element;

    image.src = newSrc;

    setTimeout(function () {
      image.src = originalSrc;
    }, 2000);
  });
});

//recruitBlock에서 게임 id를 클립보드에 복사시켜주는 함수
function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Copied to clipboard: " + text);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

$(document).ready(function () {
  $(".box-header-information").on("click", "#player-name", function () {
    const playerName = $(this).text().trim();
    const game = $(this).siblings("#hidden-game").val(); // 형제 요소에서 hidden-game 값을 가져옴
    const blockType = $(this)
      .closest(".container-board-each")
      .data("block-type"); // 가장 가까운 container-board-each 요소에서 block-type 값을 가져옴

    // 예시: 해당 블록에 맞는 동작을 수행
    console.log("플레이어 이름:", playerName);
    console.log("게임:", game);
    console.log("블록 종류:", blockType);
    // 폼을 생성하여 POST 요청을 전송합니다.
    const form = $("<form>")
      .attr("method", "post")
      .attr("action", `/stat/search/${game}`) // "game"을 적절한 값으로 바꿔주세요.
      .appendTo("body");

    // playerName 값을 숨겨진 필드로 추가합니다.
    $("<input>")
      .attr("type", "hidden")
      .attr("name", "playerName")
      .val(playerName)
      .appendTo(form);

    // 폼을 제출하여 POST 요청을 전송합니다.
    console.log(form);
    form.submit();
  });
});
