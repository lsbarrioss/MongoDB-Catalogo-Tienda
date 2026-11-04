const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

const ATTRIBUTE_LABELS = {
  brand: "Marca",
  ramGb: "RAM (GB)",
  storageGb: "Capacidad (GB)",
  colors: "Colores",
  wireless: "Inalámbrico",
  gender: "Género",
  sizes: "Tallas",
  material: "Material",
  author: "Autor",
  pages: "Páginas",
  capacityCups: "Capacidad (tazas)",
  dimensions: "Dimensiones",
  heightCm: "Alto (cm)",
  widthCm: "Ancho (cm)",
  weightKg: "Peso (kg)",
  warrantyMonths: "Garantía (meses)"
};

export function formatPrice(price) {
  return currencyFormatter.format(price);
}

export function formatAttributeLabel(attributeKey) {
  return ATTRIBUTE_LABELS[attributeKey] ?? attributeKey;
}

export function formatAttributeValue(attributeValue) {
  if (Array.isArray(attributeValue)) {
    return attributeValue.join(", ");
  }

  if (typeof attributeValue === "boolean") {
    return attributeValue ? "Sí" : "No";
  }

  if (attributeValue !== null && typeof attributeValue === "object") {
    return Object.entries(attributeValue)
      .map(([nestedKey, nestedValue]) => `${formatAttributeLabel(nestedKey)}: ${formatAttributeValue(nestedValue)}`)
      .join(" · ");
  }

  return String(attributeValue);
}
