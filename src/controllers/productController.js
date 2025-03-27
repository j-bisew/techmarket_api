const ProductModel = require("../models/productModels");

const getAllProducts = async (req, res, next) => {
    try {
        const { sort, available } = req.query;
        const products = await ProductModel.getAllProducts({
            sort,
            available: available === "true" ? true : available === "false" ? false : undefined
        });

        res.json(products);
    } catch (err) {
        next(err);
    }
};

const getProductById = async (req, res, next) => {
    try {
        const product = await ProductModel.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

const addProduct = async (req, res, next) => {
    try {
        const newProduct = await ProductModel.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        next(err);
    }
};

const updateProduct = async (req, res, next) => {
    try {
      if (req.body.price !== undefined && (isNaN(req.body.price) || parseFloat(req.body.price) <= 0)) {
        return res.status(400).json({
          status: 'error',
          errors: [{ msg: 'Cena musi być liczbą większą od 0.', param: 'price' }]
        });
      }
      
      const updatedProduct = await ProductModel.updateProduct(req.params.id, req.body);
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(updatedProduct);
    } catch (err) {
      next(err);
    }
  };

  const deleteProduct = async (req, res, next) => {
    try {
        const deleted = await ProductModel.deleteProduct(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            id: req.params.id
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};