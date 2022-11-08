import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/revenue-properties-header-schema";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "../Styles";
// actions
import { setRevenuePropertyData } from "actions";
import TableESHOC from "../TableESHOC";

const genericDataActions = ["tags", "comments"];

export const statusData = [
  { label: "Not in Pay", value: "NotInPay" },
  { label: "In Pay", value: "InPay" },
];

function RevenuePropertiesTable(props) {
  const classes = usetableStyles();
  const { esIndex, setESFilters } = props;
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false);

  const esFilters = props.esFilters ? props.esFilters : [];

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      if (statusData.find((st) => st.value === hit.status)) {
        hit.status = statusData.find((st) => st.value === hit.status).label;
      }
      hit = props.setGenricData(hit, hit._id, genericDataActions, genericDataActions);
      hit.payorName = hit?.operator?.name;
      hit.wellApiNumber = hit?.wells?.length > 1 ? "MULTIPLE" : hit?.wells && hit?.wells[0] ? hit?.wells[0].apiNumber : "";
      hit.wellName = hit?.wells?.length > 1 ? "MULTIPLE" : hit?.wells && hit?.wells[0] ? hit?.wells[0].wellName : "";
      hit.checkNumber = hit?.lastCheck?.checkNumber;
      hit.amount = hit?.lastCheck?.netOwnerValue;
      hit.type = hit?.lastCheck?.interestType[0];
      hit.lastChecked = hit?.lastCheck?.checkDate ? new Date(hit?.lastCheck?.checkDate).toLocaleDateString() : "";
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : []
    const fixedFilters = []
       
    if (formatedFilter[0] && formatedFilter[0].type === "range") {
      fixedFilters.push(formatedFilter[0]);
    }

    // fixedFilters[1].type = "value";
    // fixedFilters[1].value = "";

    props.setInitialFilters(formatedFilter);
    props.setTableMeta({
      extendSearchQuery: props.revenueSearchQuery,
      searchFields: ["name^4", "_all"],
      TableHeader: copy(TableHeader(!!props.isReportingGroup)),
      esIndex: esIndex,
      filters: fixedFilters,
      selectedGridView: { filters: [] },
      startPaginationAt: 25,
      defaultSort: { field: "name.keyword", order: "asc" },
      formatHits,
      initializeGenericData: { key: "_id", actions: genericDataActions },
    });
    // eslint-disable-next-line
  }, [props.revenueSearchQuery, props.filterToggle, refetchData]);

  useEffect(() => {
    setESFilters(props.initialFilters);
    // eslint-disable-next-line
  }, [props.initialFilters]);

  useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: props.loading, data: props.rows }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rows]);

  useEffect(() => {
    if ((props?.total === 0 || props?.total) && props.onPropertiesCount) {
      props.onPropertiesCount(props.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.total, props.dependencyUpdate]);

  delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = props.searchBar;

  // console.log('PROPS BRO', props)

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        total={false}
        potentialIssues={[]}
        addAble={{ type: "RevenueProperties" }}
        loading={props.loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={props.startPaginationAt}
        onTableChange={props.onTableChange}
        options={{ ...props.options, ...props.customOptions }}
        parent={props.parent}
        setColumnsBase={[]}
        setRefetchData={setRefetchData}
        refetchData={refetchData}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(RevenuePropertiesTable), deepEqualObjects);
