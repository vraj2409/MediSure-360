// Load env FIRST before anything else
const path = require('path');
const dotenv = require('dotenv');

const result = dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

if (result.error) {
  console.error('❌ .env file not found at:', path.join(__dirname, '..', '..', '.env'));
  process.exit(1);
}

console.log('✅ .env loaded');
console.log('✅ MONGODB_URI starts with:', process.env.MONGODB_URI?.slice(0, 30) + '...');

const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const User = require('../models/User');

const medicines = [
  { name: 'Paracetamol 500mg', manufacturer: 'Apex Pharma', batchNumber: 'APX1001', location: 'A1', category: 'Analgesics', purchasePrice: 0.50, sellingPrice: 1.00, expiryDate: new Date('2026-12-31'), quantityInStock: 500, description: 'Fever and pain relief' },
  { name: 'Amoxicillin 250mg', manufacturer: 'Global Health', batchNumber: 'GHL2502', location: 'B2', category: 'Antibiotics', purchasePrice: 2.20, sellingPrice: 4.50, expiryDate: new Date('2026-10-20'), quantityInStock: 250, description: 'Broad-spectrum antibiotic' },
  { name: 'Ibuprofen 200mg', manufacturer: 'PainFree Inc.', batchNumber: 'PFI3003', location: 'A2', category: 'Analgesics', purchasePrice: 1.10, sellingPrice: 2.25, expiryDate: new Date('2027-01-15'), quantityInStock: 1000, description: 'Anti-inflammatory pain relief' },
  { name: 'Loratadine 10mg', manufacturer: 'AllergyCure', batchNumber: 'ALC4004', location: 'C1', category: 'Antihistamines', purchasePrice: 3.00, sellingPrice: 5.50, expiryDate: new Date('2026-08-01'), quantityInStock: 150, description: 'Non-drowsy allergy relief' },
  { name: 'Metformin 500mg', manufacturer: 'WellLife', batchNumber: 'WLF5005', location: 'D3', category: 'Diabetes', purchasePrice: 4.50, sellingPrice: 8.00, expiryDate: new Date('2026-11-30'), quantityInStock: 300, description: 'Type 2 diabetes management' },
  { name: 'Atorvastatin 20mg', manufacturer: 'Global Health', batchNumber: 'GHL6006', location: 'B1', category: 'Cardiovascular', purchasePrice: 10.00, sellingPrice: 18.50, expiryDate: new Date('2027-05-10'), quantityInStock: 450, description: 'Cholesterol management' },
  { name: 'Omeprazole 20mg', manufacturer: 'Apex Pharma', batchNumber: 'APX7007', location: 'A3', category: 'Antacids', purchasePrice: 3.20, sellingPrice: 6.00, expiryDate: new Date('2026-09-22'), quantityInStock: 220, description: 'Acid reflux and ulcer treatment' },
  { name: 'Amlodipine 5mg', manufacturer: 'WellLife', batchNumber: 'WLF8008', location: 'D1', category: 'Cardiovascular', purchasePrice: 2.80, sellingPrice: 5.25, expiryDate: new Date('2027-02-28'), quantityInStock: 600, description: 'Blood pressure management' },
  { name: 'Cetirizine 10mg', manufacturer: 'AllergyCure', batchNumber: 'ALC9009', location: 'C2', category: 'Antihistamines', purchasePrice: 1.50, sellingPrice: 3.00, expiryDate: new Date('2027-07-14'), quantityInStock: 800, description: 'Allergy and hay fever relief' },
  { name: 'Ventolin Inhaler', manufacturer: 'Respira Co.', batchNumber: 'RSC1010', location: 'E1', category: 'Respiratory', purchasePrice: 15.00, sellingPrice: 25.00, expiryDate: new Date('2026-12-01'), quantityInStock: 80, description: 'Asthma and COPD relief' },
  { name: 'Ciprofloxacin 500mg', manufacturer: 'Global Health', batchNumber: 'GHL1111', location: 'B3', category: 'Antibiotics', purchasePrice: 8.00, sellingPrice: 15.00, expiryDate: new Date('2026-06-18'), quantityInStock: 120, description: 'Broad-spectrum antibiotic' },
  { name: 'Diclofenac Gel', manufacturer: 'PainFree Inc.', batchNumber: 'PFI1212', location: 'A4', category: 'Analgesics', purchasePrice: 5.50, sellingPrice: 9.75, expiryDate: new Date('2027-08-30'), quantityInStock: 250, description: 'Topical anti-inflammatory' },
  { name: 'Warfarin 5mg', manufacturer: 'WellLife', batchNumber: 'WLF1313', location: 'D2', category: 'Cardiovascular', purchasePrice: 6.00, sellingPrice: 11.50, expiryDate: new Date('2026-10-10'), quantityInStock: 95, description: 'Blood thinner / anticoagulant' },
  { name: 'Folic Acid 5mg', manufacturer: 'Apex Pharma', batchNumber: 'APX1414', location: 'A1', category: 'Vitamins', purchasePrice: 0.80, sellingPrice: 1.50, expiryDate: new Date('2027-11-05'), quantityInStock: 1500, description: 'Vitamin B9 supplement' },
  { name: 'Sertraline 50mg', manufacturer: 'MindWell', batchNumber: 'MWL1515', location: 'F1', category: 'Neurological', purchasePrice: 12.50, sellingPrice: 22.00, expiryDate: new Date('2027-04-12'), quantityInStock: 180, description: 'Antidepressant (SSRI)' },
  { name: 'Glucosamine Sulphate', manufacturer: 'JointCare', batchNumber: 'JTC1616', location: 'G2', category: 'Vitamins', purchasePrice: 20.00, sellingPrice: 35.00, expiryDate: new Date('2026-09-01'), quantityInStock: 70, description: 'Joint health supplement' },
  { name: 'Vitamin D3 1000IU', manufacturer: 'Apex Pharma', batchNumber: 'APX1717', location: 'A2', category: 'Vitamins', purchasePrice: 4.00, sellingPrice: 7.50, expiryDate: new Date('2027-12-31'), quantityInStock: 900, description: 'Vitamin D supplement' },
  { name: 'Ranitidine 150mg', manufacturer: 'Global Health', batchNumber: 'GHL1818', location: 'B1', category: 'Antacids', purchasePrice: 3.50, sellingPrice: 6.50, expiryDate: new Date('2026-05-25'), quantityInStock: 8, description: 'Stomach acid reducer' },
  { name: 'Levothyroxine 50mcg', manufacturer: 'WellLife', batchNumber: 'WLF1919', location: 'D4', category: 'Other', purchasePrice: 2.10, sellingPrice: 4.00, expiryDate: new Date('2027-03-19'), quantityInStock: 400, description: 'Thyroid hormone replacement' },
  { name: 'Ondansetron 4mg', manufacturer: 'Apex Pharma', batchNumber: 'APX2020', location: 'A3', category: 'Other', purchasePrice: 1.80, sellingPrice: 3.50, expiryDate: new Date('2026-02-15'), quantityInStock: 210, description: 'Anti-nausea medication' },
  { name: 'Azithromycin 500mg', manufacturer: 'Global Health', batchNumber: 'GHL2121', location: 'B4', category: 'Antibiotics', purchasePrice: 9.00, sellingPrice: 16.00, expiryDate: new Date('2027-06-30'), quantityInStock: 160, description: 'Macrolide antibiotic' },
  { name: 'Pantoprazole 40mg', manufacturer: 'Apex Pharma', batchNumber: 'APX2222', location: 'A5', category: 'Antacids', purchasePrice: 4.20, sellingPrice: 7.80, expiryDate: new Date('2027-09-15'), quantityInStock: 340, description: 'Proton pump inhibitor' },
  { name: 'Montelukast 10mg', manufacturer: 'Respira Co.', batchNumber: 'RSC2323', location: 'E2', category: 'Respiratory', purchasePrice: 7.50, sellingPrice: 14.00, expiryDate: new Date('2027-01-20'), quantityInStock: 190, description: 'Asthma and allergy prevention' },
  { name: 'Metoprolol 50mg', manufacturer: 'WellLife', batchNumber: 'WLF2424', location: 'D5', category: 'Cardiovascular', purchasePrice: 5.00, sellingPrice: 9.50, expiryDate: new Date('2026-11-11'), quantityInStock: 280, description: 'Beta-blocker for hypertension' },
  { name: 'Vitamin B12 1000mcg', manufacturer: 'Apex Pharma', batchNumber: 'APX2525', location: 'A6', category: 'Vitamins', purchasePrice: 3.00, sellingPrice: 5.75, expiryDate: new Date('2028-01-01'), quantityInStock: 650, description: 'Vitamin B12 supplement' },
];

