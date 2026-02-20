import User from "../models/User.js";

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TOGGLE WISHLIST (Add / Remove)
export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;

    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (exists) {
      user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
      );
    } else {
      user.wishlist.push(productId);
    }

   await user.save();

const updatedUser = await User.findById(req.user._id)
  .populate("wishlist");

res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};