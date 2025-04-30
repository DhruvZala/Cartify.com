const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  isActive: { type: Boolean, default: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

ProductSchema.pre("save", async function (next) {
  if (!this.isNew || this.id) return next();

  try {
    const lastProduct = await this.constructor.findOne(
      {},
      { id: 1 },
      { sort: { id: -1 } }
    );
    this.id = lastProduct ? lastProduct.id + 1 : 1;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Product", ProductSchema);
