import { formatAttributeLabel, formatAttributeValue, formatPrice } from "./formatters.js";

const COMMON_FIELDS = ["_id", "name", "category", "price", "stock"];

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined) {
    element.textContent = textContent;
  }

  return element;
}

function createAttributeList(product) {
  const attributeList = createElement("dl", "attribute-details");
  const extraAttributes = Object.entries(product).filter(([fieldName]) => !COMMON_FIELDS.includes(fieldName));

  for (const [attributeKey, attributeValue] of extraAttributes) {
    attributeList.append(
      createElement("dt", "", formatAttributeLabel(attributeKey)),
      createElement("dd", "", formatAttributeValue(attributeValue))
    );
  }

  return attributeList;
}

function createStockLabel(stock) {
  if (stock === 0) {
    return createElement("p", "stock stock-empty", "Agotado");
  }

  return createElement("p", "stock", `${stock} disponibles`);
}

function createCardActions(product, actionHandlers) {
  const actions = createElement("div", "card-actions");
  const saleButton = createElement("button", "button button-primary", "Vender");
  const deleteButton = createElement("button", "button button-ghost", "Eliminar");

  saleButton.type = "button";
  saleButton.disabled = product.stock === 0;
  saleButton.addEventListener("click", () => actionHandlers.onSale(product));

  deleteButton.type = "button";
  deleteButton.addEventListener("click", () => actionHandlers.onDelete(product));

  actions.append(saleButton, deleteButton);
  return actions;
}

function createProductCard(product, actionHandlers) {
  const card = createElement("article", "product-card");

  card.append(
    createElement("span", "category-chip", product.category),
    createElement("h3", "product-name", product.name),
    createElement("p", "product-price", formatPrice(product.price)),
    createStockLabel(product.stock),
    createAttributeList(product),
    createElement("p", "product-id", `_id: ${product._id}`),
    createCardActions(product, actionHandlers)
  );

  return card;
}

export function renderProductGrid(gridElement, products, actionHandlers) {
  gridElement.replaceChildren();

  if (products.length === 0) {
    gridElement.append(createElement("p", "empty-state", "No hay productos para mostrar."));
    return;
  }

  for (const product of products) {
    gridElement.append(createProductCard(product, actionHandlers));
  }
}
