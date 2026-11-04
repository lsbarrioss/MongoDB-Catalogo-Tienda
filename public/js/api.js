const API_BASE_PATH = "/api";
const DEFAULT_ERROR_MESSAGE = "Ocurrió un error inesperado";

async function sendRequest(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_PATH}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor");
  }

  if (response.status === 204) {
    return null;
  }

  const responseBody = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(responseBody?.message ?? DEFAULT_ERROR_MESSAGE);
  }

  return responseBody;
}

export function fetchProducts(category) {
  const query = category ? `?category=${encodeURIComponent(category)}` : "";
  return sendRequest(`/products${query}`);
}

export function createProduct(product) {
  return sendRequest("/products", { method: "POST", body: JSON.stringify(product) });
}

export function createSale(productId, quantity) {
  return sendRequest(`/products/${productId}/sales`, { method: "POST", body: JSON.stringify({ quantity }) });
}

export function deleteProduct(productId) {
  return sendRequest(`/products/${productId}`, { method: "DELETE" });
}

export function fetchCategorySummary() {
  return sendRequest("/categories/summary");
}
