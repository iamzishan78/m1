import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import isEmpty from "lodash/isEmpty";

// QUERIES
import { useLazyQuery } from "@apollo/client";

import {
  setStateIfDeepEqual,
  deepEqualObjects,
} from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/tract-interests-header-schema";

// Utilities
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
// import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";
// import { GET_ES_POTENTIAL_ISSUES } from "graphQL/useQueryPotentialIssue";
// import { AutoCompleteFilter } from "../AutoCompleteFilter";
import { setColumnsData } from "components/Table/helpers";

const useStyles = makeStyles((theme) => ({
  tractInterestTable: {
    "& ::-webkit-scrollbar": {
      height: "0.7em !important",
    },
  },
  container: {
    padding: 0,
    "& div": {
      "&>.MuiPaper-root": {
        "&>:nth-child(3)": {
          maxHeight: "55vh",
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

function TractInterestsTable(props) {
  const { esIndex, setESFilters, greyBarFilters, setGreyBarFilters } = props;
  const classes = useStyles();
  const [filters, setFilters] = useState([]);

  // function states
  const [columns, Columns] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  // const [potentialIssuesList, setPotentialIssuesList] = useState([]);
  // const [pIssuesArr, setIssuesArr] = useState([]);

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

  // const [getESAggsGrossAcresSum, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
  //     onCompleted: (aggsData) => {
  //         if(aggsData?.getESAggsList?.aggregations?.grossAcresSum) {
  //             props.onGrossAcresSum(aggsData?.getESAggsList?.aggregations?.grossAcresSum?.value)
  //         }
  //     }
  // });

  // const [getESAggsNetAcresSum, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
  //     onCompleted: (aggsData) => {
  //         if(aggsData?.getESAggsList?.aggregations?.netAcresSum) {
  //             props.onNetAcresSum(aggsData?.getESAggsList?.aggregations?.netAcresSum?.value)
  //         }
  //     }
  // });

  // const [getESAggsNetRoyaltyAcresSum, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
  //     onCompleted: (aggsData) => {
  //         if(aggsData?.getESAggsList?.aggregations?.netRoyaltyAcresSum) {
  //             props.onNetRoyaltyAcresSum(aggsData?.getESAggsList?.aggregations?.netRoyaltyAcresSum?.value)
  //         }
  //     }
  // });

  // const [getPotentialIssues, { data: potentialIssues }] = useLazyQuery(GET_ES_POTENTIAL_ISSUES, { fetchPolicy: "no-cache" });

  const tableData = elasticData?.getESPaginatedList;
  // const issues = potentialIssues?.getPotentialIssuesSummary;

  const startPaginationAt = 10;
  // const esIndex = 'shapeowners_flat';
  const esStaticFilters = [
    {
      field: "shape.layer",
      value: "parcel",
    },


  ];

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    // rowsPerPage: 10,
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
    // Potential Issues
    // getPotentialIssues({
    //     variables: {
    //         esIndex: "checkdetails_flat",
    //         size: 50,
    //     },
    // });
  }, [props.parent, esSearch]);

  //  Potential issues
  // useEffect(() => {
  //     if (issues?.hits?.length > 0) {
  //         const allIssues = issues?.hits.filter((issue) => {
  //             const checkAmt = issue?.checkAmt?.value.toFixed(2);
  //             const checkDetailAmt = issue?.checkDetailAmt?.value.toFixed(2);
  //             if (Number(checkAmt) !== Number(checkDetailAmt)) {
  //                 return issue;
  //             }
  //         });
  //         setPotentialIssuesList(allIssues);
  //     } else {
  //         setPotentialIssuesList([]);
  //     }
  // }, [issues]);
  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const objectsIdsArray = tableData?.hits?.map((hit) => hit.contact?._id);
      //   const globalOwnerIds = tableData?.hits?.map((hit) => hit.globalOwnerId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
      //   props.ifAreContacts(globalOwnerIds);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData) {
      if (tableData?.hits?.length > 0) {
        // const resolvePath = (obj, path) => {
        //     if (!obj) return null
        //     // if (Array.isArray(obj)) obj = obj[0]

        //     const parts = path.split(".");
        //     const optionalPath = parts[0].endsWith('?')
        //     if (optionalPath) parts[0] = parts[0].slice(0,-1)
        //     if (parts.length == 1) {
        //         return obj[parts[0]] ||
        //         (optionalPath && typeof obj !== 'object' ? obj : null);
        //     }
        //     return resolvePath(obj[parts[0]], parts.slice(1).join(".")) ||
        //     (optionalPath ? resolvePath(obj, parts.slice(1).join(".")) : resolvePath(null, parts.slice(1).join(".")));
        // }

        const hits = tableData?.hits.map((hit) => {
          // let tempHit = { ...hit}
          // TableHeader.forEach((col) => {
          //     if (col?.options?.dbName) {
          //         tempHit[col.name] = resolvePath(tempHit, col.options.dbName)
          //         if (col.name === 'QtrCalls') tempHit[col.name] = tempHit[col.name]?.filter(el => el)?.map((qtr, i) => `${qtr}/${i + 1}`)?.join()
          //     }
          // })
          // tempHit = props.setGenricData(tempHit, tempHit.contact._id, ['comments', 'tracks', 'tags', 'ifAreContacts']);

          hit.QtrCalls = hit.qtr
            ?.filter((el) => el)
            ?.map((qtr, i) => `${qtr}/${i + 1}`)
            ?.join();
          hit.tags =
            hit?.tags?.length > 0
              ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
              : [[], 0];
          hit.commentsCounter = hit.comments ? hit.comments.length : 0;
          hit = props.setGenricData(hit, hit.contact?._id, [
            'comments', 'tags'
          ]);
          return hit;
        });

        // props.onGettingStatements(hits);
        props.setRows(hits);
        // let headers = copy(TableHeader)

        // headers.forEach((column) => {
        //     if (column?.options?.filter) {
        //         column.options = {
        //             ...column.options,
        //             filter: true,
        //             filterType: 'custom',
        //             filterOptions: {
        //                 display: (filterList, onChange, index, column) => {
        //                     column.filterKey = headers.find(el => el.name === column.name)?.esKey;
        //                     return (
        //                         <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange}
        //                             query={GET_ES_FILTER_LIST} esIndex={esIndex} filters={esFilters} />
        //                     );
        //                 }
        //             }
        //         }
        //     }
        // })

        // setColumns(headers);

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
        // props.onGettingStatements([]);
        // props.onGettingPotentialIssues([]);
        // setPotentialIssuesList([]);
      }

      props.onTractCount(count);
      // getESAggsGrossAcresSum({
      //     variables: {
      //         esIndex,
      //         search: esSearch,
      //         filters: esFilters,
      //         aggs: {
      //             grossAcresSum: {
      //                 sum: {
      //                     field: "grossAcres"
      //                 }
      //             }
      //         }
      //     }
      // });
      // getESAggsNetAcresSum({
      //     variables: {
      //         esIndex,
      //         search: esSearch,
      //         filters: esFilters,
      //         aggs: {
      //             netAcresSum: {
      //                 sum: {
      //                     field: "net_acres"
      //                 }
      //             }
      //         }
      //     }
      // })
      // getESAggsNetRoyaltyAcresSum({
      //     variables: {
      //         esIndex,
      //         search: esSearch,
      //         filters: esFilters,
      //         aggs: {
      //             netRoyaltyAcresSum: {
      //                 sum: {
      //                     field: "nra"
      //                 }
      //             }
      //         }
      //     }
      // })
    }
  }, [tableData, props.dependencyUpdate]);

  // useEffect(() => {
  //     if (issues?.hits?.length > 0 && tableData?.hits?.length > 0) {
  //         const issuesArr = issues?.hits.filter((issue) => {
  //             for (let i = 0; i < tableData?.hits?.length; i++) {
  //                 if (tableData?.hits[i]._id === issue.key) {
  //                     return issue;
  //                 }
  //             }
  //         });
  //         setIssuesArr(issuesArr);
  //     }
  // }, [tableData]);

  // useEffect(() => {
  //     if (pIssuesArr.length > 0) {
  //         const allIssues = pIssuesArr?.filter((issue) => {
  //             const checkAmt = issue?.checkAmt?.value.toFixed(2);
  //             const checkDetailAmt = issue?.checkDetailAmt?.value.toFixed(2);
  //             if (Number(checkAmt) !== Number(checkDetailAmt)) {
  //                 return issue;
  //             }
  //         });
  //         setPotentialIssuesList(allIssues);
  //         props.onGettingPotentialIssues(allIssues);
  //     } else {
  //         props.onGettingPotentialIssues([]);
  //         setPotentialIssuesList([]);
  //     }
  // }, [pIssuesArr]);

  const onTableChange = (action, tableState, rows, meta) => {
    if (action === "filterChange" && !tableState.filterList.some(filter => filter.length) && isEmpty(greyBarFilters)) setFilters([]);

    if (tableState.columns.length && greyBarFilters && !isEmpty(greyBarFilters)) {
      action = "filterChange"
      const listIndex = TableHeader.findIndex(header => header.name === greyBarFilters.name);

      if (listIndex >= 0) {
        if (typeof greyBarFilters?.value === 'string') {
          tableState.columns[listIndex].filterList = [greyBarFilters.value]
          tableState.filterList[listIndex] = [greyBarFilters.value]
        }
        else {
          if (greyBarFilters?.value) {
            //remove filter if user clicked on cross
            tableState.columns[listIndex].filterList = greyBarFilters.value
            tableState.filterList[listIndex] = [greyBarFilters.value]
          }
          else {
            tableState.columns[listIndex].filterList = []
            tableState.filterList[listIndex] = []
          }
        }
      }

      setGreyBarFilters({})
    }

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
          // potentialIssues={potentialIssuesList}
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
        />
      </Container>
    </div>
  );
}

export default React.memo(TableHOC(TractInterestsTable), deepEqualObjects);
