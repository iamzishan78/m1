import React, { useContext, useEffect, useState } from "react";
import { Container } from "@material-ui/core";

// context
import { AppContext } from "AppContext";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects } from "components/Shared/functions";

// Header Schemas


// Utilities
import { usetableStyles } from "../Styles";
import { useSelector } from "react-redux";

function MapGridLayersTable(props) {
  const classes = usetableStyles();

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [columns, setColumns] = useState([])
  const [stateApp] = useContext(AppContext);

  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );

  const setRowsCount = (selectedLayer) => {
    const rows = stateApp.map.querySourceFeatures(selectedLayer.layerPaintProps[0].sourceProps, {
      sourceLayer: selectedLayer.identifier
    });
    if (rows?.length > 0) {
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
    return rows || 0
  }

  useEffect(() => {
    if (stateApp?.selectedLayer?.file) {
      setRows([])
      setLoading(true)
      let rows = setRowsCount(stateApp.selectedLayer)
      const interval = setInterval(() => {
        if (rows.length > 0) {
          setLoading(false)
          clearInterval(interval)
        }
        else
          rows = setRowsCount(stateApp.selectedLayer)
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
        loading={loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        // onTableChange={props.onTableChange}
        options={{
          ...props.options,
          ...props.customOptions,
          search: false,
          serverSide: false,
          searchText: searchInput,
        }}
        // parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(MapGridLayersTable, deepEqualObjects);
