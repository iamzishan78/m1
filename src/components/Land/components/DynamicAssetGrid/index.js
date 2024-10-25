import React, { useMemo, useEffect } from 'react';
import MRTTable from 'components/MRTTable';
import { useSelector } from 'react-redux';
import { tableGlobalController } from 'hookstate/tableController';
function DynamicAssetGrid() {
  const { activeModule } = useSelector(({ common }) => common);

  // Override meta for dynamic grid
  const overrideMeta = useMemo(() => ({
      esIndex: activeModule.title.replace(/\s+/g, '').toLowerCase() + '_flats',
      assetName: activeModule.title,
      fetchDynamicSchema: {
        variables: {
          tableName: activeModule.title,
        },
        tableName: activeModule.title,
      },
    }),
    [activeModule]
  );

  // Re-Initialize table controller
  useEffect(() => {
    tableGlobalController.reInitialized();
  }, [activeModule]);


  return (
    <div
      style={{
        marginTop: '65px',
      }}
    >
      {/* Dynamic asset grid */}
      <MRTTable name="DynamicAssetTable" overrideMeta={overrideMeta} />
    </div>
  );
}
export default DynamicAssetGrid;
