const HttpError = require("../errors/http.error");
const productDao = require("../dao/product.dao");
const productValidator = require("../validators/product.validator");

const getAll = async (req, res) => {
  try {
    const category = productValidator.validateCategoryFilter(req.query.category);
    const products = await productDao.findProducts(category);
    res.json(products);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const productData = productValidator.validateProductInput(req.body);
    const createdProduct = await productDao.createProduct(productData);
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const createSale = async (req, res) => {
  try {
    const productId = productValidator.validateProductId(req.params.id);
    const quantity = productValidator.validateSaleQuantity(req.body);
    const updatedProduct = await productDao.registerSale(productId, quantity);

    if (updatedProduct) {
      res.status(201).json(updatedProduct);
      return;
    }

    const existingProduct = await productDao.findProductById(productId);

    if (!existingProduct) {
      throw new HttpError(404, "El producto no existe");
    }

    throw new HttpError(409, "No hay suficiente stock para registrar esta venta");
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const productId = productValidator.validateProductId(req.params.id);
    const wasDeleted = await productDao.deleteProduct(productId);

    if (!wasDeleted) {
      throw new HttpError(404, "El producto no existe");
    }

    res.status(204).end();
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { getAll, create, createSale, remove };
