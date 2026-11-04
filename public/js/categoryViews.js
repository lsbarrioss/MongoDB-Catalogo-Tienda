import { formatPrice } from "./formatters.js";

function createCell(textContent) {
  const cell = document.createElement("td");
  cell.textContent = textContent;
  return cell;
}

function createOption(category) {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  return option;
}

export function renderSummaryTable(tableBody, categorySummary) {
  tableBody.replaceChildren();

  for (const categoryRow of categorySummary) {
    const row = document.createElement("tr");
    row.append(
      createCell(categoryRow.category),
      createCell(String(categoryRow.totalProducts)),
      createCell(String(categoryRow.totalStock)),
      createCell(formatPrice(categoryRow.averagePrice))
    );
    tableBody.append(row);
  }
}

export function renderCategoryOptions(selectElement, datalistElement, categories) {
  const selectedCategory = selectElement.value;
  const defaultOption = selectElement.options[0];

  selectElement.replaceChildren(defaultOption, ...categories.map(createOption));
  selectElement.value = categories.includes(selectedCategory) ? selectedCategory : "";
  datalistElement.replaceChildren(...categories.map(createOption));
}
