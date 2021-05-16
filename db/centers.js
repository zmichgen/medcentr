const pool = require('../db/db');

// получение списка центров
async function getCenter(id) {
    let center = {
        id: null,
        id_type: 1,
        name: '',
        address: '',
        phone: '',
        id_age_category: 1,
    };
    let services = [];
    if (id) {
        let res = await pool.execute(
            `select * from health_entities where id=${id};`,
        );
        center = res[0][0];
        res = await pool.execute(`select se.*, s.name, d.full_name as doctor
    from services_by_entities se
    join doctors d on se.id_doctor = d.id
    join services s on s.id = se.id_service and se.id_entity = ${id};`);
        services = res[0];
    }

    res = await pool.execute('select * from type_entity');
    const type = res[0].map((i) => {
        if (i.id === center.id_type) {
            i.selected = 'selected';
        }
        return i;
    });

    res = await pool.execute('select * from age_categories');
    const cat = res[0].map((i) => {
        if (i.id === center.id_age_category) {
            i.selected = 'selected';
        }
        return i;
    });

    return { center, cat, type, services };
}

// получение услуги для центра
async function getService(service_id, center_id) {
    let service = {
        id: null,
        name: '',
        direction_id: 1,
    };

    let result;

    if (service_id) {
        result = await pool.execute(
            `select se.*, s.name  from services_by_entities se
            join services s on s.id = se.id_service
            where se.id=${service_id}`,
        );
        service = result[0][0];
    }

    result = await pool.execute('select * from directions');
    const directions = result[0].map((i) => {
        if (i.id === service.direction_id) {
            i.selected = 'selected';
        }
        return i;
    });

    result = await pool.execute('select * from services');
    const services = result[0].map((i) => {
        if (i.id === service.id_service) {
            i.selected = 'selected';
        }
        return i;
    });

    result = await pool.execute(
        `select * from health_entities where id=${center_id}`,
    );
    const center = result[0][0];

    result = await pool.execute(`select * from type_services`);

    const types = result[0].map((i) => {
        if (i.id === service.id_type_service) {
            i.selected = 'selected';
        }
        return i;
    });

    result = await pool.execute(
        `select d.*, s.name as specialization from doctors d join specializations s on s.id = d.id_specialization;`,
    );
    const doctors = result[0].map((i) => {
        if (i.id === service.id_doctor) {
            i.selected = 'selected';
        }
        return i;
    });
    return { service, directions, services, center, types, doctors };
}

const centers = {
    // получить список всех центров
    getAllCenters: async (req, res, next) => {
        const result =
            await pool.execute(`select he.*, ac.name as category, te.type as type FROM health_entities he
join age_categories ac on ac.id = he.id_age_category
join type_entity te on te.id = he.id_type`);

        const json = { centers: result[0] };

        res.render('centers', json);
    },

    // редактирование информации о центре
    editCenter: async (req, res, next) => {
        const json = await getCenter(req.params.id);
        res.render('edit_center', json);
    },

    // добавить центр
    addCenter: async (req, res, next) => {
        const json = await getCenter();
        res.render('edit_center', json);
    },

    updateCenter: async (req, res, next) => {
        console.log(req.body);
        const { id, name, address, phone, id_age_category, id_type } = req.body;
        if (id) {
            try {
                await pool.execute(
                    'update health_entities set name=?, phone=?, address=?, id_age_category=?, id_type=? where id=?',
                    [name, phone, address, id_age_category, id_type, id],
                );
            } catch (err) {
                console.error(err.message);
            }
        } else {
            try {
                await pool.execute(
                    'insert into health_entities (name, phone, address, id_age_category, id_type) values (?,?,?,?,?)',
                    [name, phone, address, id_age_category, id_type],
                );
            } catch (err) {
                console.error(err.message);
            }
        }
        res.redirect('/admin/centers');
    },

    // удаление центра
    deleteCenter: async (req, res, next) => {
        await pool.execute(
            `delete from services_by_entities where id_entity = ${req.body.id}`,
        );
        await pool.execute(
            `delete from health_entities where id =${req.body.id}`,
        );
        res.redirect('/admin/centers');
    },

    // редактирование услуги в центре
    editService: async (req, res, next) => {
        const service_id = req.params.id;
        const center_id = req.params.center_id;
        const json = await getService(service_id, center_id);
        res.render('edit_centers_service', json);
    },

    // создание услуги в центре
    addService: async (req, res, next) => {
        const center_id = req.params.id;
        const json = await getService(null, center_id);
        res.render('edit_centers_service', json);
    },

    // сохранение данных об услуге в центре
    updateServiceInCenter: async (req, res, next) => {
        const { service_id, doctor_id, center_id, type_id, price, id } =
            req.body;
        if (id) {
            await pool.execute(
                `update services_by_entities
            set id_entity=?,
            id_service=?,
            price=?,
            id_type_service=?,
            id_doctor=?
            where id=?
            `,
                [center_id, service_id, price || 0, type_id, doctor_id, id],
            );
        } else {
            await pool.execute(
                `insert into services_by_entities (id_entity, id_service, price, id_type_service, id_doctor)
            values (?,?,?,?,?)`,
                [center_id, service_id, price || 0, type_id, doctor_id],
            );
        }

        res.redirect(`/admin/centers/edit/${center_id}`);
    },

    // удаление услуги из центра
    deleteServiceInCenter: async (req, res, next) => {
        const { id, center_id } = req.body;
        await pool.execute(`delete from services_by_entities where id=${id}`);
        res.redirect(`/admin/centers/edit/${center_id}`);
    },
};

module.exports = centers;
