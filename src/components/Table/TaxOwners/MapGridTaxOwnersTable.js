import React, { useEffect } from "react";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";

// context
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/map-grid-tax-owners-header-schema";

// Utilities
import { usetableStyles } from "../Styles";

function MapGridTaxOwnersTable(props) {
  const classes = usetableStyles();
  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );

  const formatColumns = (headers, hits) => {
    return headers;
  };

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  useEffect(() => {
    setTableMeta({
      addableName: "Tax Owners",
      extendSearchQuery: searchInput ? `ownerName:*${searchInput}*`: '',
      TableHeader: copy(TableHeader),
      esIndex: "platformData:globalowner",
      startPaginationAt: 25,
      formatColumns,
    });
    // eslint-disable-next-line
  }, [
    searchInput,
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

export default React.memo(TableESHOC(MapGridTaxOwnersTable), deepEqualObjects);
