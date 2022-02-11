import React, { useContext, useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";

// context
import { AppContext } from "AppContext";
import Table from "components/Shared/M1nTable/components/Table";
import MUIDataTable, { TableViewCol } from "mui-datatables";
import { NavigationContext } from "components/Navigation/NavigationContext";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas


// Utilities
import { usetableStyles } from "../Styles";

function MapGridLayersTable(props) {
  const classes = usetableStyles();

  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState([])
  const [stateApp] = useContext(AppContext);

  const setRowsCount = (selectedLayer) => {
    const rows = stateApp.map.querySourceFeatures(selectedLayer.layerPaintProps[0].sourceProps, {
      sourceLayer: selectedLayer.identifier
    });
    if (rows) {
      setRows(rows.map((row) => {
        const newProperties = {}
        Object.keys(row.properties).forEach((col, index) => {
          newProperties[col.replace(/ /g, '_').replace(/\(/g, '').trim()] = row.properties[col]
        })
        return { ...newProperties, geom: JSON.stringify(row.geometry) }
      }));

      setColumns([
        {
          name: 'geom', label: 'geom',
          options: { filter: false, sort: false, index: 1, searchable: false, customRender: (value) => { return <div>{value}</div>; } }
        },
        ...Object.keys(rows[0].properties).map((column) => ({
          name: column.replace(/ /g, '_').replace(/\(/g, '').trim(), label: column,
          options: { customRender: (value) => { return <div>{value}</div>; } }
        }))
      ])
    }
    return rows
  }

  useEffect(() => {
    if (stateApp?.selectedLayer?.file) {
      setRowsCount(stateApp.selectedLayer)
      const interval = setInterval(() => {
        if (setRowsCount(stateApp.selectedLayer).length > 0) clearInterval(interval);
      }, 1000);
    }
  }, [stateApp.selectedLayer, stateApp.map])



  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={rows}
        total={false}
        // loading={props.loading}
        // targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        // onTableChange={props.onTableChange}
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        // parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(MapGridLayersTable, deepEqualObjects);
