import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ==============================
// CREATE ORDER
// ==============================
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingInfo,
      paymentMethod,
    } = req.body;

    // Check items
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    // Check shipping information
    if (
      !shippingInfo ||
      !shippingInfo.fullName ||
      !shippingInfo.address ||
      !shippingInfo.phone
    ) {
      return res.status(400).json({
        message: "Complete shipping information is required",
      });
    }

    // Check payment method
    if (!paymentMethod) {
      return res.status(400).json({
        message: "Payment method is required",
      });
    }

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product ${item.product} not found`,
        });
      }

      const quantity = Number(item.quantity || 1);

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `${product.title} does not have enough stock`,
        });
      }

      orderItems.push({
        product: product._id,
        seller: product.seller,
        title: product.title,
        price: product.price,
        quantity,
      });

      // Reduce stock
      product.stock -= quantity;
      await product.save();
    }

    // Calculate total on backend
    const calculatedTotal = orderItems.reduce(
      (total, item) =>
        total +
        Number(item.price) * Number(item.quantity),
      0
    );

    // Create order
    const order = await Order.create({
      buyer: req.user.id,

      items: orderItems,

      totalAmount: calculatedTotal,

      shippingInfo: {
        fullName: shippingInfo.fullName.trim(),
        address: shippingInfo.address.trim(),
        phone: shippingInfo.phone.trim(),
      },

      paymentMethod,
    });

    console.log("Order created:", order._id);

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ==============================
// GET SELLER ORDERS
// ==============================
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user?.id;

    if (!sellerId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    const orders = await Order.find({
      "items.seller": sellerId,
    })
      .populate("buyer", "fullName email")
      .populate("items.product", "title image price")
      .sort({ createdAt: -1 });

    // Calculate seller's revenue
    let revenue = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (String(item.seller) === String(sellerId)) {
          revenue += Number(item.price) * Number(item.quantity);
        }
      });
    });

    res.status(200).json({
      orders,
      revenue,
    });
  } catch (error) {
    console.error("Get seller orders error:", error);

    res.status(500).json({
      message: error.message || "Failed to load seller orders.",
    });
  }
};

// ==============================
// GET BUYER ORDERS
// ==============================
export const getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.user?.id;

    if (!buyerId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    const orders = await Order.find({
      buyer: buyerId,
    })
      .populate("buyer", "fullName email")
      .populate("items.product", "title image price category")
      .sort({ createdAt: -1 });

    console.log("Orders found:", orders.length);

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get buyer orders error:", error);

    res.status(500).json({
      message: error.message || "Failed to load buyer orders.",
    });
  }
};

// ==============================
// GET SINGLE BUYER ORDER
// ==============================
export const getBuyerOrderById = async (req, res) => {
  try {
    const buyerId = req.user?.id;

    if (!buyerId) {
      return res.status(401).json({
        message: "User authentication information is missing.",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      buyer: buyerId,
    })
      .populate("buyer", "fullName email")
      .populate(
        "items.product",
        "title image price category"
      );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get buyer order error:", error);

    res.status(500).json({
      message: error.message || "Failed to load order.",
    });
  }
};