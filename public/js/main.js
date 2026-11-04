import { createProduct, createSale, deleteProduct, fetchCategorySummary, fetchProducts } from "./api.js";
import { renderCategoryOptions, renderSummaryTable } from "./categoryViews.js";
import { renderProductGrid } from "./productCards.js";
import { addAttributeRow, readProductForm, resetProductForm } from "./productForm.js";

const STATUS_DURATION_MS = 4000;
const SALE_QUANTITY = 1;

const statusMessage = document.querySelector("#status-message");
const categoryFilter = document.querySelector("#category-filter");
const categoryOptions = document.querySelector("#category-options");
const productGrid = document.querySelector("#product-grid");
const productForm = document.querySelector("#product-form");
const attributeList = document.querySelector("#attribute-list");
const attributeRowTemplate = document.querySelector("#attribute-row-template");
const addAttributeButton = document.querySelector("#add-attribute-button");
const summaryBody = document.querySelector("#summary-body");

let statusTimeoutId = null;

function showStatus(message, statusType) {
  statusMessage.textContent = message;
  statusMessage.dataset.type = statusType;
  statusMessage.hidden = false;
  clearTimeout(statusTimeoutId);
  statusTimeoutId = setTimeout(() => {
    statusMessage.hidden = true;
  }, STATUS_DURATION_MS);
}

async function loadSummary() {
  const categorySummary = await fetchCategorySummary();
  renderSummaryTable(summaryBody, categorySummary);
  renderCategoryOptions(categoryFilter, categoryOptions, categorySummary.map((categoryRow) => categoryRow.category));
}

async function loadProducts() {
  const products = await fetchProducts(categoryFilter.value);
  renderProductGrid(productGrid, products, { onSale: handleSale, onDelete: handleDelete });
}

async function refreshStore() {
  try {
    await loadSummary();
    await loadProducts();
  } catch (error) {
    showStatus(error.message, "error");
  }
}

async function handleSale(product) {
  try {
    await createSale(product._id, SALE_QUANTITY);
    showStatus(`Venta registrada: ${product.name}`, "success");
    await refreshStore();
  } catch (error) {
    showStatus(error.message, "error");
  }
}

async function handleDelete(product) {
  if (!confirm(`¿Eliminar "${product.name}" del catálogo?`)) {
    return;
  }

  try {
    await deleteProduct(product._id);
    showStatus(`Producto eliminado: ${product.name}`, "success");
    await refreshStore();
  } catch (error) {
    showStatus(error.message, "error");
  }
}

async function handleProductSubmit(event) {
  event.preventDefault();

  if (!productForm.reportValidity()) {
    return;
  }

  try {
    const createdProduct = await createProduct(readProductForm(productForm, attributeList));
    resetProductForm(productForm, attributeList);
    showStatus(`Producto guardado: ${createdProduct.name}`, "success");
    await refreshStore();
  } catch (error) {
    showStatus(error.message, "error");
  }
}

categoryFilter.addEventListener("change", refreshStore);
addAttributeButton.addEventListener("click", () => addAttributeRow(attributeList, attributeRowTemplate));
productForm.addEventListener("submit", handleProductSubmit);

refreshStore();
