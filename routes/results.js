var express = require('express');
var router = express.Router();
const pool = require('../db/db');

let result = [];

/**
 * функция создающая SQL запрос в зависимости от данных, пришедших из формы
 * @param {*} data - объект поля которого содержат данные из инпутов формы (поле name в инпуте)
 * @returns SQL запрос
 */
function createSQL(data) {
    let where = '';
    // вид услуг
    const { service_type, name, service_id } = data;

    if (name) {
        where = !where
            ? `where centers.name like '%${name}%'`
            : `${where} AND centers.name like '%${name}%'`;
    }
    if (service_type) {
        // если есть вид услуг - выбираем только с тем видом, который указан
        where = !where
            ? `where centers.service_type_id = ${service_type}`
            : `${where} AND centers.service_type_id = ${service_type}`;
    }
    // возврат всех значений из БД
    const result = `select centers.*, group_concat(services1.name) as serviceList, service_types.name as serviceType from centers
    join service_types on centers.service_type_id = service_types.id
    join centers_services centers_services1 on centers.id = centers_services1.center_id
    join services services1 on services1.id = centers_services1.service_id
    join centers_services centers_services2 on centers_services2.center_id = centers.id
    join services services2 on services2.id = centers_services2.service_id and services2.id = ${service_id}
    ${where}
    group by centers.id;`;
    return result;
}

/* GET results listing. */
router.post('/', function (req, response, next) {
    // получаем тело запроса (данные из формы)
    const sql = createSQL(req.body);
    // выполняем SQL запрос
    pool.execute(sql)
        .then((res) => {
            // получаем данные из БД
            result = res[0].map((i) => ({
                ...i,
                serviceList: i.serviceList.split(','),
            }));
            console.log(result);
            // рендерим страницу results.html с данными из БД и отправляем в браузер
            response.render('results', { result });
        })
        .catch((err) => {
            console.log(err.message);
        });
});

module.exports = router;
