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
  if (obj === null || obj === undefined) return undefined;
  if (obj === 'NaN') return null;

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = extractValueRecursively(obj[key]?.value !== undefined ? obj[key]?.value : obj[key]);
      acc[key] = value !== undefined ? value : obj[key];
      return acc;
    }, {});
  }

  return obj;
};

// Helper for replacing spaces with underscore
export const removeSpacesAndLowercase = (key) => key?.replace(/\s+/g, '_')?.toLowerCase();

// Helper for removing spaces
export const removeSpaces = (key) => key?.replace(/\s+/g, '').toLowerCase();
