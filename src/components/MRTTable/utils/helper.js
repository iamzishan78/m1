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