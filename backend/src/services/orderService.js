const Order = require("../models/Order");
const Product = require("../models/Products"); // make sure filename matches

const createOrder = async (
  orderData,
  customerId
) => {

  let totalAmount = 0;

  for (const item of orderData.products) {

    const product =
      await Product.findById(
        item.productId
      );

    if (!product) {

      throw new Error(
        "Product not found"
      );
    }

    // CHECK STOCK

    if (
      product.stock <
      item.quantity
    ) {

      throw new Error(
        "Insufficient stock"
      );
    }

    // TOTAL

    totalAmount +=
      product.price *
      item.quantity;

    // DECREASE STOCK

    product.stock -=
      item.quantity;

    // INCREASE SOLD

    product.sold +=
      item.quantity;

    await product.save();
  }

  // CREATE ORDER

  const order =
    await Order.create({

      products:
        orderData.products,

      customerId,

      totalAmt:
        totalAmount,

      shippingAddress:
        orderData.shippingAddress,

      status: "pending",
    });

  return order;
};
const getOrderById = async (orderId) => {
    const order = await Order.findById(orderId).populate("customerId");

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

const getCustomerOrders = async (customerId) => {
    return await Order.find({ customerId })
  .populate("products.productId", "productName images price");
};

const updateOrderStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    return order;
};

const cancelOrder = async (
  orderId,
  customerId
) => {

  const order =
    await Order.findById(
      orderId
    );

  if (!order) {

    throw new Error(
      "Order not found"
    );
  }

  // SECURITY

  if (
    order.customerId.toString() !==
    customerId.toString()
  ) {

    throw new Error(
      "Unauthorized"
    );
  }

  // ALREADY CANCELLED

  if (
    order.status ===
    "cancelled"
  ) {

    throw new Error(
      "Order already cancelled"
    );
  }

  // RESTORE STOCK

  for (const item of order.products) {

    const product =
      await Product.findById(
        item.productId
      );

    if (product) {

      // ADD STOCK BACK

      product.stock +=
        item.quantity;

      // REDUCE SOLD

      product.sold -=
        item.quantity;

      // SAFETY

      if (product.sold < 0) {

        product.sold = 0;
      }

      await product.save();
    }
  }

  // UPDATE STATUS

  order.status =
    "cancelled";

  await order.save();

  return order;
};
const getAllOrders = async () => {

  const orders =
    await Order.find()

      .populate(
        "customerId",
        "name email"
      )

      .populate({

        path:
          "products.productId",

        model: "Product",

        select:
          "productName images price stock sold",

      })

      .sort({
        createdAt: -1,
      });

  return orders;
};
/* ---------------- VENDOR ORDER UPDATE ---------------- */

const updateOrderStatusByVendor = async (orderId, vendorId, status) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    // Check if order contains vendor's product
    const hasVendorProduct = await Promise.all(
        order.products.map(async (item) => {
            const product = await Product.findById(item.productId);
            return product && product.vendorId.toString() === vendorId.toString();
        })
    );

    if (!hasVendorProduct.includes(true)) {
        throw new Error("Not authorized for this order");
    }

    order.status = status;
    await order.save();

    return order;
};
/* ---------------- GET VENDOR ORDERS ---------------- */

const getVendorOrders = async (
  vendorId
) => {

  const orders =
    await Order.find()

      .populate(
        "customerId",
        "name email phoneno"
      )

      .populate({

        path:
          "products.productId",

        model: "Product",

        select:
          "productName images price stock vendorId sold",
      })

      .sort({
        createdAt: -1,
      });

  // FILTER ONLY ORDERS
  // HAVING VENDOR PRODUCTS

  const vendorOrders =
    orders.filter((order) =>

      order.products.some(
        (item) =>

          item.productId
            ?.vendorId
            ?.toString() ===
          vendorId.toString()
      )
    );

  return vendorOrders;
};
module.exports = {
    createOrder,
    getOrderById,
    getCustomerOrders,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getVendorOrders,
    updateOrderStatusByVendor
};
