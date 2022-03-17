import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import TableHeader from "components/Table/constants/revenue-properties-header-schema";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { setColumnsData } from "components/Table/helpers";
import { useLazyQuery } from "@apollo/client";
import { handleSelectedGridChange } from 'components/Table/helpers'

// QUERIES
import { setStateIfDeepEqual, deepEqualObjects } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "../Styles";
// actions
import { setRevenuePropertyData } from "actions";

function RevenuePropertiesTable(props) {
  const classes = usetableStyles();
  const { esIndex, setESFilters } = props;
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false)

  // query for Properties Table
  const [getESPaginatedList, { data: elasticData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
  });
  // rearranging the data according to the requirements.
  // const tableData = elasticData?.getESPaginatedList?.hits?.map((eachRow) => {
  //   return {
  //     _id: eachRow._id,
  //     name: eachRow.name,
  //     number: eachRow.number,
  //     payorName: eachRow?.operator?.name,
  //     state: eachRow.state,
  //     country: eachRow?.county,
  //     source: eachRow?.source,
  //     wellApiNumber: eachRow?.well?.apiNumber,
  //     wellName: eachRow?.well?.wellName,
  //     status: eachRow?.status,
  //     checkNumber: eachRow?.lastCheck?.checkNumber,
  //     lastChecked: ne2w Date(eachRow?.lastCheck?.checkDate).toLocaleDateString(),
  //     tags: eachRow.tags?.length > 0 ? [[eachRow.tags.map((tag) => tag.tag)], eachRow.tags.length] : [[], 0],
  //   };
  // });


  const tableData = elasticData?.getESPaginatedList;
  const count = tableData?.total || 0;
  // function states
  // const [columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const [columns, Columns] = useState([]);
  const [filters, setFilters] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [potentialIssuesList] = useState([]);

  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    searchable: true,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    filter: true,
    count: count,
    serverSide: true,
  };

  const esFilters = props.esFilters ? props.esFilters : []

  useEffect(() => {
    handleSelectedGridChange(TableHeader, { filters: esFilters }, columns, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.esFilters])

  useEffect(() => {
    if (tableData?.hits) {
      const hits = tableData.hits.map((hit) => {
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
      props.setRows(JSON.parse(JSON.stringify(hits)));

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
    }
  }, [tableData, props.dependencyUpdate]);


  // fetaching data
  useEffect(() => {
    props.setLoading(true);
    setColumns([])
    getESPaginatedList({
      variables: {
        esIndex: esIndex,
        pagination: {
          first: props.startPaginationAt,
          keep_alive: "1micros",
        },
        search: props.revenueSearchQuery,
        filter: "",
        filters: esFilters,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, props.parent, props.revenueSearchQuery, props.filterToggle, refetchData]);


  useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: loading, data: elasticData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getESPaginatedList, elasticData]);


  useEffect(() => {
    if (tableData && props.onPropertiesCount) {
      props.onPropertiesCount(count);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, props.dependencyUpdate]);

  const onTableChange = (action, tableState, rows, meta) => {
    tableState.esIndex = esIndex;
    tableState.esFilters = esFilters;
    // tableState.sort = [];

    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESPaginatedList);
    // setESFilters(tableActions.pageESVariables.variables.filters);
    switch (action) {
      case "filterChange":
      case "resetFilters":
        setESFilters(tableActions.pageESVariables.variables.filters);
        tableActions.genericESAction();
        break
      case "search":
      case "sort":
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
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={props.rows}
        total={false}
        potentialIssues={potentialIssuesList}
        addAble={{ type: "RevenueProperties" }}
        loading={loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={props.startPaginationAt}
        onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        setRefetchData={setRefetchData}
      />
    </Container>
  );
}

export default React.memo(TableHOC(RevenuePropertiesTable), deepEqualObjects);
