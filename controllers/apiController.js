var express = require("express");
const fetch = require("node-fetch");
var router = express.Router();
var mainService = require("../services/diablo4Service");
const cors = require("cors");
const diablo4Service = require("../services/diablo4Service");

//미들웨어 목록
router.use(cors());

module.exports = router;

//각 유저의 평판을 조회할 수 있는 기능 모음
router.get("/blizzard/getLeaderboardId", function (req, res, next) {
  //req를 조정하면 안에 들어가는 parameter를 동적으로 바꿀 수 있다. 일단은 구현이 목적이므로 한국서버, 28시즌, 바바리안을 기준으로 구현
  diablo4Service.getLeaderboardId("kr", 28, "rift-barbarian", 10);
});
