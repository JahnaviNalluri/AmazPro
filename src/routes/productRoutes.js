const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", productController.getAllProducts);
router.get("/vendor", protect, authorize("vendor"), productController.getVendorProducts);

router.get("/:id", productController.getProduct);

router.post("/", protect, authorize("vendor"), productController.createProduct);
router.put("/:id", protect, authorize("vendor"), productController.updateProduct);
router.delete("/:id", protect, authorize("admin", "vendor"), productController.deleteProduct);

router.put("/approve/:id", protect, authorize("admin"), productController.approveProduct);

module.exports = router;

