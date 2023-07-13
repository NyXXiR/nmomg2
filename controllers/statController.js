var express = require("express");
var router = express.Router();
var statService = require("../services/statService");
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

router.get("/search/:game", function (req, res, next) {
  res.render("pages/stat/statMain", {
    game: req.params.game,
  });
});

router.post("/search/:game", async function (req, res, next) {
  const playerName = req.body.playerName;
  const game = req.params.game;
  //향후에 다른 국가 검색도 지원하고 싶으면 region을 동적으로 받도록 수정
  console.log("입력된 playerName: " + playerName);
  let region = "kr";

  //LOL 외 게임 에러처리
  if (game != "lol") {
    res.status(500).json({ error: "리그오브레전드만 가능" });
  }

  try {
    const puuid = await statService.getPuuidByPlayerName(playerName, region);
    region = "asia"; //kr 대신 asia를 받는 잔망스러운 API 쉑
    const recentMatches = await statService.getRecentMatches(puuid, region);

    const mappedMatches = recentMatches.map((eachMatch) => eachMatch.info);
    const filteredByPuuid = mappedMatches.map((mappedMatch) =>
      mappedMatch.participants.filter(
        (eachParticipant) => eachParticipant.puuid == puuid
      )
    );
    const recentWin = [];
    const recentPosition = [];

    for (var i = 0; i < filteredByPuuid.length; i++) {
      recentWin.push(filteredByPuuid[i][0].win);
      recentPosition.push(filteredByPuuid[i][0].teamPosition);
    }

    const recentWinRate = statService.avg(recentWin);

    console.log(recentWinRate);
    res.render("pages/stat/detail_stat", {
      playerName: playerName,
      game: game,
      recentWin: recentWin,
      recentPosition: recentPosition,
      recentWinRate: recentWinRate,
    });
    // recentWin = 최근 n개 경기 승/패를 true/false로 기록

    // res.json(recentMatches[0].info.participants[0].win);

    //매치를 10개 불러와서 > info의 puuid가 일치하는 플레이어 매치정보만 가져옴 > win을 배열에 담음 && 포지션을 배열에 담음

    // res.json({ recentMatches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
