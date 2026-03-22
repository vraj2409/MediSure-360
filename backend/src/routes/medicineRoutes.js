const express = require('express');
const router = express.Router();
const {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  getMedicineStats
} = require('../controllers/medicineController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // All medicine routes require auth

router.get('/search', searchMedicines);
router.get('/stats', getMedicineStats);
router.route('/').get(getMedicines).post(createMedicine);
router.route('/:id').get(getMedicineById).put(updateMedicine).delete(deleteMedicine);

module.exports = router;
