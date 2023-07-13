var fetch = require("node-fetch");
var schedule = require("node-schedule");
/* mybatis $ npm i mybatis-mapper */
const mybatisMapper = require("mybatis-mapper");
mybatisMapper.createMapper(["./mybatis/mainMapper.xml"]);

/* mybatis query */
var format = { language: "sql", indent: " " };

/* mysql */
var mysql = require("../config/mysql/db");

// function generateRandomCode(n) {
//   let str = "";
//   for (let i = 0; i < n; i++) {
//     str += Math.floor(Math.random() * 10);
//   }
//   return str;
// }

async function selectBoardSeqByMax() {
  return new Promise((resolve, reject) => {
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "selectBoardSeqByMax",
      format
    );
    mysql.query(query, (err, result) => {
      if (err) reject(err);
      resolve(result[0].boardSeq);
    });
  });
}

module.exports = {
  selectBoardByCategoryAndGame: function (req, res, next) {
    var param = {
      category: req.params.category,
      game: req.params.game,
    };
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "selectBoardByCategoryAndGame",
      param,
      format
    );
    mysql.query(query, (err, result) => {
      console.log(result);

      res.render("pages/board/list", {
        category: req.params.category,
        game: req.params.game,
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
    mysql.query(query, (err, result) => {
      console.log(result);
    });
  },

  //category, game으로 구분되는 게시판에 board insert하는 메소드
  //일단 입력받은 내용을 insert, 그리고 15분 뒤에 isExpired를 0>1로 변경한다.

  insertBoard: (param) => {
    var query = mybatisMapper.getStatement(
      "sqlMapper",
      "insertBoard",
      param,
      format
    );
    mysql.query(query, (err, result) => {
      if (err) throw err;
      console.log(result);
    });
  },
  willExpired: async function () {
    //방금 게시한 board의 seq를 구한다(max활용)

    var boardSeq = await selectBoardSeqByMax();

    //만약 category가 community가 아니라면 아까 찾은 seq행의 isExpired를 1로 만드는 쿼리를 예약한다.
    const reservation = schedule.scheduleJob(
      new Date(Date.now() + 15 * 60 * 1000),
      async () => {
        var param = { boardSeq: boardSeq };
        var query = mybatisMapper.getStatement(
          "sqlMapper",
          "updateIsExpired",
          param,
          format
        );
        mysql.query(query, (err, result) => {
          if (err) throw err;
          console.log(result);
        });

        console.log("willExpired 끝");
      }
    );
  },
};
