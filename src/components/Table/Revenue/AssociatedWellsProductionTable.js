import React, { useEffect } from "react";
import moment from "moment";
// context
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/property-interest-details-header-schema";

// Utilities
import { usetableStyles } from "../Styles";
import { getFilters } from "../Contact/CampaignsTable";

function AssociatedWellsProductionTable(props) {
  const classes = usetableStyles();

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.effectiveDate = hit.effectiveDate ? moment(hit.effectiveDate).format("MM/DD/YYYY") : null;
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
  };

  const getFilters = () => {
    return [
        { field:'type.keyword', value:'Expiration' },
        { field:'type.keyword', value:'Option to Extend' }
      ]
  }

  useEffect(() => {
    props.setTableMeta({
      searchFields: ["owner.entityDetail.name", "_all"],
      filters: getFilters(),
      TableHeader: copy(TableHeader),
      esIndex: "mywellproduction_flats",
      startPaginationAt: 25,
      formatHits,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.associatedWellIds]);


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
        options={props.options}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(
  TableESHOC(AssociatedWellsProductionTable),
  deepEqualObjects
);
