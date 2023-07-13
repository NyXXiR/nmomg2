const key = require("../config/secrets/key");
var fetch = require("node-fetch");
/* mybatis $ npm i mybatis-mapper */
const mybatisMapper = require("mybatis-mapper");
mybatisMapper.createMapper(["./mybatis/mainMapper.xml"]);

/* mybatis query */
var format = { language: "sql", indent: " " };

/* mysql */
var mysql = require("../config/mysql/db");

/* api key */
const api_key = key.RIOT_API_KEY;

module.exports = {
  //롤 전적검색 서비스 > 입력한 id로부터 puuid 추출
  //추출한 puuid로부터 전적을 조회. 테스트 id를 입력하면 테스트 json으로 연결되게 하기

  avg: (arr) => {
    return (arr.reduce((acc, cur) => acc + cur) / arr.length) * 100 + "%";
  },

  getPuuidByPlayerName: async (playerName, region) => {
    const url = `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${playerName}`;
    const headers = {
      "X-Riot-Token": api_key,
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("API 요청 중 오류가 발생했습니다");
      }
      const data = await response.json();
      return data.puuid;
    } catch (error) {
      console.error("API 요청 중 오류가 발생했습니다:", error.message);
      throw new Error("API 요청 중 오류가 발생했습니다");
    }
  },

  getRecentMatches: async (puuid, region) => {
    const url = `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10`;
    const headers = {
      "X-Riot-Token": api_key,
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("API 요청 중 오류가 발생했습니다");
      }
      const matchIds = await response.json();
      const matchDetails = await Promise.all(
        matchIds.map(async (matchId) => {
          const matchUrl = `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
          const matchResponse = await fetch(matchUrl, { headers });
          if (!matchResponse.ok) {
            throw new Error("API 요청 중 오류가 발생했습니다");
          }
          const matchData = await matchResponse.json();
          return matchData;
        })
      );
      return matchDetails;
    } catch (error) {
      console.error("API 요청 중 오류가 발생했습니다:", error.message);
      throw new Error("API 요청 중 오류가 발생했습니다");
    }
  },
};
