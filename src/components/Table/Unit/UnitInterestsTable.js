import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES
import { useLazyQuery } from "@apollo/client";

import {
  setStateIfDeepEqual,
  deepEqualObjects,
} from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/unit-interests-header-schema";

// Utilities
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { setColumnsData } from "components/Table/helpers";

const useStyles = makeStyles((theme) => ({
  tractInterestTable: {
    "& ::-webkit-scrollbar": {
      height: "0.7em !important"
    },
  },
  container: {
    padding: 0,
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          "@media (max-height:900px)": {
            maxHeight: "52vh",
          },
          "@media (max-height:800px)": {
            maxHeight: "48vh",
          },
          "@media (max-height:768px)": {
            maxHeight: "45vh",
          },
        },
      },
    },
  }
}));

function UnitInterestsTable(props) {
  const { esIndex, esFilters, setESFilters } = props;
  const classes = useStyles();
  const history = useHistory();
  const [filters, setFilters] = useState([]);

  // function states
  const [columns, Columns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const [esSearch, setESSearch] = useState("");

  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  // queries

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(
    GET_ES_PAGINATED_LIST,
    {
      fetchPolicy: "no-cache",
      onCompleted: () => {
        props.setLoading(false);
      },
    }
  );
  const tableData = elasticData?.getESPaginatedList;

  const startPaginationAt = 10;
  // const esIndex = 'shapeowners_flat';
  const esStaticFilters = [
    {
      field: "shape.layer",
      value: "unit",
    },
    ...esFilters
  ];

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    rowsPerPage: 10,
    count: count,
    serverSide: true,
    search: false,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    filter: true,
    searchText: esSearch,
  };

  useEffect(() => {
    setESSearch(props.landSearchQuery ? `${props.landSearchQuery}*` : "");
  }, [props.landSearchQuery]);

  // get paginated data hits from checks_flat table
  useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex,
        search: esSearch,
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        filters: esStaticFilters,
      },
    });
  }, [props.parent, esSearch]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const objectsIdsArray = tableData?.hits?.map((hit) => hit.shape?._id);
      //   const globalOwnerIds = tableData?.hits?.map((hit) => hit.globalOwnerId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
      //   props.ifAreContacts(globalOwnerIds);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData) {
      if (tableData?.hits?.length > 0) {
        const hits = tableData?.hits.map((hit) => {
          hit.QtrCalls = hit.qtr
            ?.filter((el) => el)
            ?.map((qtr, i) => `${qtr}/${i + 1}`)
            ?.join();
          hit.unitCampaign = hit.contact.campaignName;
          hit.tags =
            hit?.tags?.length > 0
              ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
              : [[], 0];
          hit.commentsCounter = hit.comments ? hit.comments.length : 0;
          hit = props.setGenricData(hit, hit.shape?._id, [
            'comments', 'tags'
          ]);
          return hit;
        });

        props.setRows(hits);

        setColumnsData(
          TableHeader,
          filters,
          JSON.parse(JSON.stringify(TableHeader)),
          setColumns,
          setFilters,
          GET_ES_FILTER_LIST,
          esIndex
        );

        props.setLoading(false);
      } else if (tableData?.hits?.length === 0) {
        props.setRows([]);
        props.setLoading(false);
      }

      props.onTractCount(count);
    }
  }, [tableData, props.dependencyUpdate]);

  const onTableChange = (action, tableState, rows, meta) => {
    tableState.esIndex = esIndex;
    tableState.esFilters = esStaticFilters;
    // setESSearch(tableState.searchText ? `${tableState.searchText}*` : '')
    const tableActions = props.initializeTableActions(
      tableState,
      meta,
      tableData,
      columns,
      getESPaginatedList
    );
    setESFilters(tableActions.pageESVariables.variables.filters);
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "rowSelectionChange":
        setSelectedRows(tableState.selectedRows.data);
        break;
      case "changePage":
        tableActions.changeESPage();
        break;
      default:
    }
  };

  const showUnitDetails = (unit) => {
    history.push(`/contact/details/${esFilters?.[0]?.value}/units/${unit?._id}`)
  }

  return (
    <div className={classes.tractInterestTable}>
      <Container
        maxWidth={false}
        className={classes.container}
        id={props.id ? props.id : props.parent}
      >
        <Table
          style={{ backgroundColor: "#fff" }}
          header={props.header}
          columns={columns}
          rows={props.rows}
          total={false}
          addAble={{ type: "TractInterests" }}
          loading={props.loading}
          targetLabel={props.targetLabel}
          uploadIcon={null}
          dense={props.dense ? props.dense : undefined}
          orderByTracks={false}
          startPaginationAt={null}
          onTableChange={onTableChange}
          options={options}
          parent={props.parent}
          setColumnsBase={[]}
          showUnitDetails={showUnitDetails}
        />
      </Container>
    </div>
  );
}

export default React.memo(TableHOC(UnitInterestsTable), deepEqualObjects);
