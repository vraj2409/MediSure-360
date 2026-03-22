const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

// Helper: get date range
const getDateRange = (period) => {
  const now = new Date();
  const start = new Date();

  switch (period) {
    case '7d': start.setDate(now.getDate() - 7); break;
    case '30d': start.setDate(now.getDate() - 30); break;
    case '90d': start.setDate(now.getDate() - 90); break;
    case '1y': start.setFullYear(now.getFullYear() - 1); break;
    default: start.setDate(now.getDate() - 30);
  }
  start.setHours(0, 0, 0, 0);
  return { start, end: now };
};

// @desc Revenue over time (line chart)
// @route GET /api/analytics/revenue?period=30d
const getRevenueOverTime = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const { start, end } = getDateRange(period);

    const groupBy = period === '1y' ? '%Y-%m' : '%Y-%m-%d';
    const labelFormat = period === '1y' ? { year: 'numeric', month: 'short' } : { month: 'short', day: 'numeric' };

    const data = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: groupBy, date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          profit: { $sum: '$totalProfit' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data, period });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Top selling medicines (bar chart)
// @route GET /api/analytics/top-medicines?period=30d&limit=10
const getTopMedicines = async (req, res) => {
  try {
    const { period = '30d', limit = 10 } = req.query;
    const { start, end } = getDateRange(period);

    const data = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.medicineName',
          totalQuantity: { $sum: '$items.quantitySold' },
          totalRevenue: { $sum: { $multiply: ['$items.quantitySold', '$items.priceAtSale'] } },
          totalProfit: { $sum: { $multiply: ['$items.quantitySold', { $subtract: ['$items.priceAtSale', '$items.purchasePriceAtSale'] }] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Sales by category (pie chart)
// @route GET /api/analytics/category-sales?period=30d
const getSalesByCategory = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const { start, end } = getDateRange(period);

    // Join with medicines to get category
    const data = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'medicines',
          localField: 'items.medicine',
          foreignField: '_id',
          as: 'medicineData'
        }
      },
      { $unwind: { path: '$medicineData', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: { $ifNull: ['$medicineData.category', 'Other'] },
          totalRevenue: { $sum: { $multiply: ['$items.quantitySold', '$items.priceAtSale'] } },
          totalQuantity: { $sum: '$items.quantitySold' }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Daily transaction count (bar chart)
// @route GET /api/analytics/transactions?period=30d
const getTransactionStats = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const { start, end } = getDateRange(period);

    const data = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          avgValue: { $avg: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Payment method breakdown (donut chart)
// @route GET /api/analytics/payment-methods?period=30d
const getPaymentMethods = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const { start, end } = getDateRange(period);

    const data = await Sale.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          total: { $sum: '$totalAmount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Summary KPIs
// @route GET /api/analytics/summary?period=30d
const getSummary = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const { start, end } = getDateRange(period);

    // Previous period for comparison
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const prevStart = new Date(start.getTime() - periodDays * 24 * 60 * 60 * 1000);
    const prevEnd = new Date(start.getTime() - 1);

    const [currentStats, prevStats] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalProfit: { $sum: '$totalProfit' },
            totalTransactions: { $sum: 1 },
            avgOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]),
      Sale.aggregate([
        { $match: { createdAt: { $gte: prevStart, $lte: prevEnd } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$totalAmount' },
            totalProfit: { $sum: '$totalProfit' },
            totalTransactions: { $sum: 1 }
          }
        }
      ])
    ]);

    const current = currentStats[0] || { totalRevenue: 0, totalProfit: 0, totalTransactions: 0, avgOrderValue: 0 };
    const prev = prevStats[0] || { totalRevenue: 0, totalProfit: 0, totalTransactions: 0 };

    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return parseFloat(((curr - prev) / prev * 100).toFixed(1));
    };

    res.json({
      success: true,
      data: {
        totalRevenue: current.totalRevenue,
        totalProfit: current.totalProfit,
        totalTransactions: current.totalTransactions,
        avgOrderValue: current.avgOrderValue || 0,
        revenueChange: calcChange(current.totalRevenue, prev.totalRevenue),
        profitChange: calcChange(current.totalProfit, prev.totalProfit),
        transactionChange: calcChange(current.totalTransactions, prev.totalTransactions)
      },
      period
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Stock health overview
// @route GET /api/analytics/stock-health
const getStockHealth = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);

    const [stockLevels, expiryData] = await Promise.all([
      Medicine.aggregate([
        {
          $bucket: {
            groupBy: '$quantityInStock',
            boundaries: [0, 1, 10, 50, 200, Infinity],
            default: 'Other',
            output: {
              count: { $sum: 1 },
              label: { $first: '$$ROOT' }
            }
          }
        }
      ]),
      Medicine.aggregate([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ['$expiryDate', now] }, then: 'Expired' },
                  { case: { $lt: ['$expiryDate', thirtyDays] }, then: 'Expiring < 30 days' },
                  { case: { $lt: ['$expiryDate', ninetyDays] }, then: 'Expiring < 90 days' }
                ],
                default: 'Good'
              }
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({ success: true, stockLevels, expiryData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getRevenueOverTime,
  getTopMedicines,
  getSalesByCategory,
  getTransactionStats,
  getPaymentMethods,
  getSummary,
  getStockHealth
};
