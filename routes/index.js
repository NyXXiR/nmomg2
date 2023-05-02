var express = require('express');
var router = express.Router();
const cors = require('cors');

//여기가 컨트롤러 격인 것 같음

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hanpy/:id', (req,res) => {
	res.json({id: req.params.id});
  });

module.exports = router;
