import React, { useState, useEffect } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery } from "@apollo/client";

import { setStateIfDeepEqual, deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/agreements-header-schema';

// Utilities
import { usetableStyles } from "../Styles";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { GET_ES_AGGS_LIST } from "graphQL/useQueryESAggsList";
// import { GET_ES_POTENTIAL_ISSUES } from "graphQL/useQueryPotentialIssue";
import { AutoCompleteFilter } from "../AutoCompleteFilter";


function AgreementsTable(props) {
    const classes = usetableStyles();

    // function states 
    const [columns, Columns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    // const [potentialIssuesList, setPotentialIssuesList] = useState([]);
    // const [pIssuesArr, setIssuesArr] = useState([]);

    const [esSearch, setESSearch] = useState('');
    const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

    // queries 

    const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
        fetchPolicy: "no-cache", onCompleted: () => {
            props.setLoading(false);
        }
    });

    const [getESAggsActiveCount, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
        onCompleted: (aggsData) => {
            if(aggsData?.getESAggsList?.aggregations?.activeCount) {
                props.onActiveCount(aggsData?.getESAggsList?.aggregations?.activeCount?.value)
            }
        }
    });

    const [getESAggsApprovedCount, { }] = useLazyQuery(GET_ES_AGGS_LIST, { context: { batch: true }, fetchPolicy: "no-cache",
        onCompleted: (aggsData) => {
            if(aggsData?.getESAggsList?.aggregations?.approvedCount) {
                props.onApprovedCount(aggsData?.getESAggsList?.aggregations?.approvedCount?.value)
            }
        }
    });

    // const [getPotentialIssues, { data: potentialIssues }] = useLazyQuery(GET_ES_POTENTIAL_ISSUES, { fetchPolicy: "no-cache" });

    const tableData = elasticData?.getESPaginatedList;
    // const issues = potentialIssues?.getPotentialIssuesSummary;


    const startPaginationAt = 25;
    const esIndex = 'shapes_flat';
    const esFilters = [{
        field: "layer",
        value: "agreement"
    }];
    
    const count = tableData?.total || 0
    const options = {
        rowsPerPageOptions: [10, 25, 50, 100],
        count: count,
        serverSide: true,
        searchable: true,
        rowsSelected: selectedRows.map((sR => sR.dataIndex)),
        filter: true,
    }

    // get paginated data hits from checks_flat table
    useEffect(() => {
        getESPaginatedList({
            variables: {
                esIndex,
                pagination: {
                    first: startPaginationAt,
                    keep_alive: "1micros"
                },
                filters: esFilters
            }
        });
        // Potential Issues
        // getPotentialIssues({
        //     variables: {
        //         esIndex: "checkdetails_flat",
        //         size: 50,
        //     },
        // });
    }, [props.parent]);


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
        if (!props.loading) {
            if (tableData?.hits?.length > 0) {
                const resolvePath = (obj, path) => {
                    const parts = path.split(".");
                    if (parts.length == 1) {
                        return obj[parts[0]];
                    }
                    return resolvePath(obj[parts[0]], parts.slice(1).join("."));
                }

                const hits = tableData?.hits.map((hit) => {
                    const tempHit = { ...hit };
                    TableHeader.forEach((col) => {
                        if (col?.options?.dbName) {
                            tempHit[col.name] = resolvePath(tempHit, col.options.dbName)
                        }
                    })

                    return tempHit
                })

                // props.onGettingStatements(hits);
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
                // props.onGettingStatements([]);
                // props.onGettingPotentialIssues([]);
                // setPotentialIssuesList([]);
            }

            props.onAgreementCount(count)
            getESAggsActiveCount({
                variables: {
                    esIndex,
                    search: esSearch,
                    filters: [ ...esFilters, {
                        field: "shapeJson.properties.agreementStatus",
                        value: "ACTIVE"
                    }],
                    aggs: {
                        activeCount: {
                            cardinality: { field: "shapeJson.id.keyword" }
                        }
                    }
                }
            });
            getESAggsApprovedCount({
                variables: {
                    esIndex,
                    search: esSearch,
                    filters: [ ...esFilters, {
                        field: "shapeJson.properties.approvalStatus",
                        value: "APPROVED"
                    }],
                    aggs: {
                        approvedCount: {
                            cardinality: { field: "shapeJson.id.keyword" }
                        }
                    }
                }
            })
        }
    }, [tableData, props.dependencyUpdate, props.loading]);

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
        tableState.esFilters = esFilters
        setESSearch(tableState.searchText ? `${tableState.searchText}*` : '')
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
    );
}

export default React.memo(TableHOC(AgreementsTable), deepEqualObjects);