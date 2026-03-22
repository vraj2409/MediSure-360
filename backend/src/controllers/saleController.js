const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// @desc Create a new sale (finalize bill)
// @route POST /api/sales
const createSale = async (req, res) => {
  try {
    const { items, discount = 0, paymentMethod = 'Cash', customerName, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in sale' });
    }

    let totalAmount = 0;
    let totalProfit = 0;
    const saleItems = [];
    const medicineUpdates = [];

    // Validate all items first
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);

      if (!medicine) {
        return res.status(404).json({ success: false, message: `Medicine not found` });
      }

      if (medicine.quantityInStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${medicine.name}. Available: ${medicine.quantityInStock}`
        });
      }

      const subtotal = item.quantity * medicine.sellingPrice;
      const profit = item.quantity * (medicine.sellingPrice - medicine.purchasePrice);

      totalAmount += subtotal;
      totalProfit += profit;

      saleItems.push({
        medicine: medicine._id,
        medicineName: medicine.name,
        batchNumber: medicine.batchNumber,
        quantitySold: item.quantity,
        priceAtSale: medicine.sellingPrice,
        purchasePriceAtSale: medicine.purchasePrice
      });

      medicineUpdates.push({ id: medicine._id, newQty: medicine.quantityInStock - item.quantity });
    }

    // Apply discount
    const discountAmt = Math.min(discount, totalAmount);
    const finalAmount = Math.max(0, totalAmount - discountAmt);

    // Create the sale
    const sale = await Sale.create({
      items: saleItems,
      totalAmount: finalAmount,
      totalProfit,
      discount: discountAmt,
      paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      notes
    });

    // Update stock for all medicines
    for (const update of medicineUpdates) {
      await Medicine.findByIdAndUpdate(update.id, { quantityInStock: update.newQty });
    }

    const populatedSale = await Sale.findById(sale._id);
    res.status(201).json({ success: true, data: populatedSale });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get all sales
// @route GET /api/sales
const getSales = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    let query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: sales.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: sales
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single sale (receipt)
// @route GET /api/sales/:id
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    res.json({ success: true, data: sale });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createSale, getSales, getSaleById };