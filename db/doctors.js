const pool = require('../db/db');

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

const doctors = {
    getAllDoctors: async (req, res, next) => {
        const result =
            await pool.execute(`select d.*, g.name as gender, sp.name as spec from doctors d
    join gender g on g.id = d.id_gender
    join specializations sp on sp.id = d.id_specialization;`);

        const json = { doctors: result[0] };

        res.render('doctors', json);
    },

    editDoctor: async (req, res, next) => {
        const json = await getDoctor(req.params.id);
        res.render('edit_doctor', json);
    },
    addDoctor: async (req, res, next) => {
        const json = await getDoctor();
        res.render('edit_doctor', json);
    },

    deleteDoctor: async (req, res, next) => {
        await pool.execute(`delete from doctors where id=${req.body.id}`);

        res.redirect('/admin/doctors');
    },

    updateDoctor: async (req, res, next) => {
        const data = req.body;
        if (data.id) {
            await pool.execute(
                `update doctors set full_name=?, id_gender=?, id_specialization=? where id=?`,
                [
                    data.full_name,
                    data.id_gender,
                    data.id_specialization,
                    data.id,
                ],
            );
        } else {
            await pool.execute(
                'insert into doctors(full_name, id_gender, id_specialization) values(?,?,?)',
                [data.full_name, data.id_gender, data.id_specialization],
            );
        }
        res.redirect('/admin/doctors');
    },
};

module.exports = doctors;
