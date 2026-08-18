const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue
} = require('../controllers/issueController');
const { protect, requireRole } = require('../middleware/auth');

// Optional auth for creating issue (supports anonymous reports or logged in citizens)
router.post('/', (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
}, createIssue);

router.get('/', getIssues);
router.get('/:id', getIssueById);

// Admin / protected updates
router.patch('/:id', protect, updateIssue);
router.delete('/:id', protect, requireRole('admin'), deleteIssue);

module.exports = router;
