const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Create a product
router.post("/", async (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.price || !body.category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const product = new Product({
      name: body.name,
      price: body.price,
      category: body.category,
    });

    const savedProduct = await product.save();
    return res
      .status(201)
      .json({ message: "Product created", product: savedProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Failed to create product" });
  }
});

// Get all products with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find()
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);

    return res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to get products" });
  }
});

// Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Failed to get product" });
  }
});

// Update product by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product updated", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(400).json({ message: "Failed to update product" });
  }
});

// Delete product by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product deleted", product: deletedProduct });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Failed to delete product" });
  }
});

// Update product quantities after order
router.post("/update-quantities", async (req, res) => {
  try {
    const { items } = req.body;
    
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    // Update quantities for each product
    for (const item of items) {
      const product = await Product.findOne({ id: item.id });
      if (!product) {
        return res.status(404).json({ message: `Product with id ${item.id} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient quantity for product ${product.title}` 
        });
      }

      product.quantity -= item.quantity;
      await product.save();
    }

    return res.json({ message: "Product quantities updated successfully" });
  } catch (error) {
    console.error("Error updating product quantities:", error);
    return res.status(500).json({ message: "Failed to update product quantities" });
  }
});

module.exports = router;
