var category = document.getElementById("category");
var howLong = document.querySelector(".howLong");
console.log(category.value);

if (category.value == "community") {
  howLong.style.display = "none";
  howLong.value = "커뮤니티";
  console.log(howLong.value);
}
