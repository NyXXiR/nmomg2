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
