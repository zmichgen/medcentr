const pool = require('../db/db');

const getAllRowsSQL = `select
he.name,
he.address,
he.phone,
ac.name as age,
te.type as type ,
group_concat(s.name) as services
from  services_by_entities se
join health_entities he on he.id = se.id_entity
join age_categories ac on ac.id = he.id_age_category
join type_entity te on te.id = he.id_type
join services s on s.id = se.id_service;`;
