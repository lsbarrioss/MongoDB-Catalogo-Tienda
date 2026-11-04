const productDao = require("../dao/product.dao");

const getSummary = async (req, res) => {
  try {
    const categorySummary = await productDao.summarizeByCategory();
    res.json(categorySummary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSummary };
