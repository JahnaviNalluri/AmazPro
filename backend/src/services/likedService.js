const Liked = require("../models/Liked");

// Get liked list
const getLiked = async (customerId) => {
  let liked = await Liked.findOne({ customerId }).populate(
    "items.productId",
    "productName productDescription images stock vendorId price"
  );

  if (!liked) {
    liked = await Liked.create({ customerId, items: [] });
    liked = await liked.populate(
      "items.productId",
      "productName productDescription images stock vendorId price"
    );
  }

  return liked;
};

// Add to liked
const addToLiked = async (customerId, productId) => {
  const liked = await getLiked(customerId);

  const exists = liked.items.find(
    (item) => item.productId._id.toString() === productId.toString()
  );

  if (!exists) {
    liked.items.push({ productId });
    await liked.save();
  }

  return await liked.populate("items.productId");
};

// Remove from liked
const removeFromLiked = async (customerId, productId) => {
  const liked = await getLiked(customerId);

  liked.items = liked.items.filter(
    (item) => item.productId._id.toString() !== productId.toString()
  );

  await liked.save();
  return await liked.populate("items.productId");
};

// Clear liked
const clearLiked = async (customerId) => {
  const liked = await getLiked(customerId);

  liked.items = [];
  await liked.save();

  return liked;
};

module.exports = {
  getLiked,
  addToLiked,
  removeFromLiked,
  clearLiked,
};