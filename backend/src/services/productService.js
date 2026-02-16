const Product=require("../models/Products");

const createProduct = async (productData, vendorId) => {
    const product = await Product.create({
        ...productData,
        vendorId
    });

    return product;
};

const getAllApprovedProducts = async () => {
    return await Product.find()
        .populate("vendorId", "name email");
};

const getProductById = async (productId) => {
    const product = await Product.findById(productId)
        .populate("vendorId", "name email");

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

const getVendorProducts = async (vendorId) => {
    return await Product.find({ vendorId });
};

const updateProduct = async (productId, updateData, vendorId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    // Ensure only owner vendor updates
    if (product.vendorId.toString() !== vendorId.toString()) {
        throw new Error("Unauthorized to update this product");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true }
    );

    return updatedProduct;
};


const deleteProduct = async (id) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  await product.deleteOne();

  return product;
};



const approveProduct = async (productId) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    product.isApproved = true;
    await product.save();

    return product;
};
const updateStock = async (productId, quantity) => {
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.stock + quantity < 0) {
        throw new Error("Insufficient stock");
    }

    product.stock += quantity;
    await product.save();

    return product;
};
module.exports = {
    createProduct,
    getAllApprovedProducts,
    getProductById,
    getVendorProducts,
    updateProduct,
    deleteProduct,
    approveProduct,
    updateStock
};