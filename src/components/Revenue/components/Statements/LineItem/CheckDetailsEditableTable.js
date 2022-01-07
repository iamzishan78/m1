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
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { usetableStyles } from "components/Table/Styles";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import get from 'lodash/get'
import set from 'lodash/set'
import { Grid, Input, Select } from 'components/Shared/SpreadsheetGrid'
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
        id: "property.number", title: "Property Code", esKey: 'propert.number.keyword'
    },
    {
        id: "property.name", title: "Property Name", esKey: 'property.name.keyword'
    },
    {
        id: "property.state", title: "State", esKey: 'property.state.keyword'
    },
    {
        id: "property.county", title: "County", esKey: 'property.county.keyword'
    },
    {
        id: "date", title: "Sales Date", esKey: 'date'
    },
    {
        id: "product", title: "Product", esKey: 'product.keyword'
    },
    {
        id: "disbursement", title: "Decimal Interest", esKey: 'disbursement.keyword'
    },
    {
        id: "interestType", title: "Type", esKey: 'interestType.keyword'
    },
    {
        id: "price", title: "Avg Price", esKey: 'price'
    },
    {
        id: "grossOwnerVolume", title: "Sales Vol", esKey: 'grossOwnerVolume'
    },
    {
        id: "grossOwnerValue", title: "Gross Rev", esKey: 'grossOwnerValue'
    },
    {
        id: "ownerTax", title: "Severence", esKey: 'ownerTax'
    },
    {
        id: "ownerDeducts", title: "Deduct Amt", esKey: 'ownerDeducts'
    },
    {
        id: "deductType", title: "Deduct Cd", esKey: 'deductType.keyword'
    },
    {
        id: "netOwnerValue", title: "Owner Net Rev", esKey: 'netOwnerValue'
    }
];


function CheckDetailsEditableTable(props) {

    const [rows, setRows] = useState(props.rows);

    const onFieldChange = (rowId, field) => (value) => {
        const row = rows.find((r) => r._id === rowId);
        set(row, field, value)
        setRows([].concat(rows))
    }

    const cols = () => RevenueStatementHeadCells.map((cell, index) => {
        cell.value = (row, { focus }) => {
            return (


                <AutoCompleteField column={cell} index={index} onChange={onFieldChange}
                    query={GET_ES_FILTER_LIST} esIndex={esIndex} />


                // <Input
                //     value={get(row, cell.id)}
                //     focus={focus}
                //     onChange={onFieldChange(row._id, cell.id)}
                // />
            );
        }
        return cell;
    })

    useEffect(() => {
        setRows(props.rows)
    }, [props.rows])


    const initColumns = () => {
        return [
            {
                title: 'First name',
                value: (row, { focus }) => {
                    return (
                        <Input
                            value={row.firstName}
                            focus={focus}
                            onChange={onFieldChange(row.id, 'firstName')}
                        />
                    );
                },
                id: 'firstName'
            },
            {
                title: 'Second name',
                value: (row, { focus }) => {
                    return (
                        <Input
                            value={row.secondName}
                            focus={focus}
                            onChange={onFieldChange(row.id, 'secondName')}
                        />
                    );
                },
                id: 'secondName'
            },
            {
                title: 'Position',
                value: (row, { focus }) => {
                    return (
                        <Select
                            selectedId={row.positionId}
                            isOpen={focus}
                            items={positions}
                            onChange={onFieldChange(row.id, 'positionId')}
                        />
                    );
                },
                id: 'position'
            },
            {
                title: 'Age',
                value: (row, { focus }) => {
                    return (
                        <Input
                            value={row.age}
                            focus={focus}
                            onChange={onFieldChange(row.id, 'age')}
                        />
                    );
                },
                id: 'age',
                width: 10
            }
        ];
    }

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

    return (
        <Container
            maxWidth={false}
            className={classes.container}
            id={props.id ? props.id : props.parent}

        >

            <div className="DataTable">
                <Grid
                    columns={columns}
                    rows={rows}
                    getRowKey={row => row.id}
                    rowHeight={50}
                    isColumnsResizable
                    focusOnSingleClick
                    onColumnResize={onColumnResize}
                    // focusOnSingleClick={props.focusOnSingleClick}
                    // disabledCellChecker={(row, columnId) => {
                    //     return columnId === 'age';
                    // }}
                    isScrollable={props.isScrollable}
                />
            </div>

            {/* <Table
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
            /> */}
        </Container>
    );
}

export default React.memo(TableHOC(CheckDetailsEditableTable), deepEqualObjects);