const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//register
const registerUser = async (userData) => {
    const { name, email, password, phoneno, address, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phoneno,
        address,
        role
    });

    return user;
};

//login
const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user, token };
};

const getUserById = async (userId) => {
    return await User.findById(userId).select("-password");
};

const updateProfile = async (userId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
    ).select("-password");

    return updatedUser;
};

const completeVendorProfile = async (userId, vendorData) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "vendor") {
        throw new Error("Only vendors can complete vendor profile");
    }

    user.vendorInfo = {
        storename: vendorData.storename,
        storedesc: vendorData.storedesc
    };

    user.isprofilecompleted = true;

    await user.save();

    return user;
};

const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};


module.exports = {
    registerUser,
    loginUser,
    getUserById,
    updateProfile,
    completeVendorProfile,
    deleteUser
};