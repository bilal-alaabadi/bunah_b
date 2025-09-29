// ========================= backend/models/product.model.js (نهائي) =========================
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true }, // الاسم النهائي (السيرفر قد يلصق الوزن مرة واحدة)
    category:    { type: String, required: true },
    description: { type: String, required: true },
    price:       { type: Number, required: true },
    image:       { type: [String], required: true },
    oldPrice:    { type: Number },
    rating:      { type: Number, default: 0 },
    author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    inStock:     { type: Boolean, default: true },

    // الوزن بالجرام – مطلوب فقط لفئات المحامص (يُحفظ رقمًا)
    weightGrams: { type: Number, default: null },

    // حجم الحناء إن لزم
    size:        { type: String, default: null },

    // الكمية المتوفرة في المخزون
    stockQty:    { type: Number, required: true, min: 0, default: 0 }
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);
module.exports = Products;
