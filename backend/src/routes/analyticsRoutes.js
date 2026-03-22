const express = require('express');
const router = express.Router();
const {
  getRevenueOverTime,
  getTopMedicines,
  getSalesByCategory,
  getTransactionStats,
  getPaymentMethods,
  getSummary,
  getStockHealth
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/revenue', getRevenueOverTime);
router.get('/top-medicines', getTopMedicines);
router.get('/category-sales', getSalesByCategory);
router.get('/transactions', getTransactionStats);
router.get('/payment-methods', getPaymentMethods);
router.get('/stock-health', getStockHealth);

module.exports = router;
