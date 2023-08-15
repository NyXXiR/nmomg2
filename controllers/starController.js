var express = require("express");
var router = express.Router();
var mainService = require("../services/mainService");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

module.exports = router;

//각 유저의 평판을 조회할 수 있는 기능 모음
