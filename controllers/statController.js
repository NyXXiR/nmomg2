var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
const cors = require("cors");
const request = require("request");

//미들웨어 목록
router.use(cors());

const options = {
  uri: "/lol/summoner/v4/summoners/by-name/{summonerName}",
  API_KEY: "RGAPI-9d876837-7424-4d06-9b92-4459f9e4931e",
};

router.get("/riot", function (req, res, next) {
  request(
    "/lol/summoner/v4/summoners/by-name/bhcHotFried?key=RGAPI-9d876837-7424-4d06-9b92-4459f9e4931e",
    function (error, response, body) {
      if (error) {
        console.log(error);
      }
      var obj = JSON.parse(body);
      console.log(obj);
    }
  );
});

module.exports = router;
