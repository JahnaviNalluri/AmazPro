const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, orderController.createOrder);
router.get("/my-orders", protect, orderController.getMyOrders);
router.get("/allorders",protect,authorize("admin"),orderController.getAllOrders);
router.get(
  "/vendor-orders",
  protect,
  authorize("vendor"),
  orderController.getVendorOrders
);
router.put("/status/:id", protect, authorize("admin"), orderController.updateOrderStatus);
router.put("/cancel/:id", protect, orderController.cancelOrder);
router.put("/vendor/:id",protect,authorize("vendor"),orderController.updateOrderStatusByVendor);
router.get("/:id", protect, orderController.getOrder);
module.exports = router;
