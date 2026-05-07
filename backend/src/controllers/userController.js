const userService = require("../services/userServices");

const register = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await userService.loginUser(email, password);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const completeVendorProfile = async (req, res) => {
    try {
        const user = await userService.completeVendorProfile(req.user.id, req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
const getAllUsers = async (
  req,
  res
) => {

  try {

    const users =
      await userService.getAllUsers();

    res.status(200).json(users);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        "Failed to fetch users",
    });
  }
};
const deleteUser = async (
  req,
  res
) => {

  try {

    const deleted =
      await userService.deleteUser(
        req.params.id
      );

    res.status(200).json({
      message:
        "User deleted successfully",

      user: deleted,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message:
        err.message ||
        "Delete failed",
    });
  }
};


module.exports = {
    register,
    getAllUsers,
    deleteUser,
    login,
    getProfile,
    updateProfile,
    completeVendorProfile
};
