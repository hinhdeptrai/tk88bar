const express = require('express');
const { withdraw, getWithdrawHistory, getAllWithdrawHistory, updateWithdrawStatus, deleteWithdraw } = require('../controllers/withdraw.controller');

const router = express.Router();

// Route cho người dùng
router.post('/', withdraw);
router.get('/history', getWithdrawHistory);

// Route cho admin
router.get('/admin/history', getAllWithdrawHistory);
router.put('/admin/update', updateWithdrawStatus);
router.delete('/admin/:id', deleteWithdraw);

module.exports = router; 