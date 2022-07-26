import React, { useEffect } from "react";
import { Container } from "@material-ui/core";
import { debounce, get } from "lodash";

// context
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/campaign-units-header-schema.js";

// Utilities
import { usetableStyles } from "components/Table/Styles";

function MapGridUnitTable(props) {
  const classes = usetableStyles();

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

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: null,
      // selectedGridView: GridViewModule || defaultView,
      searchFields: ["name^4", "_all"],
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
          field: "shapeJson.properties.campaignName.keyword",
          value: "Martin",
        },
      ],
      defaultSort: { field: "_ts", order: "desc" },
      formatHits,
    });
    // eslint-disable-next-line
  }, [props.campaign]);

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
