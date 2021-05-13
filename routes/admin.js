const express = require('express');
var router = express.Router();

const pool = require('../db/db');

/**
 *
 * получение
 */
async function getJson() {
    let result =
        await pool.execute(`select he.*, ac.name as category, te.type as type FROM health_entities he
    join age_categories ac on ac.id = he.id_age_category
    join type_entity te on te.id = he.id_type`);
    const centers = result[0];
    result = await pool.execute(`select * from services`);
    const services = result[0];
    result =
        await pool.execute(`select d.*, g.name as gender, sp.name as spec from doctors d
    join gender g on g.id = d.id_gender
    join specializations sp on sp.id = d.id_specialization;`);
    const doctors = result[0];
    return { centers, services, doctors };
}

router.get('/centers', function (req, res, next) {
    getJson()
        .then((json) => {
            res.render('centers', json);
        })
        .catch((err) => console.error(err.message));
});

router.get('/services', function (req, res, next) {
    getJson()
        .then((json) => {
            res.render('services', json);
        })
        .catch((err) => console.error(err.message));
});

router.get('/doctors', function (req, res, next) {
    getJson()
        .then((json) => {
            res.render('doctors', json);
        })
        .catch((err) => console.error(err.message));
});

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
            `select * from health_entities where id=${id}`,
        );
        center = res[0][0];
        res = await pool.execute(`select se.*, s.name, d.full_name as doctor
    from services_by_entities se
    join doctors d on se.id_doctor = d.id
    join services s on s.id = se.id_service and se.id = ${id}`);
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
router.get('/centers/edit/:id', function (req, res, next) {
    getCenter(req.params.id)
        .then((json) => {
            res.render('editcenter', json);
        })
        .catch((err) => console.error(err.message));
});

router.get('/centers/add', function (req, res, next) {
    getCenter()
        .then((json) => {
            res.render('editcenter', json);
        })
        .catch((err) => console.error(err.message));
});
async function deleteCenter(id) {
    await pool.execute(
        `delete from services_by_entities where id_entity = ${id}`,
    );
    await pool.execute(`delete from health_entities where id =${id}`);
    return 'done';
}

router.post('/centers/delete', function (req, res, next) {
    deleteCenter(req.body.id)
        .then((json) => {
            res.redirect('/admin/centers');
        })
        .catch((err) => console.error(err.message));
});

async function update(data) {
    if (data.id) {
        await pool.execute(
            `update doctors set full_name=?, id_gender=?, id_specialization=? where id=?`,
            [data.full_name, data.id_gender, data.id_specialization, data.id],
        );
    } else {
        await pool.execute(
            'insert into doctors(full_name, id_gender, id_specialization) values(?,?,?)',
            [data.full_name, data.id_gender, data.id_specialization],
        );
    }
}
router.post('/doctors', function (req, res, next) {
    update(req.body)
        .then(() => {
            res.redirect('/admin/doctors');
        })
        .catch((err) => console.error(err.message));
});

// edit doctor
async function getDoctor(id) {
    let doctor = {
        id: null,
        name: null,
        spec_id: 1,
        center_id: 1,
    };
    if (id) {
        let res = await pool.execute(`select * from doctors where id = ${id}`);
        doctor = res[0][0];
    }

    res = await pool.execute('select * from gender');
    const gender = res[0].map((i) => {
        if (i.id === doctor.id_gender) {
            i.selected = 'selected';
        }
        return i;
    });

    res = await pool.execute('select * from specializations');
    const spec = res[0].map((i) => {
        if (i.id === doctor.id_specialization) {
            i.selected = 'selected';
        }
        return i;
    });
    return { doctor, spec, gender };
}
router.get('/doctors/edit/:id', function (req, res, next) {
    const id = req.params.id;
    getDoctor(id)
        .then((json) => {
            res.render('editdoctor', json);
        })
        .catch((err) => console.error(err.message));
});
// delete doctor
router.post('/doctors/delete', function (req, res, next) {
    const id = req.body.id;
    pool.execute(`delete from doctors where id=${id}`)
        .then(() => {
            res.redirect('/admin/doctors');
        })
        .catch((err) => console.error(err.message));
});

router.get('/doctors/add', function (req, res, next) {
    getDoctor().then((json) => {
        res.render('editdoctor', json);
    });
});

module.exports = router;
