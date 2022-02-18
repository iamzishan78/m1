import React, { useEffect, useContext } from "react";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";

// context
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects } from "components/Shared/functions";

// Header Schemas
import uniqBy from "lodash/uniqBy";

import { AppContext } from "AppContext";

// Utilities
import { usetableStyles } from "../Styles";

function MapGridLayersTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);
  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );

  const formatColumns = (_, hits) => {
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
    if (stateApp.selectedLayer.layerGeometry === 'Point') {
      predefinedCols.push({
        name: 'Lng', label: 'Lng',
        options: { customRender: (value) => { return <div>{value}</div>; } }
      })
      predefinedCols.push({
        name: 'Lat', label: 'Lat',
        options: { customRender: (value) => { return <div>{value}</div>; } }
      })
    }
    let headers = [
      ...predefinedCols,
      ...Object.keys(hits[0]).map((column) => ({
        name: column.replace(/ /g, '_').replace(/\(/g, '').trim(), label: column,
        options: { customRender: (value) => { return <div>{value}</div>; } }
      }))
    ]

    headers = uniqBy(headers, 'name');
    return headers
  };

  const formatHits = (hits) => {

    hits = hits.map((hit, index) => {
      const newProperties = {}
      Object.keys(hit.properties).forEach((col, index) => {
        newProperties[col.replace(/ /g, '_').replace(/\(/g, '').trim()] = hit.properties[col]
      })
      if (!newProperties.ID) {
        newProperties.ID = index + 1
      }
      if (stateApp.selectedLayer.layerGeometry === 'Point') {
        newProperties.Lng = hit.geometry.coordinates[0]
        newProperties.Lat = hit.geometry.coordinates[1]
      }
      return { ...newProperties, geom: JSON.stringify(hit.geometry) }
    })
    return hits
  }

  useEffect(() => {
    props.setTableMeta({
      extendSearchQuery: searchInput,
      searchFields: ["_all"],
      TableHeader: [],
      filters: [{ field: "file._id", value: stateApp.selectedLayer.file }, { field: "properties.layerGeometry", value: stateApp.selectedLayer.layerGeometry }],
      esIndex: "shapefile_flat",
      startPaginationAt: 25,
      formatColumns,
      formatHits,
    });
    // eslint-disable-next-line
  }, [
    stateApp.selectedLayer,
    searchInput
  ]);

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        total={false}
        loading={props.loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(MapGridLayersTable), deepEqualObjects);
