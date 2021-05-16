const pool = require('../db/db');

let lastJson = null;

const getAllEntries = `select
he.*,
ac.name as category,
te.type
from  health_entities he
join age_categories ac on ac.id = he.id_age_category
join type_entity te on te.id = he.id_type;
`;

function getEntries(data) {
    const { service_id, service_type_id, category_id, gender_id } = data;
    let whereService = service_id.includes('Все')
        ? ''
        : `where se.id_service = ${service_id}`;

    whereService = service_type_id.includes('Все')
        ? whereService + ''
        : whereService + ` and se.id_type_service = ${service_type_id}`;

    const category = category_id.includes('Все')
        ? ''
        : `and ac.id = ${category_id}`;
    const doctors = gender_id.includes('Все')
        ? ''
        : `and d.id_gender = ${gender_id}`;

    const sqlRequest = `select distinct he.id, he.name, he.address, he.phone, te.type, ac.name as category from health_entities he
    join (select se.* from services_by_entities se ${whereService} ) se1 on se1.id_entity = he.id
    join type_entity te on te.id = he.id_type
    join doctors d on se1.id_doctor = d.id ${doctors}
    join age_categories ac on ac.id = he.id_age_category ${category}`;
    return sqlRequest;
}

const search = {
    getEntries: async (req, res, next) => {
        let result;
        let centers = [];

        // если все параметры запроса содержат слово Все
        if (Object.values(req?.body).every((i) => i.includes('Все'))) {
            result = await pool.execute(getAllEntries);
            centers = result[0];
        } else {
            result = await pool.execute(getEntries(req.body));
            centers = result[0];
        }

        const json = { centers };
        console.log(json);
        lastJson = json;
        res.render('results', json);
    },

    getEntry: async (req, res, next) => {
        const id = req.params.id;
        console.log(id);
        let result = await pool.execute(`select
        he.*,
        ac.name as category,
        te.type
        from  health_entities he
        join age_categories ac on ac.id = he.id_age_category
        join type_entity te on te.id = he.id_type
        where he.id = ${id}`);
        const center = result[0][0];
        result =
            await pool.execute(`select s.name, d.full_name as doctor, sp.name as specialization, se.price, ts.type
        from services_by_entities se
        join services s on s.id = se.id_service
        join doctors d on d.id = se.id_doctor
        join type_services ts on ts.id = se.id_type_service
        join specializations sp on sp.id = d.id_specialization
        where se.id_entity = ${id}`);
        const services = result[0];
        const json = { center, services };
        res.render('result_detail', json);
    },

    goToPreviousPage: async (req, res, next) => {
        if (!lastJson) {
            result = await pool.execute(getAllEntries);
            centers = result[0];
            res.render('results', { centers });
        } else {
            console.log(lastJson);
            res.render('results', lastJson);
        }
    },
};

module.exports = search;
