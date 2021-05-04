var express = require('express');
var router = express.Router();
const hbs = require('hbs')
const pool = require('../db/db');

let result = [];



hbs.registerHelper('list', (ctx, opt) => {
    var ret = "";

    for(var i=0, j=ctx.length; i<j; i++) {
      ret = ret + "<tr>" + opt.fn(ctx[i]) + "</tr>";
    }
    if (!ctx.length) {
        ret = '<tr>' + '<td colspan="3" align="center">По вашему запросу ничего не найдено...</td>' + '</tr>'
    }

    return ret;
})

/* GET results listing. */
router.post('/', function(req, response, next) {
    console.log(req.body)
 const name = req.body.name || ''
    pool.execute(`select * from centers where name like '%${name}%';`)
    .then(res => {
        result = res[0];
        response.render('results', {result})
    })
    .catch(err => {
        console.log(err.message)
    })
})

module.exports = router;
