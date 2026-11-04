const { ObjectId } = require("mongodb");
const { getDatabase } = require("../services/mongo.service");

const COLLECTION_NAME = "products";

const getProductsCollection = () => getDatabase().collection(COLLECTION_NAME);

const findProducts = async (category) => {
  const filter = category ? { category } : {};
  return getProductsCollection().find(filter).sort({ name: 1 }).toArray();
};

const findProductById = async (productId) => {
  return getProductsCollection().findOne({ _id: new ObjectId(productId) });
};

const createProduct = async (productData) => {
  const result = await getProductsCollection().insertOne(productData);
  return { ...productData, _id: result.insertedId };
};

const registerSale = async (productId, quantity) => {
  return getProductsCollection().findOneAndUpdate(
    { _id: new ObjectId(productId), stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { returnDocument: "after" }
  );
};

const deleteProduct = async (productId) => {
  const result = await getProductsCollection().deleteOne({ _id: new ObjectId(productId) });
  return result.deletedCount > 0;
};

const summarizeByCategory = async () => {
  return getProductsCollection()
    .aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stock" },
          averagePrice: { $avg: "$price" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalProducts: 1,
          totalStock: 1,
          averagePrice: { $round: ["$averagePrice", 0] }
        }
      },
      { $sort: { category: 1 } }
    ])
    .toArray();
};

const replaceAllProducts = async (products) => {
  const collection = getProductsCollection();
  await collection.deleteMany({});
  const result = await collection.insertMany(products);
  return result.insertedCount;
};

module.exports = {
  findProducts,
  findProductById,
  createProduct,
  registerSale,
  deleteProduct,
  summarizeByCategory,
  replaceAllProducts
};
