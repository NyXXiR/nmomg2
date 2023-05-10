var express = require("express");
var router = express.Router();
var mainController = require("../controllers/mainController");
const cors = require("cors");

//미들웨어 목록
router.use(cors());

module.exports = router;
