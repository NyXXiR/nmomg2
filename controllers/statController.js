var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
const cors = require("cors");
const request = require("request");

//미들웨어 목록
router.use(cors());

const options = {
  uri: "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/bhcHotFried?api_key=RGAPI-9d876837-7424-4d06-9b92-4459f9e4931e",
};

/* 라이엇 api key 받기 위한 txt파일 */
router.get("/riot", function (req, res, next) {
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
    }
    var obj = JSON.parse(body);
    console.log(obj);
  });
});

router.get("/", function (req, res, next) {
  res.render("pages/stat/statMain");
});

module.exports = router;
