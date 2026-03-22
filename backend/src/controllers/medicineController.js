const Medicine = require('../models/Medicine');

// @desc Get all medicines with optional filters
// @route GET /api/medicines
const getMedicines = async (req, res) => {
  try {
    const { search, category, lowStock, expiring, expired, page = 1, limit = 50 } = req.query;

    let query = {};

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { batchNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = category;
    if (lowStock === 'true') query.quantityInStock = { $lte: 10 };

    // Expiry filters
    const now = new Date();
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    if (expiring === 'true') {
      query.expiryDate = { $gt: now, $lte: ninetyDaysFromNow };
    }
    if (expired === 'true') {
      query.expiryDate = { $lt: now };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Medicine.countDocuments(query);
    const medicines = await Medicine.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: medicines.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single medicine
// @route GET /api/medicines/:id
const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create medicine
// @route POST /api/medicines
const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create(req.body);
    res.status(201).json({ success: true, data: medicine });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Batch number already exists' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Update medicine
// @route PUT /api/medicines/:id
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    res.json({ success: true, data: medicine });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc Delete medicine
// @route DELETE /api/medicines/:id
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }
    await medicine.deleteOne();
    res.json({ success: true, message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Search medicines for POS (live search, only in stock)
// @route GET /api/medicines/search
const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim().length < 1) {
      return res.json({ success: true, data: [] });
    }

    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { batchNumber: { $regex: query, $options: 'i' } }
      ],
      quantityInStock: { $gt: 0 }
    }).limit(10).select('name batchNumber sellingPrice quantityInStock manufacturer');

    res.json({ success: true, data: medicines });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get dashboard stats
// @route GET /api/medicines/stats
const getMedicineStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const [
      totalMedicines,
      lowStockCount,
      expiringCount,
      expiredCount,
      totalStockValue
    ] = await Promise.all([
      Medicine.countDocuments(),
      Medicine.countDocuments({ quantityInStock: { $lte: 10 } }),
      Medicine.countDocuments({ expiryDate: { $gt: now, $lte: ninetyDaysFromNow } }),
      Medicine.countDocuments({ expiryDate: { $lt: now } }),
      Medicine.aggregate([{
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$sellingPrice', '$quantityInStock'] } },
          totalCost: { $sum: { $multiply: ['$purchasePrice', '$quantityInStock'] } }
        }
      }])
    ]);

    res.json({
      success: true,
      data: {
        totalMedicines,
        lowStockCount,
        expiringCount,
        expiredCount,
        totalStockValue: totalStockValue[0]?.totalValue || 0,
        totalStockCost: totalStockValue[0]?.totalCost || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  searchMedicines,
  getMedicineStats
};
