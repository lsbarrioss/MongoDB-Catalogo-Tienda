const { MongoClient } = require("mongodb");

const CONNECTION_TIMEOUT_MS = 5000;

let mongoClient = null;
let database = null;

const connectToDatabase = async (mongoUri, databaseName) => {
  mongoClient = new MongoClient(mongoUri, { serverSelectionTimeoutMS: CONNECTION_TIMEOUT_MS });
  await mongoClient.connect();
  database = mongoClient.db(databaseName);
  await database.command({ ping: 1 });
  return database;
};

const getDatabase = () => {
  if (!database) {
    throw new Error("La conexión con la base de datos no ha sido inicializada");
  }

  return database;
};

const closeDatabaseConnection = async () => {
  if (mongoClient) {
    await mongoClient.close();
    mongoClient = null;
    database = null;
  }
};

module.exports = { connectToDatabase, getDatabase, closeDatabaseConnection };
