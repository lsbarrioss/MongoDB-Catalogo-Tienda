const express = require("express");
const path = require("node:path");
const { loadConfig } = require("./env/mongoConfig");
const { connectToDatabase, closeDatabaseConnection } = require("./services/mongo.service");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");

const api = express();

api.use(express.json());
api.use(express.static(path.join(__dirname, "public")));

api.use("/api/products", productRoutes);
api.use("/api/categories", categoryRoutes);

const startServer = async () => {
  try {
    const config = loadConfig();
    await connectToDatabase(config.mongoUri, config.databaseName);
    console.log(`Conectado a MongoDB, base de datos "${config.databaseName}"`);

    api.listen(config.port, async (listenError) => {
      if (listenError) {
        console.error(`No se pudo usar el puerto ${config.port}: ${listenError.message}`);
        await closeDatabaseConnection();
        process.exitCode = 1;
        return;
      }

      console.log(`Falabello disponible en http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error(`No se pudo iniciar el servidor: ${err.message}`);
    await closeDatabaseConnection();
    process.exitCode = 1;
  }
};

const stopServer = async () => {
  await closeDatabaseConnection();
  process.exit(0);
};

process.on("SIGINT", stopServer);

startServer();