const generateSales = (medicineIds, medicineData) => {
  const sales = [];
  const paymentMethods = ['Cash', 'Card', 'UPI', 'Other'];
  const customers = ['Walk-in Customer', 'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Verma'];

  for (let daysAgo = 60; daysAgo >= 0; daysAgo--) {
    const numSales = Math.floor(Math.random() * 5) + 2;
    for (let s = 0; s < numSales; s++) {
      const numItems = Math.floor(Math.random() * 3) + 1;
      const items = [];
      let totalAmount = 0;
      let totalProfit = 0;
      const used = new Set();

      for (let i = 0; i < numItems; i++) {
        let idx;
        do { idx = Math.floor(Math.random() * medicineIds.length); } while (used.has(idx));
        used.add(idx);

        const med = medicineData[idx];
        const qty = Math.floor(Math.random() * 4) + 1;
        totalAmount += qty * med.sellingPrice;
        totalProfit += qty * (med.sellingPrice - med.purchasePrice);

        items.push({
          medicine: medicineIds[idx],
          medicineName: med.name,
          batchNumber: med.batchNumber,
          quantitySold: qty,
          priceAtSale: med.sellingPrice,
          purchasePriceAtSale: med.purchasePrice
        });
      }

      const saleDate = new Date();
      saleDate.setDate(saleDate.getDate() - daysAgo);
      saleDate.setHours(Math.floor(Math.random() * 10) + 8, Math.floor(Math.random() * 60));

      const discount = Math.random() < 0.15 ? Math.floor(Math.random() * 10) + 2 : 0;

      sales.push({
        items,
        totalAmount: Math.max(0, totalAmount - discount),
        totalProfit,
        discount,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        customerName: customers[Math.floor(Math.random() * customers.length)],
        createdAt: saleDate,
        updatedAt: saleDate
      });
    }
  }
  return sales;
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    await Promise.all([
      Medicine.deleteMany({}),
      Sale.deleteMany({}),
      User.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    const createdMedicines = await Medicine.insertMany(medicines);
    console.log(`💊 Seeded ${createdMedicines.length} medicines`);

    await User.create({ name: 'Admin User', email: 'admin@medstore.com', password: 'admin123', role: 'admin' });
    await User.create({ name: 'Staff Member', email: 'staff@medstore.com', password: 'staff123', role: 'staff' });
    console.log('👤 Seeded users  →  admin@medstore.com / admin123');

    const medIds = createdMedicines.map(m => m._id);
    const medData = createdMedicines.map(m => ({
      name: m.name,
      batchNumber: m.batchNumber,
      sellingPrice: m.sellingPrice,
      purchasePrice: m.purchasePrice
    }));

    const salesData = generateSales(medIds, medData);
    const salesWithTxn = salesData.map((s, i) => ({
      ...s,
      transactionId: `TXN${String(i + 1).padStart(6, '0')}`
    }));

    await Sale.insertMany(salesWithTxn);
    console.log(`🧾 Seeded ${salesWithTxn.length} sales transactions`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Login: admin@medstore.com  |  🔑 Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();