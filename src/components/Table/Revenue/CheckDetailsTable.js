import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery } from "@apollo/client";

import { setStateIfDeepEqual, deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/check-details-header-schema';

// Utilities
import { usetableStyles } from "../Styles";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { AutoCompleteFilter } from "../AutoCompleteFilter";


function CheckDetailsTable(props) {
    const classes = usetableStyles();

    // function states 
    const [columns, Columns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

    // queries 
    const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
        fetchPolicy: "no-cache", onCompleted: () => {
            props.setLoading(false);
        }
    });

    const tableData = elasticData?.getESPaginatedList;

    const startPaginationAt = 50;
    const esIndex = 'checkdetails_flat';
    const esStaticFilters = [{
        field: "check._id.keyword",
        value: props.checkId
    }];

    // get paginated data hits from checkdetails_flat table
    useEffect(() => {
        getESPaginatedList({
            variables: {
              esIndex,
              filters: esStaticFilters,
              pagination: {
                first: startPaginationAt,
                keep_alive: "1micros",
              },
              search: ``,
              sort: [],
              filter: "",
            },
          });

    }, [props.parent, props.checkId]);


    const getCheckDetailRows = (rows) => {
        let dataSet = rows?.map((item) => ({
            ...item,
            number: `${item?.property.number}_${item?._id}`,
            name: item?.property?.name || "",
            state: item?.property.state || "",
            county: item?.property.county,
        }));
        return dataSet;
    }


    useEffect(() => {
        if (tableData?.hits?.length > 0) {
            const getHitAccordingToColums = getCheckDetailRows(tableData?.hits || []);
            props.setRows(getHitAccordingToColums);
            let headers = copy(TableHeader)

            headers.forEach((column) => {
                if (column?.options?.filter) {
                    column.options = {
                        ...column.options,
                        filter: true,
                        filterType: 'custom',
                        filterOptions: {
                            display: (filterList, onChange, index, column) => {
                                column.filterKey = headers.find(el => el.name === column.name)?.esKey;
                                column.custom = headers.find(el => el.name === column.name)?.custom;
                                return (
                                    <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange}
                                        query={GET_ES_FILTER_LIST} esIndex={esIndex} custom={column.custom} />
                                );
                            }
                        }
                    }
                }
            })

            setColumns(headers);
            props.setLoading(false);
        }
        else if (tableData?.hits?.length === 0) {
            props.setRows([]);
            props.setLoading(false);
        }
    }, [tableData, props.dependencyUpdate]);

    const onTableChange = (action, tableState, rows, meta) => {
        tableState.esIndex = esIndex;
        tableState.esFilters = esStaticFilters
        const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESPaginatedList)
        switch (action) {
            case "search":
            case "sort":
            case "filterChange":
            case "resetFilters":
            case "changeRowsPerPage":
                tableActions.genericESAction();
                break;
            case "rowSelectionChange":
                setSelectedRows(tableState.selectedRows.data)
                break;
            case "changePage":
                tableActions.changeESPage();
                break;
            default:
        }
    }

    const count = tableData?.total || 0
    const options = {
        rowsPerPageOptions: [10, 25, 50, 100],
        count: count,
        serverSide: true,
        searchable: true,
        rowsSelected: selectedRows.map((sR => sR.dataIndex)),
        filter: true,
    }

    return (
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
                addAble={{ type: "revenueStatementDetails" }}
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
    );
}

export default React.memo(TableHOC(CheckDetailsTable), deepEqualObjects);