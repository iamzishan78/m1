import React from 'react';
import MRTTable from 'components/MRTTable';

export default function AssetManagement() {
  return (
    <>
      <div
        style={{
          marginTop: '65px',
          padding: '20px',
        }}
      >
        <MRTTable name="CustomAssetEntitiesTable" />
      </div>

      {/* <div className={classes.assetsContainer}>
        {allNewAssets &&
          allNewAssets.map((model, index) => (
            <div key={index} className={classes.columnContainer}>
              <div className={classes.entityRow}>
                <h2>Entity: {model.tableName}</h2>
                <IconButton
                  onClick={() => handleEdit(model)}
                  className={classes.actionButton}
                >
                  <EditIcon />
                </IconButton>
              </div>
              <div className={classes.tableWrapper}>
                <table className={classes.assetTable}>
                  <thead>
                    <tr>
                      <th>Column Labels</th>
                      <th>Column Keys</th>
                      <th>Column Types</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.modelKeys.map((key, idx) => (
                      <tr key={idx}>
                        <td>{key.label}</td>
                        <td>{key.mappingKey}</td>
                        <td>{key.keyType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
      </div>  */}
    </>
  );
}
