import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { Container } from "@material-ui/core";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { deepEqualObjects, copy } from "components/Shared/functions";
import TableHeader from "components/Table/constants/check-comparison-header-schema";
import convert_date from "components/Shared/valueformatters/convert_date.js";
import { makeStyles } from "@material-ui/styles";
import { GET_REVENUE_ANALYTICS_COUNT } from "graphQL/useQueryRevenueAnalyticsCounts";

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
  const [getPropertyNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: "no-cache",
  });
  const [getCheckNumbers] = useLazyQuery(GET_ES_SIMPLE_FILTER, {
    fetchPolicy: "no-cache",
  });
  const [getRevenueAnalyticsCount] = useLazyQuery(GET_REVENUE_ANALYTICS_COUNT, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    (async () => {
      props.setTotalChecks(props.total);
      const { propertiesCount, revenueComparisonAnalytics, propertyNumbersHits, checkNumbersHits } = await getRevenueComparisonAnalytics();
      const propertyNumbers = propertyNumbersHits ? propertyNumbersHits.map((hit) => hit.key) : [];
      const checkNumbers = checkNumbersHits ? checkNumbersHits.map((hit) => hit.key) : [];
      props.onGettingAnalytics({
        propertiesCount: propertiesCount,
        checksCount: revenueComparisonAnalytics?.distinctChecksCount,
        misMatchedInterestsCount: revenueComparisonAnalytics?.misMatchedCount,
        potentialGainLossSum: revenueComparisonAnalytics?.potentialGainLossSum[0]?.totalSum,
        propertyNumbers: propertyNumbers,
        checkNumbers: checkNumbers,
      });
    })();
  }, [props.rows]);

  useEffect(() => {
    props.setESFilters(props.initialFilters);
    // eslint-disable-next-line
  }, [props.initialFilters]);

  useEffect(() => {
    let requiredEsFilters = props.esFilters.filter(
      (esFilter) =>
        esFilter.field === "property.state.keyword" ||
        esFilter.type === "range" ||
        esFilter.field === "isMisMatchedInterest"
    );
    if (!props.initialFilters.find((initialFilter) => initialFilter.field === "check.checkNumber.keyword")) {
      const checkNumberFilter = props.esFilters.find((esFilter) => esFilter.field === "check.checkNumber.keyword");
      if (checkNumberFilter) requiredEsFilters.push(checkNumberFilter);
    }

    if (!props.initialFilters.find((initialFilter) => initialFilter.field === "property.number.keyword")) {
      const propertyNumberFilter = props.esFilters.find((esFilter) => esFilter.field === "property.number.keyword");
      if (propertyNumberFilter) requiredEsFilters.push(propertyNumberFilter);
    }

    setTableMeta({
      filters: requiredEsFilters,
      TableHeader: copy(TableHeader),
      esIndex: "checkdetailsinterestscomparison_flat",
      parent: 'checkDetailsComparison',
      startPaginationAt: 50,
      defaultSort: { field: "flatSyncAt", order: "desc" },
      formatHits,
      downloadAll: { exportPx: "176px" },
      datasets: { exportGrid: true }
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
      hit.effectiveDate = hit.property?.interest?.effectiveDate ? convert_date(hit.property?.interest?.effectiveDate) : null;
      hit.endDate = hit.property?.interest?.endDate;
      hit.interestStatus = hit.property?.interest?.status;
      hit.costFree = hit.property?.interest?.costFree;
      return hit;
    });
  };

  const getRevenueComparisonAnalytics = async () => {
    const propertiesPromise = new Promise((resolve, reject) => {
      getESSimpleFilter({
        variables: {
          index: "checkdetailsinterestscomparison_flat",
          filters: [...props.esFilters, { field: "property.IsDeleted", value: false, type: "term" }],
          filterKey: "property._id.keyword",
          filterAggs: { query: "", field: "property._id.keyword", size: props.total || 0 },
        },
        onCompleted: (res) => resolve(res?.getESSimpleFilter?.hits?.length),
        onError: (error) => reject(error),
      });
    });
    const propertyNumbersPromise = new Promise((resolve, reject) => {
      getPropertyNumbers({
        variables: {
          index: "checkdetailsinterestscomparison_flat",
          filters: [...props.esFilters, { field: "property.IsDeleted", value: false, type: "term" }],
          filterKey: "property.number.keyword",
          filterAggs: { query: "", field: "property.number.keyword", size: props.total || 0 },
        },
        onCompleted: (res) => resolve(res?.getESSimpleFilter?.hits),
        onError: (error) => reject(error),
      });
    });
    const checkNumbersPromise = new Promise((resolve, reject) => {
      getCheckNumbers({
        variables: {
          index: "checkdetailsinterestscomparison_flat",
          filters: [...props.esFilters],
          filterKey: "check.checkNumber.keyword",
          filterAggs: { query: "", field: "check.checkNumber.keyword", size: props.total || 0 },
        },
        onCompleted: (res) => resolve(res?.getESSimpleFilter?.hits),
        onError: (error) => reject(error),
      });
    });
    const otherSummaryPromise = new Promise((resolve, reject) => {
      getRevenueAnalyticsCount({
        variables: {
          index: "checkdetailsinterestscomparison_flat",
          filters: [...props.esFilters],
          filterKey: "property._id.keyword",
          filterAggs: { query: "", field: "property._id.keyword", size: props.total || 0 },
        },
        onCompleted: (res) => resolve(res?.getRevenueAnalyticsCounts?.result),
        onError: (error) => reject(error),
      });
    });
    const [propertiesCount, revenueComparisonAnalytics, propertyNumbersHits, checkNumbersHits] = await Promise.all([propertiesPromise, otherSummaryPromise, propertyNumbersPromise, checkNumbersPromise]);
    return { propertiesCount, revenueComparisonAnalytics, propertyNumbersHits, checkNumbersHits };
  };

  return (
    <Container maxWidth={false} className={classes.container}>
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
        selectedRowsValues={props.selectedRowsValues}
        selectedRows={props.selectedRows}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(CheckComparisonSection), deepEqualObjects);
