var express = require("express");
var router = express.Router();
const cors = require("cors");
/* mybatis $ npm i mybatis-mapper */
const mybatisMapper = require("mybatis-mapper");
mybatisMapper.createMapper(["./mybatis/testMapper.xml"]);

/* 조회할 내용 */
var param = {
  boardNum: "1",
};

/* mybatis query */
var format = { language: "sql", indent: " " };
var query = mybatisMapper.getStatement(
  "sqlMapper",
  "getAllQuery",
  param,
  format
);

const mysql = require("../mysql/db"); // mysql 모듈 로드

//미들웨어 목록
router.use(cors());

//여기가 컨트롤러 격인 것 같음

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

<<<<<<< HEAD
router.get('/test', function(req, res, next) {
	res.send('Hello World!');
  });


router.get('/hanpy/:id', (req,res) => {
	res.json({id: req.params.id});

=======
router.get("/hanpy/:id", (req, res) => {
  res.json({ id: req.params.id });
});

router.get("/mybatisTest1/:boardNum", (req, res, next) => {
  var param = {
    boardNum: req.params.boardNum,
  };
  var query = mybatisMapper.getStatement(
    "sqlMapper",
    "getAllQuery",
    param,
    format
  );
  mysql.query(query, (error, rows) => {
    console.log(rows);
    res.json(rows);
>>>>>>> d9ad9b11bfdcacc4c3b3477fb56d4cf7647f0932
  });
});

module.exports = router;
