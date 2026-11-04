const HttpError = require("../errors/http.error");

const RESERVED_FIELDS = ["_id", "name", "category", "price", "stock"];
const ATTRIBUTE_KEY_PATTERN = /^[a-zA-Z][a-zA-Z0-9]*$/;
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
const MAX_TEXT_LENGTH = 100;
const MAX_ATTRIBUTES = 10;

const isValidText = (value) => {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= MAX_TEXT_LENGTH;
};

const isValidAttributeValue = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 && value.every(isValidText);
  }

  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  return typeof value === "boolean" || isValidText(value);
};

const isPlainObject = (value) => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const validateAttributes = (attributes) => {
  if (attributes === undefined) {
    return {};
  }

  if (!isPlainObject(attributes)) {
    throw new HttpError(400, "Los atributos adicionales deben enviarse como un objeto");
  }

  const attributeEntries = Object.entries(attributes);

  if (attributeEntries.length > MAX_ATTRIBUTES) {
    throw new HttpError(400, `Un producto puede tener máximo ${MAX_ATTRIBUTES} atributos adicionales`);
  }

  for (const [attributeKey, attributeValue] of attributeEntries) {
    if (!ATTRIBUTE_KEY_PATTERN.test(attributeKey) || RESERVED_FIELDS.includes(attributeKey)) {
      throw new HttpError(400, `El nombre del atributo "${attributeKey}" no es válido`);
    }

    if (!isValidAttributeValue(attributeValue)) {
      throw new HttpError(400, `El valor del atributo "${attributeKey}" no es válido`);
    }
  }

  return attributes;
};

const validateProductInput = (requestBody) => {
  if (!isPlainObject(requestBody)) {
    throw new HttpError(400, "Los datos del producto son obligatorios");
  }

  const { name, category, price, stock, attributes } = requestBody;

  if (!isValidText(name)) {
    throw new HttpError(400, `El nombre es obligatorio y debe tener máximo ${MAX_TEXT_LENGTH} caracteres`);
  }

  if (!isValidText(category)) {
    throw new HttpError(400, `La categoría es obligatoria y debe tener máximo ${MAX_TEXT_LENGTH} caracteres`);
  }

  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    throw new HttpError(400, "El precio debe ser un número mayor o igual a cero");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new HttpError(400, "El stock debe ser un número entero mayor o igual a cero");
  }

  return {
    name: name.trim(),
    category: category.trim(),
    price,
    stock,
    ...validateAttributes(attributes)
  };
};

const validateProductId = (productId) => {
  if (!OBJECT_ID_PATTERN.test(productId)) {
    throw new HttpError(400, "El identificador del producto no es válido");
  }

  return productId;
};

const validateSaleQuantity = (requestBody) => {
  const quantity = requestBody?.quantity;

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(400, "La cantidad vendida debe ser un número entero mayor que cero");
  }

  return quantity;
};

const validateCategoryFilter = (category) => {
  if (category === undefined) {
    return undefined;
  }

  if (!isValidText(category)) {
    throw new HttpError(400, "La categoría del filtro no es válida");
  }

  return category.trim();
};

module.exports = {
  validateProductInput,
  validateProductId,
  validateSaleQuantity,
  validateCategoryFilter
};
