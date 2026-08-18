const express = require('express');
const router = express.Router();
const { getOverview, getTrends, getHotspots } = require('../controllers/analyticsController');

router.get('/overview', getOverview);
router.get('/trends', getTrends);
router.get('/hotspots', getHotspots);

module.exports = router;
