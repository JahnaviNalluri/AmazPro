const productService = require("../services/productService");

const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body, req.user.id);
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllApprovedProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await productService.updateProduct(
            req.params.id,
            req.body,
            req.user.id
        );
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== "admin" || req.user.role!=="vendor")  {
      return res.status(403).json({ message: "Not authorized" });
    }
    //delete ki admin access vunda, vendor cannot delete

    const deleted = await productService.deleteProduct(req.params.id);

    res.json({
      message: "Product deleted successfully",
      product: deleted
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: err.message || "Delete failed"
    });
  }
};

const approveProduct = async (req, res) => {
    try {
        const product = await productService.approveProduct(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user._id;  // 🔥 from protect middleware

    const products = await productService.getVendorProducts(vendorId);

    res.status(200).json(products);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch vendor products"
    });
  }
};
module.exports = {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    approveProduct,
    getVendorProducts
};
