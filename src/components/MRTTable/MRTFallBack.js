import React, { useMemo, memo } from 'react';
import { tableController } from 'hookstate/tableController';
import MRTTable from 'components/MRTTable';

function MRTFallback({ tableKey, error, resetErrorBoundary }) {
  const isMaximumUpdateDepthError = error && error.message.includes('Maximum update depth exceeded');

  if (!isMaximumUpdateDepthError) {
    return (
      <div>
        <p>Something went wrong:</p>
        <p style={{ color: 'red' }}>{error.message}</p>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  }

  const tableState = tableController(tableKey).useCompleteState();
  const tableStateValues = tableState?.get({ noproxy: true });

  // we need to handle the use case in which we hide column 1 by 1
  const schema = tableStateValues.TableSchema
  const visibility = tableStateValues.columnVisibility


  schema.forEach((item) => {
    const key = item.id || item.accessorKey;
    if (visibility[key] !== undefined) {
      item.hidden = visibility[key];
    }
  });

  const overrideMeta = useMemo(() => ({
    ...tableStateValues,
    columnVirtualization: false,
    TableSchema: schema,
  }), []);

  return (
    <div >
      <MRTTable name={tableKey} overrideMeta={overrideMeta} />
    </div>
  );
}

export default memo(MRTFallback);