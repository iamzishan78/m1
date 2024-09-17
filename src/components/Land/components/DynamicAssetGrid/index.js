import React, { useMemo, useEffect } from 'react';
import MRTTable from 'components/MRTTable';
import { useSelector } from 'react-redux';
import { ALL_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';
import { tableGlobalController } from 'hookstate/tableController';
function DynamicAssetGrid() {
  const { activeModule } = useSelector(({ common }) => common);

  // Override meta for dynamic grid
  const overrideMeta = useMemo(() => ({
      esIndex: activeModule.title.replace(/\s+/g, '').toLowerCase() + '_flats',
      fetchDynamicSchema: {
        query: ALL_CUSTOM_ASSET_INFO,
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
