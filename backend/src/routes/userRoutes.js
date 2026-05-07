const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  protect,
  authorize
} = require("../middleware/authMiddleware");
router.post("/register", userController.register);
router.post("/login", userController.login);

router.get("/profile", protect, userController.getProfile);
router.put("/profile", protect, userController.updateProfile);
router.put("/vendor-profile", protect, userController.completeVendorProfile);
router.get(
  "/all",
  protect,
  authorize("admin"),
  userController.getAllUsers
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  userController.deleteUser
);

module.exports = router;
