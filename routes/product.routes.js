const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.get("/", productController.getAll);
router.post("/", productController.create);
router.post("/:id/sales", productController.createSale);
router.delete("/:id", productController.remove);

module.exports = router;
