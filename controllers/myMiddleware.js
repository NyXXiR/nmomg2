function requireLogin(req, res, next) {
  const isLogined = JSON.parse(req.cookies.isLogined || "false"); // 문자열 'false'를 boolean 값 false로 변환
  if (!isLogined) {
    console.log("!!");
    return res.redirect("/auth/login");
  }
  next();
}

module.exports = {
  requireLogin: requireLogin,
};
