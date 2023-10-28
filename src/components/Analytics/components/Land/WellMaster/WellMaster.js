import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/analytics-land-well-master-schema";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "components/Table/Styles";
// actions
import { setRevenuePropertyData } from "actions";
import TableESHOC from "components/Table/TableESHOC";
import convert_date from "components/Shared/valueformatters/convert_date.js";

function WellMasterTable(props) {
  const classes = usetableStyles();
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false);

  const esFilters = props.esFilters ? props.esFilters : [];

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = {
        ...hit.wellData,
        sort: hit.sort,
        permitApprovedDate: hit.wellData.permitApprovedDate ? convert_date(hit.wellData.permitApprovedDate) : null,
        spudDate: hit.wellData.spudDate ? convert_date(hit.wellData.spudDate) : null,
        completionDate: hit.wellData.completionDate ? convert_date(hit.wellData.completionDate) : null,
        firstProdDate: hit.wellData.FirstProdDate ? convert_date(hit.wellData.FirstProdDate) : null,
      }
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : [];
    const fixedFilters = [];
    if (formatedFilter[0] && formatedFilter[0].value.range) {
      formatedFilter[0].type = "range";
      formatedFilter[0].value =
        formatedFilter[0].value.range[formatedFilter[0].field];
      fixedFilters.push(formatedFilter[0]);
    }

    // fixedFilters[1].type = "value";
    // fixedFilters[1].value = "";

    props.setInitialFilters(formatedFilter);
    props.setTableMeta({
      extendSearchQuery: props.landSearchQuery || "",
      TableHeader: copy(TableHeader),
      esIndex: 'mywells_flat',
      filters: fixedFilters,
      selectedGridView: { filters: [] },
      startPaginationAt: 25,
      defaultSort: { field: "lastUpdateAt", order: "desc" },
      downloadAll: { exportPx: '175px' },
      datasets: { exportGrid: true },
      formatHits,
    });
    // eslint-disable-next-line
  }, [props.landSearchQuery, props.filterToggle, refetchData]);

  useEffect(() => {
    // setESFilters(props.initialFilters);
    // eslint-disable-next-line
  }, [props.initialFilters]);

  useEffect(() => {
    dispatch(
      setRevenuePropertyData({ loading: props.loading, data: props.rows })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rows]);

  useEffect(() => {
    if ((props?.total === 0 || props?.total) && props.onPropertiesCount) {
      props.onPropertiesCount(props.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.total, props.dependencyUpdate]);

  // delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = props.searchBar;

  return (
    <>
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
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(WellMasterTable), deepEqualObjects);
