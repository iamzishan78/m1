import React, { useState, useEffect } from "react";
import { Grid, Paper, Button, TableContainer, CircularProgress, IconButton, TextField } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useApolloClient, useMutation } from "@apollo/client";

import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/check-details-header-schema';

// Utilities
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { usetableStyles } from "components/Table/Styles";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import get from 'lodash/get'
import set from 'lodash/set'
import { Grid as TableGrid, Input } from 'components/Shared/SpreadsheetGrid'
import Typography from '@material-ui/core/Typography';
import { AutoCompleteField } from "./AutoCompleteField";
import { ActionCell } from "./ActionCell";
import { UPDATE_CHECK_DETAIL } from "graphQL/useMutationUpdateCheckDetail";
import InfiniteScroll from "react-infinite-scroll-component";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";
import { KeyboardDatePicker } from "@material-ui/pickers";


const RevenueStatementHeadCells = [
    {
        id: "property.number", title: "Property Code", filterKey: 'property.number.keyword', sort: true, type: 'autocomplete', width: '180px'
    },
    {
        id: "property.name", title: "Property Name", filterKey: 'property.name.keyword', sort: true, width: '210px'
    },
    {
        id: "property.state", title: "State", filterKey: 'property.state.keyword', sort: true, width: '100px'
    },
    {
        id: "property.county", title: "County", filterKey: 'property.county.keyword', sort: true, width: '130px'
    },
    {
        id: "date", title: "Sales Date", filterKey: 'date', sort: true, type: 'date', width: '180px'
    },
    {
        id: "product", title: "Product", filterKey: 'product.keyword', sort: true, type: 'autocomplete', width: '130px'
    },
    {
        id: "disbursement", title: "Decimal Interest", filterKey: 'disbursement.keyword', sort: true, width: '150px'
    },
    {
        id: "interestType", title: "Type", filterKey: 'interestType.keyword', sort: true, type: 'autocomplete', width: '100px'
    },
    {
        id: "price", title: "Avg Price", filterKey: 'price', sort: true, width: '100px'
    },
    {
        id: "grossOwnerVolume", title: "Sales Volume", filterKey: 'grossOwnerVolume', sort: true, width: '125px'
    },
    {
        id: "grossOwnerValue", title: "Gross Revenue", filterKey: 'grossOwnerValue', sort: true, width: '100px'
    },
    {
        id: "ownerTax", title: "Severence Tax", filterKey: 'ownerTax', sort: true, width: '100px'
    },
    {
        id: "ownerDeducts", title: "Deduct Amount", filterKey: 'ownerDeducts', sort: true, width: '100px'
    },
    {
        id: "deductType", title: "Deduct Code", filterKey: 'deductType.keyword', sort: true, type: 'autocomplete', width: '200px'
    },
    {
        id: "netOwnerValue", title: "Owner Net Revenue", filterKey: 'netOwnerValue', sort: true, width: '150px'
    },
    {
        id: "action", filterKey: 'action', title: "", type: 'action', width: '50px'
    }
];


const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
        backgroundColor: "#fff", display: "flex",
        flexDirection: "column-reverse",
        "& .MuiTableCell-head": {
            background: "#f2f2f2"
        },
        "&::-webkit-scrollbar": {
            width: "0.75em",
            height: "0.75em",
        },
        '& .MuiTableRow-root.MuiTableRow-hover:hover': {
            "& td:nth-child(1)": {
                position: 'sticky',
                left: '0',
                zIndex: 1,
                background: '#ebebeb',
            },
        },
        "& td:nth-child(1)": {
            position: 'sticky',
            left: '0',
            background: '#ffff',
            zIndex: 1,
        },
        "& th:nth-child(1)": {
            position: 'sticky',
            left: '0',
            zIndex: 3
        },

    },
    infiniteScroll: {
        display: "flex", flexDirection: "column-reverse"
    },
    tableGrid: {
        backgroundColor: "#fff", overflow: "scroll", maxHeight: "500px",
    },
    tableHeaderLabel: { marginLeft: "15px", paddingRight: '10px', marginTop: "5px" },
    loader: { color: '#12abe0', top: '10px', display: 'flex', marginTop: '3px' },
    tableActions: {
        margin: '0 2px',
        backgroundColor: ' #D4E8F1'
    },
    disableHover: {
        '& .MuiIconButton-root:hover': {
            backgroundColor: 'inherit'
        }
    }
});


