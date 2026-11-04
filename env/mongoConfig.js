const REQUIRED_VARIABLES = ["PORT", "MONGODB_URI", "DATABASE_NAME"];

const loadConfig = () => {
  const missingVariables = REQUIRED_VARIABLES.filter((variableName) => !process.env[variableName]);

  if (missingVariables.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missingVariables.join(", ")}`);
  }

  const port = Number(process.env.PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("La variable PORT debe ser un número entero positivo");
  }

  return {
    port,
    mongoUri: process.env.MONGODB_URI,
    databaseName: process.env.DATABASE_NAME
  };
};

module.exports = { loadConfig };
