const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  manufacturer: {
    type: String,
    required: [true, 'Manufacturer is required'],
    trim: true,
    maxlength: [100, 'Manufacturer name cannot exceed 100 characters']
  },
  batchNumber: {
    type: String,
    required: [true, 'Batch number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  location: {
    type: String,
    required: [true, 'Storage location is required'],
    trim: true,
    default: 'A1'
  },
  category: {
    type: String,
    enum: ['Antibiotics', 'Analgesics', 'Antacids', 'Antihistamines', 'Cardiovascular',
           'Diabetes', 'Vitamins', 'Respiratory', 'Neurological', 'Other'],
    default: 'Other'
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price cannot be negative']
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required']
  },
  quantityInStock: {
    type: Number,
    required: [true, 'Quantity in stock is required'],
    min: [0, 'Quantity cannot be negative'],
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: is low stock (<=10)
medicineSchema.virtual('isLowStock').get(function () {
  return this.quantityInStock <= 10;
});

// Virtual: days until expiry
medicineSchema.virtual('daysUntilExpiry').get(function () {
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual: is nearing expiry (within 90 days)
medicineSchema.virtual('isNearingExpiry').get(function () {
  return this.daysUntilExpiry <= 90 && this.daysUntilExpiry > 0;
});

// Virtual: is expired
medicineSchema.virtual('isExpired').get(function () {
  return this.daysUntilExpiry <= 0;
});

// Virtual: profit margin %
medicineSchema.virtual('profitMargin').get(function () {
  if (this.purchasePrice === 0) return 0;
  return (((this.sellingPrice - this.purchasePrice) / this.purchasePrice) * 100).toFixed(1);
});

// Index for faster search
medicineSchema.index({ name: 'text', manufacturer: 'text', batchNumber: 'text' });
medicineSchema.index({ expiryDate: 1 });
medicineSchema.index({ quantityInStock: 1 });

const Medicine = mongoose.model('Medicine', medicineSchema);
module.exports = Medicine;
