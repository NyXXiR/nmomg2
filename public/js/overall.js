console.log("check");

/*

	p.login-check-false
		a(href="/auth/join") 회원가입
		a(href="/auth/login") 로그인

	p.login-check-true
		a 마이페이지
		a 로그아웃


        req.session.isLogined의 true/false 여부로 표시되는 헤더 목록 결정
*/

console.log(document.cookie);
const getCookieValue = (name) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

var isLogined_value = getCookieValue("isLogined");
var nickname_value = getCookieValue("nickname");
//배열로 잘랐으니까 배열에서 각 key(nickname, islogined 등)를 포함하는 문자열을 검색해서 다시 잘라서 쓰자

if (isLogined_value == "true") {
  $(".login-check-false").css("display", "none");
  $(".login-check-true").css("display", "inline");
} else {
  $(".login-check-false").css("display", "inline");
  $(".login-check-true").css("display", "none");
}
