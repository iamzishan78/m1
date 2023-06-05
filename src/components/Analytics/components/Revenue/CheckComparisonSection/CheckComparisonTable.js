import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { Container } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from "components/Table/constants/check-comparison-header-schema";
import convert_date from "components/Shared/valueformatters/convert_date.js";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
    "& .MuiTableCell-head": {
      paddingLeft: (p) => (p.isAgreementsTable ? "17px !important" : " "),
    },
    "& .MuiTableRow-hover": {
      "&:hover": {
        "& .MuiTableCell-root": {
          backgroundColor: "#dfdfdf !important",
        },
      },
    },
    "& .MuiTableRow-footer": {
      visibility: (p) => (p.isHideFooter ? "hidden" : ""),
      display: (p) => (p.isHideFooter ? "none" : ""),
    },
    "& .MuiGrid-item": {
      display: "flex",
      alignItems: "center",
    },
    "& .MuiTableHead-root, .MuiTableRow-head, .MuiPaper-root > .MuiToolbar-gutters": {
      position: "sticky",
      top: 0,
    },
    "& .MUIDataTable-responsiveBase": {
      maxHeight: "35vh",
    },
  },
}));

function CheckComparisonSection(props) {
  const classes = useStyles();
  const { setTableMeta } = props;
  const [getESSimpleFilter] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    (async () => {
      const count = await getESCounts("property.IsDeleted", false, "term");
      props.onGettingAnalytics({
        properties: count,
      });
    })();
  }, [props.rows]);

  useEffect(() => {
    setTableMeta({
      filters: props.esFilters,
      TableHeader: copy(TableHeader),
      esIndex: "checkdetailsinterestscomparison_flat",
      startPaginationAt: 50,
      //defaultSort: { field: "flatSyncAt", order: "desc" },
      formatHits,
      downloadAll: { exportPx: "176px" },
    });
  }, [setTableMeta, props.esFilters]);

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.internalID = hit.property?.internalID;
      hit.checkNumber = hit.check?.checkNumber;
      hit.prospectID = hit.property?.prospectID;
      hit.operator = hit.property?.operator?.name;
      hit.status = hit.property?.status;
      hit.wellApiNumber = hit.wells.length > 1 ? "MULTIPLE" : hit.wells[0]?.apiNumber || "";
      hit.wellName = hit.wells.length > 1 ? "MULTIPLE" : hit.wells[0]?.wellName || "";
      hit.purchaserNumber = hit.property?.purchaserNumber;
      hit.acquisitionID = hit.property?.acquisitionID;
      hit.internalCompany = hit.property?.internalCompany;
      hit.accRefID = hit?.property?.internalID;
      hit.companyID = hit?.property?.internalID;
      hit.number = hit.property?.number;
      hit.name = hit.property?.name;
      hit.purchaser = hit.property?.purchaser?.name;
      hit.state = hit.property?.state;
      hit.county = hit.property?.county;
      hit.ownerNumber = hit.property?.ownerNumber;
      hit._owner = hit.property?._owner?.name;
      hit.checkAmount = hit.check?.checkAmount;
      hit.source = hit.check?.source;
      hit.sourceId = hit.check?.sourceId;
      hit.propertyName = hit.property?.name;
      hit.date = hit.date ? convert_date(hit.date) : null;
      hit.checkDate = hit.check?.checkDate ? convert_date(hit.check.checkDate) : null;
      hit.checkId = hit.check?._id;
      hit.depositDate = hit.check?.depositDate ? convert_date(hit.check.depositDate) : null;
      hit.propertyId = hit.property?._id;
      hit.interestType = hit.property?.interest?.interestType;
      hit.interestAmount = hit.property?.interest?.interestAmount;
      hit.effectiveDate = hit.property?.interest?.effectiveDate;
      hit.endDate = hit.property?.interest?.endDate;
      hit.interestStatus = hit.property?.interest?.status;
      hit.costFree = hit.property?.interest?.costFree;
      return hit;
    });
  };

  const getESCounts = (key, value, type) => {
    return new Promise((resolve, reject) => {
      getESSimpleFilter({
        variables: {
          index: "checkdetailsinterestscomparison_flat",
          filters: [...props.esFilters, { field: key, value: value, type }],
          filterKey: "property._id.keyword",
          filterAggs: { query: "", field: "property._id.keyword", size: props.total || 0 },
        },
        onCompleted: (res) => resolve(res?.getESSimpleFilter?.hits?.length),
        onError: (error) => reject(error),
      });
    });
  };

  return (
    <Container maxWidth={false} className={`${classes.container}`}>
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
        addAble={{ type: "revenueStatementDetails" }}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(CheckComparisonSection), deepEqualObjects);
