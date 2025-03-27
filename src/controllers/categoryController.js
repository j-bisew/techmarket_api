const CategoryModel = require("../models/categoryModel");

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await CategoryModel.getAllCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
};

const getCategoryById = async (req, res, next) => {
    try {
        const category = await CategoryModel.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        next(err);
    }
};

const getCategoryWithProducts = async (req, res, next) => {
    try {
        const category = await CategoryModel.getCategoryWithProducts(req.params.id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(category);
    } catch (err) {
        next(err);
    }
};

const addCategory = async (req, res, next) => {
    try {
        const newCategory = await CategoryModel.addCategory(req.body);
        res.status(201).json(newCategory);
    } catch (err) {
        next(err);
    }
};

const updateCategory = async (req, res, next) => {
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
        
        const updatedCategory = await CategoryModel.updateCategory(req.params.id, updates);
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.json(updatedCategory);
    } catch (err) {
        next(err);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const deleted = await CategoryModel.deleteCategory(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({
            message: "Category deleted successfully",
            id: req.params.id
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryWithProducts,
    addCategory,
    updateCategory,
    deleteCategory
};