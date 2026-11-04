const { loadConfig } = require("../env/mongoConfig");
const { connectToDatabase, closeDatabaseConnection } = require("../services/mongo.service");
const productDao = require("../dao/product.dao");
const seedProductsData = require("./data/products.json");

const seedProducts = async () => {
  try {
    const config = loadConfig();
    await connectToDatabase(config.mongoUri, config.databaseName);
    const insertedCount = await productDao.replaceAllProducts(seedProductsData);
    console.log(`Carga inicial completada: ${insertedCount} productos insertados`);
  } catch (err) {
    console.error(`No se pudo completar la carga inicial: ${err.message}`);
    process.exitCode = 1;
  } finally {
    await closeDatabaseConnection();
  }
};

seedProducts();
