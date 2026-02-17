const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getMyOrders);
router.get("/:id", protect, orderController.getOrder);
router.get("/allorders",protect,authorize("admin"),orderController.getAllOrders);
router.put("/status/:id", protect, authorize("admin"), orderController.updateOrderStatus);
router.put("/cancel/:id", protect, orderController.cancelOrder);
router.put("/vendor/:id",protect,authorize("vendor"),orderController.updateOrderStatusByVendor);

module.exports = router; 