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

module.exports = {
  getLeaderboardId: function (nation, season, leaderboard, howMany) {
    var nation = nation;
    var season = season;
    var leaderboard = leaderboard;
    const baseUrl = `https://kr.api.blizzard.com/data/d3/season/${season}/leaderboard/${leaderboard}`;

    var config = {
      access_token: "KRCUJKWU7ZWn4DgEFEb3dVBUWLGOXa7wab",
    };

    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    async function getLeaderboardData(finalUrl) {
      try {
        const response = await fetch(finalUrl);
        if (!response.ok) {
          throw new Error("API 요청에 실패했습니다.");
        }

        const data = await response.json();
        // 데이터 처리
        // ...

        return data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }

    getLeaderboardData(finalUrl)
      .then((data) => {
        res.send(data);
        // 데이터 사용
        // ...
      })
      .catch((error) => {
        // 오류 처리
        // ...
      });

    /*access token이 유출될 수 있으므로 주석 처리해둠 */
    // console.log(finalUrl);
    //이제 저 url로 get 요청을 async로 보내고 받은 다음에 데이터를 가공한다.
  },
};
