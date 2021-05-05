const express = require("express");
var router = express.Router();

// импорт коннектора к базе данных
const pool = require('../db/db');

// sql запрос - справочник видов услуг
const getServiceTypes = `select * from service_types`

// функция получения справочников из БД возвращает JSON со справочниками
async function getJson() {

  // получение справочника видов услуг из БД
  const req = await pool.execute(getServiceTypes)
  const service_types = req[0]
  //----------------------------

  // возвращаем справочники в виде полей объекта (JSON)
  return {service_types}
}

/* GET home page. */
router.get('/', function(req, res, next) {
// получаем json со справочниками
  getJson()
  .then(json => {
    console.log(json)
    /**
     * отдаем справочники на темплейт index.hbs ,
     * рендерим страницу index.html,
     * отправляем index.html в браузер
     *
     */
    res.render('index', json);
  })

});

module.exports = router;
