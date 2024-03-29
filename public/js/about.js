document.addEventListener("DOMContentLoaded", function () {
  const iconItems = document.querySelectorAll(".icon-item");

  iconItems.forEach(function (item) {
    const iconName = item.dataset.icon;
    const imagePath = `/icon/about/icon_${iconName}.png`;

    // 이미지 엘리먼트 생성
    const imgElement = document.createElement("img");
    imgElement.alt = `${iconName} Icon`;
    imgElement.classList.add("icon");

    // 이미지가 존재하는 경우에만 속성 설정 및 추가
    const imageExists = new Promise((resolve) => {
      imgElement.onload = () => resolve(true);
      imgElement.onerror = () => resolve(false);
      imgElement.src = imagePath;
    });

    imageExists.then((exists) => {
      // 아이콘이 존재하는 경우 이미지를 설정하고 추가
      if (exists) {
        imgElement.src = imagePath;
      } else {
        // 아이콘이 존재하지 않는 경우 기본 아이콘 설정
        imgElement.src = "/icon/about/icon_default.png";
      }

      // 아이콘을 텍스트 앞에 추가
      item.appendChild(imgElement);
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const headerAnimation = document.querySelector(".header-animation");

  function handleResize() {
    if (window.innerWidth > 800) {
      headerAnimation.style.display = "flex";
    } else if (window.innerWidth <= 800) {
      headerAnimation.style.display = "none";
    }
  }

  window.addEventListener("resize", handleResize);

  // 페이지 로드 시 초기 상태 설정
  handleResize();

  setTimeout(function () {
    headerAnimation.classList.remove("initial-animation");
    headerAnimation.style.opacity = 1;
  }, 4000);
});

document.addEventListener("DOMContentLoaded", function () {
  // 각 링크를 가져옵니다.
  var links = document.querySelectorAll(".navigation-bar-container a");

  // 링크를 클릭했을 때의 동작을 정의합니다.
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      // 클릭한 링크의 해시 값을 가져옵니다.
      var targetId = link.getAttribute("href").substring(1);

      // 해당 섹션의 위치를 계산합니다.
      var targetElement = document.getElementById(targetId);
      var targetOffset = targetElement.offsetTop;

      // fixed 헤더의 높이를 가져옵니다.
      var headerHeight = document.querySelector(
        ".navigation-bar-container"
      ).offsetHeight;

      // 스크롤 위치를 조절하여 fixed 헤더를 고려한 위치로 이동합니다.
      window.scrollTo({
        top: targetOffset - headerHeight,
        behavior: "smooth",
      });
    });
  });
});
