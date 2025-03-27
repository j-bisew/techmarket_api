const UserModel = require("../models/userModel");

const getAllUsers = async (req, res, next) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await UserModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const getUserWithReviews = async (req, res, next) => {
    try {
        const user = await UserModel.getUserWithReviews(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const existingUsername = await UserModel.getUserByUsername(req.body.username);
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken" });
        }
        
        const existingEmail = await UserModel.getUserByEmail(req.body.email);
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }
        
        const newUser = await UserModel.addUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== '') {
                updates[key] = req.body[key];
            }
        });
        
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields to update" });
        }
        
        if (updates.username) {
            const existingUsername = await UserModel.getUserByUsername(updates.username);
            if (existingUsername && existingUsername.id !== parseInt(req.params.id)) {
                return res.status(400).json({ message: "Username already taken" });
            }
        }
        
        if (updates.email) {
            const existingEmail = await UserModel.getUserByEmail(updates.email);
            if (existingEmail && existingEmail.id !== parseInt(req.params.id)) {
                return res.status(400).json({ message: "Email already registered" });
            }
        }
        
        const updatedUser = await UserModel.updateUser(req.params.id, updates);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        next(err);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const deleted = await UserModel.deleteUser(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully",
            id: req.params.id
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserWithReviews,
    registerUser,
    updateUser,
    deleteUser
};