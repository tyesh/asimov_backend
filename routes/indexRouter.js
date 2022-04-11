var express = require('express');
let router = express.Router();

router.get('/', function(req, res) {
    res.json("Hello Lincoln");
});

module.exports = router;