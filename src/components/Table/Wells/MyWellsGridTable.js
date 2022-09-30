import React, { useEffect, useContext } from "react";
import { Container } from "@material-ui/core";
import { debounce, get } from "lodash";

// context
import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/my-wells-grid-header-schema";

// Utilities
import { usetableStyles } from "../Styles";

function MyWellsGridTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      const properties = get(hit, "properties", []);
      const propertiesKeys = { internalID: [], propertiesNames: [], prospectID: [], internalCompany: [], divOrderStatus: [] };
      properties.forEach(property => {
        propertiesKeys.internalID.push(property.internalID);
        propertiesKeys.propertiesNames.push(property.name);
        propertiesKeys.prospectID.push(property.prospectID);
        propertiesKeys.internalCompany.push(property.internalCompany);
        propertiesKeys.divOrderStatus.push(property.divOrderStatus);
      });
      hit = {
        ...hit.wellData,
        sort: hit.sort,
        ...propertiesKeys
      };
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    setTableMeta({
      filters: props.filters,
      addBtnText: "WELLS",
      extendSearchQuery: stateApp.landSearchQuery,
      searchFields: ["*"],
      TableHeader: copy(TableHeader),
      esIndex: "mywells_flat",
      startPaginationAt: 50,
      defaultSort: { field: "lastUpdateAt", order: "desc" },
      formatHits,
    });
    // eslint-disable-next-line
  }, [stateApp.landSearchQuery, props.filters]);

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
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(MyWellsGridTable), deepEqualObjects);
