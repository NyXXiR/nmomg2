var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");
/* mybatis $ npm i mybatis-mapper */
const mybatisMapper = require("mybatis-mapper");
mybatisMapper.createMapper(["./mybatis/mainMapper.xml"]);

/* mybatis query */
var format = { language: "sql", indent: " " };

/* mysql */
var mysql = require("../config/mysql/db");

function generateRandomCode(n) {
  let str = "";
  for (let i = 0; i < n; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
}

module.exports = {
  /* -----------------------auth 메소드 시작 -----------------------*/
  //쿼리 조회 후 결과 전송하는 메소드
  getAllUser: function (req, res, next) {
    var param = {
      seq: req.params.seq,
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "getAllQuery",
      param,
      format
    );
    console.log(query);
    mysql.query(query, (error, rows) => {
      console.log(rows);

      var rowList = [];
      for (var data of rows) {
        rowList.push(data);
      }
      res.json(rowList);
    });
  },

  //회원가입
  insertMember: function (req, res, next) {
    console.log(req.body.id);
    var param = {
      id: req.body.id,
      pw: req.body.pw,
      nickname: req.body.id + "#" + generateRandomCode(4),
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "insertMember",
      param,
      format
    );
    console.log(query);
    mysql.query(query, (error, result) => {
      if (error) throw error;
      console.log("입력되었습니다.");
      res.render("pages/auth/join_success");
    });
  },

  kakaoInsertMember: function (req, res, next) {
    console.log(req.body.id);
    var param = {
      id: req.session.kakao_id,
      nickname: "임시닉네임" + "#" + generateRandomCode(4),
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "kakaoInsertMember",
      param,
      format
    );
    console.log(query);
    mysql.query(query, (error, result) => {
      if (error) throw error;
      console.log("회원가입되었습니다.");
      res.render("pages/auth/join_success");
    });
  },

  //가입시 id 중복여부 체크
  memberIdCheck: function (req, res, next) {
    var param = {
      id: req.body.id,
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "memberIdCheck",
      param,
      format
    );
    mysql.query(query, (error, result) => {
      if (error) throw error;
      res.json(result);
    });
  },

  //로그인가능여부 + 회원정보 조회
  loginCheck: function (req, res, next) {
    var param = {
      id: req.body.id,
      pw: req.body.pw,
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "loginCheck",
      param,
      format
    );
    mysql.query(query, (error, result) => {
      if (error) throw error;
      if (result[0] !== undefined) {
        /* 로그인회원정보를 세션에 기입 */
        console.log(req.session);

        req.session.user_seq = result[0].seq;
        req.session.user_id = result[0].id;
        req.session.nickname = result[0].nickname;
        res.cookie("isLogined", true);
        res.cookie("nickname", result[0].nickname);
        req.session.save(function () {
          res.redirect("/");
        });
      } else {
        res.render("pages/auth/login");
      }
    });
  },

  /* 카카오 로그인 */

  //인가코드를 요청
  getKakaoLoginUrl: function (req, res, next) {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
      client_id: "a3f9c0bf60a1f00f9edaef98b434f578",
      redirect_uri: "http://localhost/auth/kakao/finish",
      response_type: "code",
    };
    if (process.env.NODE_ENV === "production") {
      config.redirect_uri = "https://nmomg.com/auth/kakao/finish";
    }
    const params = new URLSearchParams(config).toString();

    const finalUrl = `${baseUrl}?${params}`;
    console.log(finalUrl);
    return res.redirect(finalUrl);
  },

  finishKakaoLogin: async function (req, res, next) {
    const baseUrl = "https://kauth.kakao.com/oauth/token";
    const config = {
      client_id: "a3f9c0bf60a1f00f9edaef98b434f578",
      client_secret: "1r71pT88Rr7nFrCl3bLBRR1yb8DozX6d",
      grant_type: "authorization_code",
      redirect_uri: "http://localhost/auth/kakao/finish",
      code: req.query.code,
    };
    if (process.env.NODE_ENV === "production") {
      config.redirect_uri = "https://nmomg.com/auth/kakao/finish";
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const kakaoTokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-type": "application/json", // 이 부분을 명시하지않으면 text로 응답을 받게됨
        },
      })
    ).json();
    console.log(kakaoTokenRequest);
    //만약 토큰을 받는 데 성공했다면 토큰을 사용함
    if ("access_token" in kakaoTokenRequest) {
      // 엑세스 토큰이 있는 경우 API에 접근
      const { access_token } = kakaoTokenRequest;
      const userRequest = await (
        await fetch("https://kapi.kakao.com/v2/user/me", {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-type": "application/json",
          },
        })
      ).json();
      console.log(userRequest.id);
      console.log(userRequest.properties.nickname);
      console.log(userRequest.properties.thumbnail_image);
      req.session.kakao_id = userRequest.id;
      req.session.access_token = access_token;
      //실행순서를 보장하려면 리다이렉트가 save 안에 있어야 함
      req.session.save(function (err) {
        if (err) throw err;
        return res.redirect("/auth/kakao/loginProcess");
      });
    } else {
      // 엑세스 토큰이 없으면 로그인페이지로 리다이렉트
      return res.redirect("/auth/login");
    }
  },
  /*카카오에서 제공한 id를 바탕으로 로그인/회원가입을 진행하는 메소드 */
  connectKakaoId: function (req, res, next) {
    //세션의 id 정보 조회, 정보 없으면 뱉음
    if (req.session.kakao_id) {
      var param = {
        id: req.session.kakao_id,
      };
    } else {
      return res.send("세션에 카카오톡 정보가 존재하지 않습니다.");
    }

    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "kakaoLoginCheck",
      param,
      format
    );

    mysql.query(query, (error, result) => {
      if (error) throw error;
      console.log("result: ==========" + result);

      if (result == "") {
        console.log("값이 비어있습니다. 회원가입 진행");
        this.kakaoInsertMember(req, res, next);
      } else {
        req.session.user_seq = result[0].seq;
        req.session.user_id = result[0].id;
        req.session.nickname = result[0].nickname;
        res.cookie("isLogined", true);
        res.cookie("nickname", result[0].nickname);
        req.session.save(function () {
          res.redirect("/");
        });
      }
    });

    //쿼리 조회값이 있다면 해당 아이디로 로그인, 없다면 회원가입
  },

  //세션에 토큰이 있어야만 로그아웃이 가능하다.
  kakaoLogout: async function (req, res, next) {
    console.log(req.session.access_token);
    const baseUrl = "https://kapi.kakao.com/v1/user/unlink";
    const config = {
      "content-type": "application/x-www-form-urlencoded",
      target_id_type: "user_id",
      target_id: req.session.kakao_id,
      Authorization: `Bearer ${req.session.access_token}`,
      client_id: "a3f9c0bf60a1f00f9edaef98b434f578",
      redirect_uri: "http://localhost/auth/kakao/finish",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const kakaoTokenRequest = await (
      await fetch(finalUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${req.session.access_token}`,
          "content-type": "application/x-www-form-urlencoded",
        },
      })
    ).json();
    console.log(kakaoTokenRequest);
    console.log("카카오 로그아웃!!!!");
  },

  /* -----------------------auth 메소드 끝 -----------------------*/

  /* -----------------------board 메소드 시작 -----------------------*/
  selectBoardByCategory: function (req, res, next) {
    var param = {
      category: req.params.category,
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "selectBoardByCategory",
      param,
      format
    );
    mysql.query(query, (error, result) => {
      console.log(result);

      res.render("pages/board/list", {
        category: req.params.category,
        result: result,
      });
    });
  },

  selectIdAndTierBySeqAndCategory: (seq, category) => {
    var param = {
      seq: seq,
      category: category,
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "selectIdAndTierBySeqAndCategory",
      param,
      format
    );
    mysql.query(query, (error, result) => {
      console.log(result);
    });
  },
};
