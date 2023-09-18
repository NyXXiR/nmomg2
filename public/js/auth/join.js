console.log("join.js 작동됨");

/*--------------------------------
아이디입력칸 #idInput

focus out 이벤트
비동기통신 > 중복여부 체크
중복 아이디 없을 경우> true 출력
중복 아이디 있을 경우 > false 출력

ajax 보낼곳: autu/id_check [post]


--------------------------------*/

//id 중복체크
idInput.addEventListener("focusout", function () {
  const id = $("#idInput").val();
  console.log(id);

  //값이 비었다면 false
  if (id.length == 0) {
    $(".join-id-check").html(
      "<p style='color:red;'>아이디를 입력해주세요.</p>"
    );
    return;
  }
  //길이가 짧으면 false

  //한글이 포함되었다면 false

  //띄어쓰기가 포함되었다면 false

  //ajax 통해 중복여부 체크
  $.ajax({
    url: "/auth/id_check",
    type: "POST",
    dataType: "JSON",
    data: { id: id },
  }).done(function (json) {
    console.log(json[0].cnt);
    if (json[0].cnt == 0) {
      $(".join-id-check").html(
        "<p style='color:blue;'>사용 가능한 ID입니다.</p>"
      );
    } else {
      $(".join-id-check").html(
        "<p style='color:red;'>사용 불가능한 ID입니다.</p>"
      );
    }
  });
});

// 비밀번호와 비밀번호 확인 필드의 값을 가져옵니다.
const passwordInput = document.getElementById("pwInput");
const repeatPasswordInput = document.getElementById("pwRepeatInput");

// 결과를 표시할 요소를 가져옵니다.
const passwordMatchMessage = document.getElementById("passwordMatchMessage");

// 비밀번호 확인 함수를 정의합니다.
const checkPasswordMatch = () => {
  // 비밀번호와 비밀번호 확인 필드의 값을 가져옵니다.
  const password = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  // 비밀번호와 비밀번호 확인이 모두 입력되었을 때 비교합니다.
  if (password && repeatPassword) {
    if (password === repeatPassword) {
      // 비밀번호가 일치하는 경우
      passwordMatchMessage.textContent = "비밀번호가 일치합니다.";
      passwordMatchMessage.style.color = "blue";
    } else {
      // 비밀번호가 일치하지 않는 경우
      passwordMatchMessage.textContent = "비밀번호가 일치하지 않습니다.";
      passwordMatchMessage.style.color = "red";
    }
  } else {
    // 둘 중 하나라도 입력되지 않은 경우 메시지를 초기화합니다.
    passwordMatchMessage.textContent = "";
  }
};

// 입력 필드의 값이 변경될 때마다 checkPasswordMatch 함수 실행
passwordInput.addEventListener("input", checkPasswordMatch);
repeatPasswordInput.addEventListener("input", checkPasswordMatch);

//비밀번호 확인이 일치해야만 회원가입이 가능하도록 추가해야 함
