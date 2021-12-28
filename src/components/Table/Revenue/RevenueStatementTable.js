import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery } from "@apollo/client";

import { setStateIfDeepEqual, deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/revenue-statement-header-schema';

// Utilities
import { usetableStyles } from "../Styles";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { GET_ES_POTENTIAL_ISSUES_SUMMARY } from "graphQL/useQueryESSummary";
import { AutoCompleteFilter } from "../AutoCompleteFilter";


function RevenueStatementTable(props) {
    const classes = usetableStyles();

    // function states 
    const [columns, Columns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [potentialIssuesList, setPotentialIssuesList] = useState([]);
    const [pIssuesArr, setIssuesArr] = useState([]);

    const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

    // queries 

    const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
        context: { batch: true },
        fetchPolicy: "no-cache",
    });

    const [getPotentialIssues, { data: potentialIssues }] = useLazyQuery(GET_ES_POTENTIAL_ISSUES_SUMMARY, {
        context: { batch: true },
        fetchPolicy: "no-cache",
    });

    const tableData = elasticData?.getESPaginatedList;
    const issues = potentialIssues?.getESPotentialIssuesSummary;

    const startPaginationAt = 25;
    const esIndex = 'checks_flat';

    // get paginated data hits from checks_flat table
    useEffect(() => {
        getESPaginatedList({
            variables: {
                esIndex,
                pagination: {
                    first: startPaginationAt,
                    keep_alive: "1micros"
                },
                search: props.revenueSearchQuery,
            }
        });
    }, [getESPaginatedList, props.parent, props.revenueSearchQuery]);

    useEffect(() => {
        // Potential Issues
        getPotentialIssues({
            variables: {
                esIndex: "checkdetails_flat",
                size: 50,
                extendSearchQuery: "potentialIssues"
            },
        });
    }, []);


    //  Potential issues
    useEffect(() => {
        if (issues?.hits?.length > 0) {
            const allIssues = issues?.hits.filter((issue) => {
                const checkAmt = issue?.checkAmt?.value?.toFixed(2);
                const checkDetailAmt = issue?.checkDetailAmt?.value?.toFixed(2);
                if (Number(checkAmt) !== Number(checkDetailAmt)) {
                    return issue;
                }
            });
            setIssuesArr(allIssues);
            setPotentialIssuesList(allIssues);
        } else {
            setPotentialIssuesList([]);
        }
    }, [potentialIssues]);

    useEffect(() => {
        if (tableData?.hits?.length > 0) {
            let hits = tableData?.hits
            props.onGettingStatements(hits);
            props.setRows(hits);
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
                                return (
                                    <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange}
                                        query={GET_ES_FILTER_LIST} esIndex={esIndex} />
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
            props.onGettingStatements([]);
            props.onGettingPotentialIssues([]);
            setPotentialIssuesList([]);
        }
    }, [tableData, props.dependencyUpdate]);

    useEffect(() => {
        if (issues?.hits?.length > 0 && tableData?.hits?.length > 0) {
            const issuesArr = issues?.hits.filter((issue) => {
                for (let i = 0; i < tableData?.hits?.length; i++) {
                    if (tableData?.hits[i]._id === issue.key) {
                        return issue;
                    }
                }
            });
            setIssuesArr(issuesArr);
        }
    }, [tableData]);


    useEffect(() => {
        if (pIssuesArr.length > 0) {
            const allIssues = pIssuesArr?.filter((issue) => {
                const checkAmt = issue?.checkAmt?.value?.toFixed(2);
                const checkDetailAmt = issue?.checkDetailAmt?.value?.toFixed(2);
                if (Number(checkAmt) !== Number(checkDetailAmt)) {
                    return issue;
                }
            });
            setPotentialIssuesList(allIssues);
            props.onGettingPotentialIssues(allIssues);
        } else {
            props.onGettingPotentialIssues([]);
            setPotentialIssuesList([]);
        }
    }, [pIssuesArr]);

    const onTableChange = (action, tableState, rows, meta) => {
        tableState.esIndex = esIndex;
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
                potentialIssues={potentialIssuesList}
                addAble={{ type: "RevenueStatement" }}
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

export default React.memo(TableHOC(RevenueStatementTable), deepEqualObjects);
