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
import { layer } from "@fortawesome/fontawesome-svg-core";

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
    let rows = stateApp.map.querySourceFeatures(selectedLayer.layerPaintProps[0].sourceProps, {
      sourceLayer: selectedLayer.identifier
    });
    if (rows?.length > 0) {
      rows = rows.filter((row) => row.properties.layerGeometry === selectedLayer.layerGeometry)
      setRows(rows.map((row, index) => {
        const newProperties = {}
        Object.keys(row.properties).forEach((col, index) => {
          newProperties[col.replace(/ /g, '_').replace(/\(/g, '').trim()] = row.properties[col]
        })
        if (!newProperties.ID) {
          newProperties.ID = index + 1
        }
        if (selectedLayer.layerGeometry === 'Point') {
          newProperties.Lng = row.geometry.coordinates[0]
          newProperties.Lat = row.geometry.coordinates[1]
        }
        return { ...newProperties, geom: JSON.stringify(row.geometry) }
      }));

      const predefinedCols = [
        {
          name: 'ID', label: 'ID',
          options: { customRender: (value) => { return <div>{value}</div>; } }
        },
        {
          name: 'geom', label: 'geom',
          options: { customRender: (value) => { return <div>{value}</div>; } }
        },
      ]
      if (selectedLayer.layerGeometry === 'Point') {
        predefinedCols.push({
          name: 'Lng', label: 'Lng',
          options: { customRender: (value) => { return <div>{value}</div>; } }
        })
        predefinedCols.push({
          name: 'Lat', label: 'Lat',
          options: { customRender: (value) => { return <div>{value}</div>; } }
        })
      }

      setColumns([
        ...predefinedCols,
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

      return () => {
        clearInterval(interval)
      }
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
