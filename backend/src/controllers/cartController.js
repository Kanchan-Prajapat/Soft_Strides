import User from "../models/User.js";
import Product from "../models/Product.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json(user.cart || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity, buyNow } = req.body;

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId &&
        item.size === size
    );

    if (buyNow) {
      // 🔥 BUY NOW: replace cart with single item
      user.cart = [
        {
          product: productId,
          size,
          quantity,
        },
      ];
    } else {
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        user.cart.push({
          product: productId,
          size,
          quantity,
        });
      }
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REMOVE FROM CART
========================= */
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item._id.toString() !== req.params.id
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE QUANTITY
========================= */
export const updateCartQty = async (req, res) => {
  try {
    const { quantity } = req.body;

    const user = await User.findById(req.user._id);

    const item = user.cart.id(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};