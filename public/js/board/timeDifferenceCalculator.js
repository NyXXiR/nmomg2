console.log("timeDifferenceCalculator.js 인식됨");

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
