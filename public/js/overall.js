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
const strings = document.cookie.split("=");
console.log(strings);

/* 로그인체크 */

if (strings[1] == "true") {
  $(".login-check-false").css("display", "none");
  $(".login-check-true").css("display", "inline");
} else {
  $(".login-check-false").css("display", "inline");
  $(".login-check-true").css("display", "none");
}
