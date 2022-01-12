import React, { useEffect } from "react";
import moment from "moment";
// context
import { Container, } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";


import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas 
import TableHeader from "components/Table/constants/property-interest-details-header-schema";

// Utilities
import { usetableStyles } from "../Styles";

function PropertyInterestDetailsTable(props) {
  const classes = usetableStyles();

  const formatHits = (hits) => {
    return hits.map(hit => {
      hit.effectiveDate = moment(hit.effectiveDate).format('MM/DD/YYYY')
      return hit
    })
  }

  useEffect(() => {
    props.setTableMeta({
      addableName: "Property Interest",
      addBtnText: 'INTEREST',
      extendSearchQuery: `property._id:(${props.propertyId})`,
      TableHeader: copy(TableHeader),
      esIndex: 'propertyinterest_flat',
      startPaginationAt: 25,
      formatHits
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(props.addToTable){
      props.onClickAdd()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[props.addToTable])

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
      />
    </Container>
  );
}

export default React.memo(TableESHOC(PropertyInterestDetailsTable), deepEqualObjects);