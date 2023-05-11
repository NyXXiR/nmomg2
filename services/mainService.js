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
      res.render("pages/auth/join_success");
    });
  },
};
