const express = require('express');
const router = express.Router();

const centers = require('../db/centers'); // контроллер для медцентров
const services = require('../db/services'); // контроллер для услуг
const doctors = require('../db/doctors'); // контроллер для врачей

router.get('/centers', centers.getAllCenters.bind(this)); // все медцентры
router.get('/centers/edit/:id', centers.editCenter.bind(this)); // открыть карточку редактирования медцентра
router.get('/centers/add', centers.addCenter.bind(this)); // открыть карточку на создание медцентра
router.post('/centers/delete', centers.deleteCenter.bind(this)); // удалить медцентр
router.post('/centers', centers.updateCenter.bind(this)); // сохранение информации о центре

router.get(
    '/centers/edit_service/:id/:center_id',
    centers.editService.bind(this),
); // редактирование услуги в центре
router.get('/centers/add_service/:id', centers.addService.bind(this)); // создание услуги в центре
router.post('/centers/edit', centers.updateServiceInCenter.bind(this)); // сохранение данных об услуге в центре
router.post(
    '/centers/delete_service',
    centers.deleteServiceInCenter.bind(this),
); // удаление услуги в центре

router.get('/services', services.getAllServices.bind(this)); // все услуги
router.get('/services/edit/:id', services.editService.bind(this)); // открыть карточку редактирования услуги
router.get('/services/add', services.addService.bind(this)); // открыть карточку создания услуги
router.post('/services/delete', services.deleteService.bind(this)); // удалить услугу
router.post('/services', services.updateService.bind(this)); // запись данных в базу после редактирования или создания услуги

router.get('/doctors', doctors.getAllDoctors.bind(this)); // все врачи
router.get('/doctors/edit/:id', doctors.editDoctor.bind(this)); // открыть карточку редактирования врача
router.get('/doctors/add', doctors.addDoctor.bind(this)); // открыть карточку создания врача
router.post('/doctors/delete', doctors.deleteDoctor.bind(this)); // удалить врача
router.post('/doctors', doctors.updateDoctor.bind(this)); // запись данных в базу после создания или редактирования врача

module.exports = router;
