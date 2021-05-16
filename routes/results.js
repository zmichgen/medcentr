const express = require('express');
const router = express.Router();

const search = require('../db/seachResult');

router.post('/', search.getEntries.bind(this));
router.get('/detail/:id', search.getEntry.bind(this));
router.get('/', search.goToPreviousPage.bind(this));

module.exports = router;
