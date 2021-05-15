const pool = require('../db/db');

async function getService(id) {
    let service = {
        id: null,
        name: '',
        direction_id: 1,
    };
    let result;
    if (id) {
        result = await pool.execute(`select * from services where id=${id}`);
        service = result[0][0];
    }
    result = await pool.execute('select * from directions');
    const directions = result[0].map((i) => {
        if (i.id === service.direction_id) {
            i.selected = 'selected';
        }
        return i;
    });

    return { service, directions };
}

const services = {
    getAllServices: async (req, res, next) => {
        const result = await pool.execute(
            `select s.*, d.name as direction from services s join directions d on s.direction_id = d.id`,
        );

        const json = { services: result[0] };

        res.render('services', json);
    },

    editService: async (req, res, next) => {
        const json = await getService(req.params.id);
        console.log(json);
        res.render('edit_service', json);
    },
    addService: async (req, res, next) => {
        const json = await getService();
        res.render('edit_service', json);
    },

    deleteService: async (req, res, next) => {
        await pool.execute(`delete from services where id=${req.body.id}`);

        res.redirect('/admin/services');
    },

    updateService: async (req, res, next) => {
        const data = req.body;
        if (data.id) {
            await pool.execute(
                `update services set name=?, direction_id=? where id=?`,
                [data.name, data.direction_id, data.id],
            );
        } else {
            await pool.execute(
                'insert into services(name, direction_id) values(?,?)',
                [data.name, data.direction_id],
            );
        }
        res.redirect('/admin/services');
    },
};

module.exports = services;
