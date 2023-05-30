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
  getKakaoLoginUrl: function (req, res, next) {
    const baseUrl = "https://kauth.kakao.com/oauth/authorize";
    const config = {
      client_id: "a3f9c0bf60a1f00f9edaef98b434f578",
      redirect_uri: "http://localhost/auth/kakao/finish",
      response_type: "code",
    };
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
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const kakaoTokenRequest = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-type": "application/json", // 이 부분을 명시하지않으면 text로 응답을 받게됨
      },
    });
    const json = await kakaoTokenRequest.json();
    console.log(json);
    res.send(JSON.stringify(json)); // 프론트엔드에서 확인하려고
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
};
