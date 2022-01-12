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

const genericDataActions = ['comments', 'tags', 'ifAreContacts']

function MapGridTaxOwnersTable(props) {
  const classes = usetableStyles();
  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );

  const formatColumns = (headers, hits) => {
    return headers;
  };

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
      return hit;
    });
    return hits
  }

  useEffect(() => {
    props.setTableMeta({
      addableName: "Tax Owners",
      extendSearchQuery: (() => {
        let searchString = ""
        if (searchInput) {
          searchString = searchInput.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1").split(/\s+/)
        }
    
        return searchString
          ? `(ownerName:(${searchString.join('* AND ')}*))^4 OR (ownerName:(${searchString.join('* ')}*))^2 OR (_all:(${searchString.join('* ')}*))`
          : ""
      })(),
      TableHeader: copy(TableHeader),
      esIndex: "platformData:globalowner",
      startPaginationAt: 25,
      formatColumns,
      formatHits,
      initializeGenericData: { key: 'id', actions: ['comments', 'tracks', 'tags', 'ifAreContacts'] }
    });
    // eslint-disable-next-line
  }, [
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

export default React.memo(TableESHOC(MapGridTaxOwnersTable), deepEqualObjects);
