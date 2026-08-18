const express = require('express');
const router = express.Router();
const { getClusters, getClusterById, mergeClusters } = require('../controllers/clusterController');
const { protect, requireRole } = require('../middleware/auth');

router.get('/', getClusters);
router.get('/:id', getClusterById);
router.post('/merge', protect, requireRole('admin'), mergeClusters);

module.exports = router;
