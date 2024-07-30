export const formatGridViewToMRT = (selectedGridView) => {
  const tableProperties = {}
  if (selectedGridView?.columns) {
    tableProperties.columnVisibility = selectedGridView?.columns.reduce((acc, obj) => {
      acc[obj.name] = obj.display;
      return acc;
    }, {});
  }
  if (selectedGridView?.filters?.length) {
    tableProperties.filters = selectedGridView.filters
  }
  if (selectedGridView?.sorting?.length) {
    tableProperties.sorting = selectedGridView.sorting;
  }
  if (selectedGridView?.columnPinning) {
    tableProperties.columnPinning = selectedGridView.columnPinning;
  }
  if (selectedGridView?.columnOrdering) {
    tableProperties.columnOrdering = selectedGridView.columnOrdering;
  }

  return tableProperties
}

// Helper for extracting values
export const extractValueRecursively = (obj) => {
  if (obj === null || obj === undefined || obj === 'NaN') return undefined;

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      if (key === 'NaN') return acc; // Skip keys that are "NaN"
      const value = extractValueRecursively(obj[key]?.value !== undefined ? obj[key]?.value : obj[key]);
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  return obj;
};

