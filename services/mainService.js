var express = require("express");
var router = express.Router();

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
        req.session.save(function () {
          res.redirect("/");
        });
      } else {
        res.send("입력한 정보와 일치하는 회원정보가 없습니다.");
      }
    });
  },
};
