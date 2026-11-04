const LIST_SEPARATOR = ",";
const TRUE_VALUES = ["sí", "si", "true"];
const FALSE_VALUES = ["no", "false"];

function parseAttributeValue(rawValue) {
  const trimmedValue = rawValue.trim();
  const normalizedValue = trimmedValue.toLowerCase();

  if (TRUE_VALUES.includes(normalizedValue)) {
    return true;
  }

  if (FALSE_VALUES.includes(normalizedValue)) {
    return false;
  }

  if (trimmedValue.includes(LIST_SEPARATOR)) {
    return trimmedValue
      .split(LIST_SEPARATOR)
      .map((listItem) => listItem.trim())
      .filter((listItem) => listItem.length > 0);
  }

  const numericValue = Number(trimmedValue);
  return Number.isFinite(numericValue) ? numericValue : trimmedValue;
}

function readAttributes(attributeList) {
  const attributes = {};

  for (const attributeRow of attributeList.querySelectorAll(".attribute-row")) {
    const attributeKey = attributeRow.querySelector(".attribute-key").value.trim();
    const attributeValue = attributeRow.querySelector(".attribute-value").value;
    attributes[attributeKey] = parseAttributeValue(attributeValue);
  }

  return attributes;
}

export function addAttributeRow(attributeList, rowTemplate) {
  const attributeRow = rowTemplate.content.firstElementChild.cloneNode(true);
  attributeRow.querySelector(".button-remove").addEventListener("click", () => attributeRow.remove());
  attributeList.append(attributeRow);
  attributeRow.querySelector(".attribute-key").focus();
}

export function readProductForm(form, attributeList) {
  const formData = new FormData(form);

  return {
    name: formData.get("name").trim(),
    category: formData.get("category").trim(),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    attributes: readAttributes(attributeList)
  };
}

export function resetProductForm(form, attributeList) {
  form.reset();
  attributeList.replaceChildren();
}
