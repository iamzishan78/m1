import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import debounce from "lodash/debounce";

// context
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/map-grid-unit-header-schema";

// Utilities
import { usetableStyles } from "components/Table/Styles";

function MapGridUnitTable(props) {
  // const defaultView = {
  //   name: `All Units`,
  //   type: "Default",
  // };

  const classes = usetableStyles();
  const [searchInput, setSearchInput] = useState(null);

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    return hits;
  };

  // useEffect(() => {
  //   setSelectedGridView(GridViewModule || defaultView);
  // }, [GridViewModule]);

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: searchInput,
      // selectedGridView: GridViewModule || defaultView,
      searchFields: ["*"],
      TableHeader: copy(TableHeader),
      esIndex: "shapes_flat",
      startPaginationAt: 25,
      // typeKeyword: { gridViewCategory: "Units", metaModule: "Unit" },
      filters: [
        {
          field: "layer.keyword",
          value: "unit",
        },
        {
          field: "shapeJson.properties.",
        },
      ],
      defaultSort: { field: "_ts", order: "desc" },
      formatHits,
    });
    // eslint-disable-next-line
  }, [searchInput]);

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
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

export default React.memo(TableESHOC(MapGridUnitTable), deepEqualObjects);
