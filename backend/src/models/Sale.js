const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  medicineName: {
    type: String,
    required: true // snapshot at time of sale
  },
  batchNumber: {
    type: String,
    required: true
  },
  quantitySold: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  priceAtSale: {
    type: Number,
    required: true
  },
  purchasePriceAtSale: {
    type: Number,
    required: true
  }
}, { _id: true });

// Virtual: subtotal for this item
saleItemSchema.virtual('subtotal').get(function () {
  return this.quantitySold * this.priceAtSale;
});

// Virtual: profit for this item
saleItemSchema.virtual('profit').get(function () {
  return this.quantitySold * (this.priceAtSale - this.purchasePriceAtSale);
});

saleItemSchema.set('toJSON', { virtuals: true });
saleItemSchema.set('toObject', { virtuals: true });

const saleSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    unique: true
  },
  items: [saleItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Other'],
    default: 'Cash'
  },
  customerName: {
    type: String,
    trim: true,
    default: 'Walk-in Customer'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate transaction ID before saving
saleSchema.pre('save', async function (next) {
  if (!this.transactionId) {
    const count = await mongoose.model('Sale').countDocuments();
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    this.transactionId = `TXN${year}${month}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Index for analytics queries
saleSchema.index({ createdAt: -1 });

const Sale = mongoose.model('Sale', saleSchema);
module.exports = Sale;