var express = require('express');
var router = express.Router();
const hbs = require('hbs')

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
router.post('/', function(req, res, next) {
   console.log(req.body);
   result = [
    {num: 1,name: 'Больница 1', address: "Брест"},
    {num: 2,name: 'Больница 2', address: "Несвиж"},
    {num: 3,name: 'Больница 3', address: "Минск"}
 ]
   next();

}, function (req, res) {

    res.render('results', {result})

});

module.exports = router;
