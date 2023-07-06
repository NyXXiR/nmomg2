/*

https://us.api.blizzard.com/{여기에 파라미터 값들 입력}

1. 리더보드 캐릭터 조회
region: kr로 고정
season: 28이 제일 최근. 가장 높은 값을 고르게 설정
leaderboard: 어떤 분야를 고를 것인지. 대균열+직업을 기준으로 설정
(rift_barbarian, rift_sorcerer 등)


data/

2. 캐릭터 스킬 조회

3. 캐릭터 아이템 조회

+@ 추종자 조회도 하면 좋겠는데 피곤함



*/

//region, season, leaderboard 입력하면 오는 등수를 반환받아서 n명의 배틀태그(account), heroId를 조회하는 함수
var express = require("express");
var router = express.Router();
const key = require("../config/secrets/key");
var axios = require("axios");
const fetch = require("node-fetch");

//일단 key를 써서 토큰을 구하는 함수 만들고
//토큰을 세트해주는 setToken 만들어서 쓰자

module.exports = {
  getBlizzardAPIToken: async function () {
    try {
      const clientId = key.BLIZZARD_CLIENT_ID; // 클라이언트 ID를 실제 값으로 대체해야 합니다.
      console.log(clientId);
      const clientSecret = key.BLIZZARD_SECRET; // 클라이언트 시크릿을 실제 값으로 대체해야 합니다.

      const tokenUrl = "https://us.battle.net/oauth/token";

      const response = await fetch(tokenUrl, {
        method: "POST",
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      /* axios 자체 오류가 발생해서 fetch로 대체 */
      // const response = await axios.post(tokenUrl, null, {
      //   params: {
      //     grant_type: "client_credentials",
      //     client_id: clientId,
      //     client_secret: clientSecret,
      //   },
      // });

      if (response.status !== 200) {
        throw new Error("API 토큰 요청에 실패했습니다.");
      }
      const responseData = await response.json(); // 응답 데이터를 JSON으로 파싱합니다.
      const { access_token } = responseData; // access_token을 추출합니다.
      console.log("액세스 토큰이 들어왔음: " + access_token);
      return access_token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getLeaderboardId: async function (nation, season, leaderboard, howMany) {
    var nation = nation;
    var season = season;
    var leaderboard = leaderboard;
    var access_token = await this.getBlizzardAPIToken();
    const baseUrl = `https://kr.api.blizzard.com/data/d3/season/${season}/leaderboard/${leaderboard}`;

    var config = {
      access_token: access_token,
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);

    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error("API 요청에 실패했습니다.");
    }
    const data = await response.json();
    console.log(data);
    return data;

    // async function getLeaderboardData(finalUrl) {
    //   try {
    //     const response = await fetch(finalUrl);
    //     if (!response.ok) {
    //       throw new Error("API 요청에 실패했습니다.");
    //     }
    //     return response.json();
    //   } catch (error) {
    //     console.error(error);
    //     throw error;
    //   }
    // }

    // await getLeaderboardData(finalUrl)
    //   .then((data) => {
    //     console.log("에이싱크 작동하는지 확인.");
    //     console.log(data);
    //     return data;
    //     // 데이터 사용
    //     // ...
    //   })
    //   .catch((error) => {
    //     // 오류 처리
    //     // ...
    //   });
  },
};
