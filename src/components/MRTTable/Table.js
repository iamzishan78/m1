import React, { memo } from 'react';
import useTableESSimple from 'components/MRTTable/Hooks/useTableESSimple';
import AllDialogs from 'components/MRTTable/Common/Dialog';
import { ErrorBoundary } from "react-error-boundary";
import MRTFallback from "components/MRTTable/MRTFallBack"
import { MaterialReactTable } from 'material-react-table';

function Table({ tableKey, hideSharedCommentCheck }) {
  const { tableProps, tablePropsState, classes } = useTableESSimple(tableKey);

  return (
    <ErrorBoundary
      FallbackComponent={({ error }) => <MRTFallback tableKey={tableKey} error={error} />}
    >
      <div className={classes.table}>
        <MaterialReactTable
          {...tableProps}
          state={{
            ...tablePropsState,
          }}
        />
        <AllDialogs hideSharedCommentCheck={hideSharedCommentCheck} />
      </div>
    </ErrorBoundary>
  );
}

export default memo(Table);