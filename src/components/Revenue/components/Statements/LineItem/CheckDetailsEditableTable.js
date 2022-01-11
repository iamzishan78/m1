import React, { useState, useEffect } from "react";
import { Grid, Paper, Button } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useApolloClient } from "@apollo/client";

import { setStateIfDeepEqual, deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/check-details-header-schema';

// Utilities
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { usetableStyles } from "components/Table/Styles";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import get from 'lodash/get'
import set from 'lodash/set'
import { Grid as TableGrid, Input, Select } from 'components/Shared/SpreadsheetGrid'
import { AutoCompleteField } from "./AutoCompleteField";


const Rows = [];
const positions = [];

for (let i = 0; i < 1000; i++) {
    Rows.push({
        id: i,
        secondName: 'Second name ' + i,
        firstName: 'First name ' + i,

        positionId: 3,
        age: i
    });
}

for (let i = 1; i < 6; i++) {
    positions.push({
        id: i,
        name: 'Long Position Name ' + i
    });
}


const RevenueStatementHeadCells = [
    {
        id: "property.number", title: "Property Code", filterKey: 'property.number.keyword'
    },
    {
        id: "property.name", title: "Property Name", filterKey: 'property.name.keyword'
    },
    {
        id: "property.state", title: "State", filterKey: 'property.state.keyword'
    },
    {
        id: "property.county", title: "County", filterKey: 'property.county.keyword'
    },
    {
        id: "date", title: "Sales Date", filterKey: 'date'
    },
    {
        id: "product", title: "Product", filterKey: 'product.keyword'
    },
    {
        id: "disbursement", title: "Decimal Interest", filterKey: 'disbursement.keyword'
    },
    {
        id: "interestType", title: "Type", filterKey: 'interestType.keyword'
    },
    {
        id: "price", title: "Avg Price", filterKey: 'price'
    },
    {
        id: "grossOwnerVolume", title: "Sales Vol", filterKey: 'grossOwnerVolume'
    },
    {
        id: "grossOwnerValue", title: "Gross Rev", filterKey: 'grossOwnerValue'
    },
    {
        id: "ownerTax", title: "Severence", filterKey: 'ownerTax'
    },
    {
        id: "ownerDeducts", title: "Deduct Amt", filterKey: 'ownerDeducts'
    },
    {
        id: "deductType", title: "Deduct Cd", filterKey: 'deductType.keyword'
    },
    {
        id: "netOwnerValue", title: "Owner Net Rev", filterKey: 'netOwnerValue'
    }
];


function CheckDetailsEditableTable(props) {

    const [rows, setRows] = useState(props.rows);
    const client = useApolloClient();

    const onFieldChange = (rowId, field) => (async (value) => {
        const row = rows.find((r) => r._id === rowId);

        if (field === 'property.number') {
            const { data: checkDetail } = await client.query({
                query: GET_ES_PAGINATED_LIST,
                variables: {
                    esIndex,
                    search: `property.number:(${value})`,
                    pagination: {
                        first: 1,
                        keep_alive: "1micros"
                    },
                },
            });
            if (checkDetail?.getESPaginatedList?.hits.length > 0) {
                row.property = checkDetail?.getESPaginatedList?.hits[0].property
            }
        }

        set(row, field, value)
        setRows([].concat(rows))
    })

    const cols = () => RevenueStatementHeadCells.map((cell, index) => {
        cell.value = (row, { focus }) => {
            return (
                <>
                    {
                        focus ? <AutoCompleteField label={cell.title} value={get(row, cell.id)} column={cell} index={index} onChange={onFieldChange(row._id, cell.id)}
                            query={GET_ES_FILTER_LIST} esIndex={esIndex} /> :
                            <Input
                                value={get(row, cell.id)}
                                focus={focus}
                                onChange={onFieldChange(row._id, cell.id)}
                            />
                    }
                </>
            );
        }
        cell.width = 200
        return cell;
    })

    useEffect(() => {
        setRows(props.rows)
    }, [props.rows])



    const [columns, setColumns] = useState(cols());

    const onColumnResize = (widthValues) => {
        const newColumns = [].concat(columns)
        Object.keys(widthValues).forEach((columnId) => {
            const column = columns.find(({ id }) => id === columnId);
            column.width = widthValues[columnId]
        })
        setColumns(newColumns)
    }





    const classes = usetableStyles();

    // function states 
    // const [columns, Columns] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    // const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

    // queries 
    const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
        fetchPolicy: "no-cache", onCompleted: () => {
            props.setLoading(false);
        }
    });

    const tableData = elasticData?.getESPaginatedList;

    const startPaginationAt = 50;
    const esIndex = 'checkdetails_flat';

    // get paginated data hits from checkdetails_flat table
    useEffect(() => {
        getESPaginatedList({
            variables: {
                esIndex,
                filters: [{
                    field: "check._id.keyword",
                    value: props.checkId
                }],
                pagination: {
                    first: startPaginationAt,
                    keep_alive: "1micros"
                },
            }
        });
    }, [props.parent, props.checkId]);


    useEffect(() => {
        if (tableData?.hits?.length > 0) {
            let hits = tableData?.hits
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
                                column.filterKey = headers.find(el => el.name === column.name)?.filterKey;
                                return (
                                    <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange}
                                        query={GET_ES_FILTER_LIST} esIndex={esIndex} />
                                );
                            }
                        }
                    }
                }
            })

            // setColumns(headers);
            props.setLoading(false);
        }
        else if (tableData?.hits?.length === 0) {
            props.setRows([]);
            props.setLoading(false);
        }
    }, [tableData, props.dependencyUpdate]);

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

    const addNewRow = (e) => {
        e.preventDefault();
        rows.push({})
        setRows([].concat(rows))
        gridRef.current.focusCell({ x: rows.length - 1, y: 0 })
    }

    const gridRef = React.createRef()

    return (
        <Paper elevation={3} >
            <Grid container>
                <Grid item>
                    <div style={{ display: "inline", "float": "left", marginRight: "15px", marginTop: "5px" }}>
                        <Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={addNewRow}  >
                            + Input Details
                        </Button>
                    </div>
                </Grid>
                <Grid item style={{ marginTop: "10px", backgroundColor: "#fff", overflow: "scroll", maxHeight: "500px" }}>
                    <div className="DataTable" >
                        <TableGrid
                            ref={gridRef}
                            columns={columns}
                            rows={rows}
                            getRowKey={row => row.id}
                            rowHeight={74}
                            headerHeight={74}
                            cellWidth={100}
                            isColumnsResizable
                            focusOnSingleClick
                            onColumnResize={onColumnResize}
                            // focusOnSingleClick={props.focusOnSingleClick}
                            // disabledCellChecker={(row, columnId) => {
                            //     return columnId === 'age';
                            // }}
                            isScrollable
                        />
                    </div>
                </Grid>
            </Grid>

        </Paper>
    );
}

export default React.memo(TableHOC(CheckDetailsEditableTable), deepEqualObjects);