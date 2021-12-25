import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import moment from "moment";

// QUERIES
import { useLazyQuery } from "@apollo/client";

import {
  setStateIfDeepEqual,
  deepEqualObjects,
} from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/agreements-header-schema";

// Utilities
import { usetableStyles } from "../Styles";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
// import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";
// import { GET_ES_POTENTIAL_ISSUES } from "graphQL/useQueryPotentialIssue";
// import { AutoCompleteFilter } from "../AutoCompleteFilter";

import { setColumnsData } from "components/Table/helpers";

const useStyles = makeStyles((theme) => ({
    agreementTable: {
      "& ::-webkit-scrollbar": {
        height: "0.7em !important",
      },
    },
  }));

  
function AgreementsTable(props) {
  const { esIndex, setESFilters } = props;
  const classes = usetableStyles();
  const agreementClasses = useStyles()
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

  // const [getESAggsActiveCount, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
  //     onCompleted: (aggsData) => {
  //         if(aggsData?.getESAggsList?.aggregations?.activeCount) {
  //             props.onActiveCount(aggsData?.getESAggsList?.aggregations?.activeCount?.value)
  //         }
  //     }
  // });

  // const [getESAggsApprovedCount, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
  //     onCompleted: (aggsData) => {
  //         if(aggsData?.getESAggsList?.aggregations?.approvedCount) {
  //             props.onApprovedCount(aggsData?.getESAggsList?.aggregations?.approvedCount?.value)
  //         }
  //     }
  // });

  // const [getPotentialIssues, { data: potentialIssues }] = useLazyQuery(GET_ES_POTENTIAL_ISSUES, { fetchPolicy: "no-cache" });

  const tableData = elasticData?.getESPaginatedList;
  // const issues = potentialIssues?.getPotentialIssuesSummary;

  const startPaginationAt = 10;
  // const esIndex = 'shapes_flat';
  const esStaticFilters = [
    {
      field: "shapeJson.properties.type",
      value: "agreement",
    },
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

  // useEffect(() => {
  //     if (tableData?.hits?.length > 0) {
  //       const objectsIdsArray = tableData?.hits?.map((hit) => hit._id);
  //     //   const globalOwnerIds = tableData?.hits?.map((hit) => hit.globalOwnerId);
  //       props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
  //     //   props.ifAreContacts(globalOwnerIds);
  //     }
  //   }, [tableData]);

  useEffect(() => {
    if (tableData) {
      if (tableData?.hits?.length > 0) {
        const hits = tableData?.hits.map((hit) => {
          hit.agreementDate = hit.agreementDate
            ? moment(hit.agreementDate).format("MM/DD/YYYY")
            : null;
          hit.effectiveDate = hit.effectiveDate
            ? moment(hit.effectiveDate).format("MM/DD/YYYY")
            : null;
          hit.expirationDate = hit.expirationDate
            ? moment(hit.expirationDate).format("MM/DD/YYYY")
            : null;
          hit.State = hit?.originalProperties?.State;
          hit.County = hit?.originalProperties?.County;
          hit = props.setGenricData(hit, hit._id, [
            "comments",
            "tracks",
            "tags",
            "ifAreContacts",
          ]);
          hit.tags =
            hit?.tags?.length > 0
              ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
              : [[], 0];
          hit.commentsCounter = hit.comments ? hit.comments.length : 0;
          return hit;
        });

        // props.onGettingStatements(hits);
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
        //                         <AutoCompleteFilter filterList={[...esFilters, filterList]} column={column} index={index} onChange={onChange}
        //                             query={GET_ES_FILTER_LIST} esIndex={esIndex} />
        //                     );
        //                 }
        //             }
        //         }
        //     }
        // })

        // setColumns(headers);
        props.setLoading(false);
      } else if (tableData?.hits?.length === 0) {
        props.setRows([]);
        props.setLoading(false);
        // props.onGettingStatements([]);
        // props.onGettingPotentialIssues([]);
        // setPotentialIssuesList([]);
      }

      props.onAgreementCount(count);
      // getESAggsActiveCount({
      //     variables: {
      //         esIndex,
      //         search: esSearch,
      //         filters: [ ...esFilters, {
      //             field: "shapeJson.properties.agreementStatus",
      //             value: "ACTIVE"
      //         }],
      //         aggs: {
      //             activeCount: {
      //                 cardinality: { field: "shapeJson.id.keyword" }
      //             }
      //         }
      //     }
      // });
      // getESAggsApprovedCount({
      //     variables: {
      //         esIndex,
      //         search: esSearch,
      //         filters: [ ...esFilters, {
      //             field: "shapeJson.properties.approvalStatus",
      //             value: "APPROVED"
      //         }],
      //         aggs: {
      //             approvedCount: {
      //                 cardinality: { field: "shapeJson.id.keyword" }
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
    <div className={agreementClasses.agreementTable}>
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
          addAble={{ type: "Agreements" }}
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

export default React.memo(TableHOC(AgreementsTable), deepEqualObjects);
