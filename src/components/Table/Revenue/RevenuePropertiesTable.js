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

function RevenuePropertiesTable(props) {
  const classes = usetableStyles();
  const { esIndex, setESFilters } = props;
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false)


  const esFilters = props.esFilters ? props.esFilters : []

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = props.setGenricData(hit, hit._id, ["tracks"]);
      hit.payorName = hit?.operator?.name;
      hit.wellApiNumber = hit?.well?.apiNumber
      hit.wellName = hit?.well?.wellName;
      hit.checkNumber = hit?.lastCheck?.checkNumber;
      hit.amount = hit?.lastCheck?.netOwnerValue;
      hit.type = hit?.lastCheck?.interestType[0];
      hit.lastChecked = new Date(hit?.lastCheck?.checkDate).toLocaleDateString();
      hit.tags = hit?.tags?.length > 0
        ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
        : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
    return hits
  }

  useEffect(() => {

    const formatedFilter = esFilters ? copy(esFilters) : []
    const fixedFilters = []
    if (formatedFilter[0] && formatedFilter[0].value.range) {
      formatedFilter[0].type = 'range'
      formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field]
      fixedFilters.push(formatedFilter[0])
    }
    props.setInitialFilters(formatedFilter)
    props.setTableMeta({
      extendSearchQuery: props.revenueSearchQuery,
      searchFields: ["name^4", "_all"],
      TableHeader: copy(TableHeader),
      esIndex: esIndex,
      filters: fixedFilters,
      selectedGridView: { filters: [] },
      startPaginationAt: 25,
      defaultSort: { field: 'name.keyword', order: 'desc' },
      formatHits,
      // initializeGenericData: { key: 'id', actions: genericDataActions }
    });
    // eslint-disable-next-line
  }, [esFilters, props.revenueSearchQuery, props.filterToggle, refetchData]);

  useEffect(() => {
    setESFilters(props.intialFilters)
    // eslint-disable-next-line
  }, [props.intialFilters]);



  useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: props.loading, data: props.rows }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rows]);


  useEffect(() => {
    if (props?.total && props.onPropertiesCount) {
      props.onPropertiesCount(props.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.total, props.dependencyUpdate]);

  delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = props.searchBar

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
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
        setRefetchData={setRefetchData}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(RevenuePropertiesTable), deepEqualObjects);