function CheckDetailsEditableTable(props) {

    const [rows, setRows] = useState(props.rows);
    const [search, setSearch] = useState({ open: false, text: '' })
    const [sort, setSort] = useState({ orderBy: 'createdAt', order: 'desc' })
    const client = useApolloClient();


    const classes = usetableStyles();

    // const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

    // queries 
    const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
        fetchPolicy: "no-cache", onCompleted: () => {
            props.setLoading(false);
        }
    });
    const [loadMoreList, { data: loadMoreData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    });

    useEffect(() => {
        if (loadMoreData?.getESPaginatedList?.hits) {
            debugger;
            let hits = copy(loadMoreData.getESPaginatedList.hits)
            hits = hits.reverse()
            props.setRows(hits.concat(rows));
            setTimeout(() => document.getElementById(`${hits.length - 1}-0`)?.scrollIntoView(), 0)
        }

    }, [loadMoreData])

    const [updateCheckDetail] = useMutation(UPDATE_CHECK_DETAIL);

    const tableData = elasticData?.getESPaginatedList;

    const startPaginationAt = 10;
    const esIndex = 'checkdetails_flat';


    const onFieldChange = (rowId, field, type) => (async (value) => {
        let row = rows.find((r) => r._id === rowId);
        if (get(row, field) == value && type !== 'date') return;

        set(row, field, value)
        if (field === 'property.number') {
            const { data: checkDetail } = await client.query({
                query: GET_ES_PAGINATED_LIST,
                variables: {
                    esIndex,
                    search: `property.number.keyword:${value}`,
                    pagination: {
                        first: 1,
                        keep_alive: "1micros"
                    },
                },
            });
            if (checkDetail?.getESPaginatedList?.hits.length > 0) {
                const newProperty = checkDetail.getESPaginatedList.hits[0].property
                set(row, '', value)
                set(row, `property.state`, '')
                set(row, `property.county`, '')
                Object.keys(newProperty).forEach((key) => { set(row, `property.${key}`, newProperty[key]) })
                console.log("Row", row)
            }
        }
        if (field === 'IsDeleted') {
            setRows([].concat(rows.filter((r) => r._id !== rowId)))
        } else
            setRows([].concat(rows))

        updateCheckDetail({
            variables: { checkDetail: row },
            refetchQueries: [],
            awaitRefetchQueries: true
        })
    })

    const cols = () => RevenueStatementHeadCells.map((cell, index) => {
        cell.value = (row, { focus }) => {

            let value = get(row, cell.id)
            if (cell.type === 'date' && value) {
                value = moment(value).format('MM/DD/YYYY')
            }
            return (
                <>
                    {
                        focus && cell.type === 'autocomplete' ? <AutoCompleteField label={cell.title} value={get(row, cell.id)} column={cell} index={index} onChange={onFieldChange(row._id, cell.id)}
                            query={GET_ES_FILTER_LIST} esIndex={esIndex} />

                            : focus && cell.type === 'date' ? <KeyboardDatePicker
                                className={classes.maxWidth}
                                // disableToolbar
                                variant="inline"
                                format="MM/DD/YYYY"
                                margin="normal"
                                fullWidth
                                id="date-picker-inline"
                                value={value}
                                onKeyDown={(e) => {
                                    if (e.keyCode === 13) {
                                        e.stopPropagation();
                                        let dRow = rows.find((r) => r._id === row._id);
                                        onFieldChange(dRow._id, cell.id, cell.type)(get(dRow, cell.id))
                                    }
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        let dRow = rows.find((r) => r._id === row._id);
                                        onFieldChange(dRow._id, cell.id)(get(dRow, cell.id))
                                    }, 100)

                                }}
                                onChange={(date) => {
                                    if ((date && date?._d?.toString() !== 'Invalid Date')) {
                                        let dRow = rows.find((r) => r._id === row._id);
                                        set(dRow, cell.id, date ? String(date["_d"]) : "")

                                    }
                                }}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />

                                : cell.type === 'action' ? <ActionCell id={cell.id + index} onChange={onFieldChange(row._id, 'IsDeleted')} />
                                    : <Input
                                        value={value}
                                        focus={focus}
                                        onChange={onFieldChange(row._id, cell.id)}
                                    />
                    }
                </>
            );
        }
        // cell.width = 200
        return cell;
    })

    const [columns, setColumns] = useState(cols());

    const onColumnResize = (widthValues) => {
        const newColumns = [].concat(columns)
        Object.keys(widthValues).forEach((columnId) => {
            const column = columns.find(({ id }) => id === columnId);
            column.width = widthValues[columnId]
        })
        setColumns(newColumns)
    }


    // get paginated data hits from checkdetails_flat table
    useEffect(() => {
        getESPaginatedList({
            variables: {
                esIndex,
                filters: [{
                    field: "check._id.keyword",
                    value: props.checkId
                }],
                sort: { [sort.orderBy]: { order: sort.order } },
                pagination: {
                    first: startPaginationAt,
                    keep_alive: "1micros"
                },
                search: search.text ? `${search.text}*` : ''
            }
        });
    }, [props.parent, props.checkId, search.text, sort]);


    useEffect(() => {
        if (tableData?.hits?.length > 0) {
            let hits = copy(tableData?.hits)
            setRows(hits.reverse());
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
    }, [elasticData, props.dependencyUpdate]);

    const addNewRow = (e) => {
        e.preventDefault();
        rows.push({})
        setRows([].concat(rows))
        gridRef.current.focusCell({ x: rows.length - 1, y: 0 })
        setTimeout(() => document.getElementById(`${rows.length - 1}-0`)?.click(), 0)
    }

    const loadMore = () => {
        setTimeout(() => {
            // setRows([{}, {}, {}].concat(rows))
            setTimeout(() => {
                loadMoreList({
                    variables: {
                        esIndex,
                        filters: [{
                            field: "check._id.keyword",
                            value: props.checkId
                        }],
                        sort: { [sort.orderBy]: { order: sort.order } },
                        pagination: {
                            pit: tableData.pit,
                            after: rows[0] ? rows[0].sort : null,
                        },
                    }
                })
                // setTimeout(() => document.getElementById(`4-0`)?.scrollIntoView(), 0)
            }, 0)
        }, 0)
    }

    const createSortHandler = (id) => {
        if (sort.orderBy === id) {
            setSort({ orderBy: id, order: sort.order === 'asc' ? 'desc' : 'asc' })
        } else {
            setSort({ orderBy: id, order: 'desc' })
        }
    }

    const gridRef = React.createRef()
    const tclasses = useStyles();


    return (
        <Paper elevation={3} >
            <Grid container style={{ backgroundColor: "#F2F2F2" }} >
                <Grid item md={12} style={{ border: '1px solid #c1c1c1', paddingBottom: '10px' }}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ justifyContent: "space-between" }}>
                        <Grid item style={{ display: 'flex' }}>
                            {
                                search.open ?
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item style={{ marginTop: '15px' }}>
                                            <IconButton disableRipple={true} disableFocusRipple={true} className={tclasses.disableHover}>
                                                <SearchIcon />
                                            </IconButton>
                                        </Grid>
                                        <Grid item>
                                            <TextField id="search-field" label="" value={search.text} onChange={(e) => setSearch({ ...search, text: e.target.value })} />
                                        </Grid>
                                        <Grid item style={{ marginTop: '15px' }}>
                                            <IconButton aria-label="delete" onClick={() => setSearch({ open: false, text: '' })}>
                                                <CloseIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid> :
                                    <Typography variant="h6" component="h2" className={tclasses.tableHeaderLabel}>
                                        Check Details
                                    </Typography>
                            }
                            {loading ? <CircularProgress size='32px' className={tclasses.loader}></CircularProgress> : ''}
                        </Grid>
                        <Grid item>
                            <Grid container direction="row" style={{ marginTop: "5px", marginRight: "15px" }}>
                                <Grid item style={{ marginTop: "5px" }}>
                                    <Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={addNewRow}  >
                                        Add new line item
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <IconButton aria-label="delete" className={tclasses.tableActions} onClick={() => setSearch({ ...search, open: !search.open })}>
                                        <SearchIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={tclasses.tableGrid} >
                    <InfiniteScroll
                        dataLength={rows.length}
                        next={loadMore}
                        className={tclasses.infiniteScroll}
                        inverse={true}
                        hasMore={rows.length < tableData?.total}
                        // loader={<h4>Loading...</h4>}
                        scrollableTarget="scrollableDiv"
                    >

                        <TableContainer className={tclasses.container} id='scrollableDiv'>

                            <TableGrid
                                ref={gridRef}
                                setRows={setRows}
                                columns={columns}
                                rows={rows}
                                getRowKey={row => row.id}
                                rowHeight={74}
                                headerHeight={74}
                                cellWidth={100}
                                isColumnsResizable
                                focusOnSingleClick
                                onColumnResize={onColumnResize}
                                sort={sort}
                                createSortHandler={createSortHandler}
                                // focusOnSingleClick={props.focusOnSingleClick}
                                // disabledCellChecker={(row, columnId) => {
                                //     return columnId === 'age';
                                // }}
                                isScrollable
                            />
                        </TableContainer>
                    </InfiniteScroll>
                </Grid>
            </Grid>

        </Paper >
    );
}

export default React.memo(TableHOC(CheckDetailsEditableTable), deepEqualObjects);