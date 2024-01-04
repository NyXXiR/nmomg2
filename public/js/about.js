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
      item.insertBefore(imgElement, item.firstChild);
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
