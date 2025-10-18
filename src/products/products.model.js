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

    // حالة التوفر تُحفظ تلقائيًا "متوفر" ما لم تُرسل false صراحةً
    inStock:     { type: Boolean, default: true },

    // الوزن بالجرام – مطلوب فقط لفئات المحامص
    weightGrams: { type: Number, default: null },

    // اسم المحمصة (اختياري)
    roasterName: { type: String, default: '' },

    // حجم الحناء إن لزم
    size:        { type: String, default: null }
  },
  { timestamps: true }
);

const Products = mongoose.model("Product", ProductSchema);
module.exports = Products;
