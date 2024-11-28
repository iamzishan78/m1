import React, { useState, useEffect } from "react";
import { Grid, Paper, Button, TableContainer, CircularProgress, IconButton, TextField } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import TableHOC from "components/Table/TableHOC";

// QUERIES
import { useLazyQuery, useApolloClient, useMutation } from "@apollo/client";

import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/check-details-header-schema";

// Utilities
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_COUNT } from "graphQL/useQueryESCount";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { ADD_PROPERTY } from "graphQL/useMutationAddProperty";
import { usetableStyles } from "components/Table/Styles";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import get from "lodash/get";
import set from "lodash/set";
import { Grid as TableGrid, Input, Date } from "components/Shared/SpreadsheetGrid";
import Typography from "@material-ui/core/Typography";
import AutoCompleteESField from "components/Shared/Forms/Fields/AutoCompleteESField";
import { ActionCell } from "./ActionCell";
import { UPDATE_CHECK_DETAIL } from "graphQL/useMutationUpdateCheckDetail";
import InfiniteScroll from "react-infinite-scroll-component";
import { makeStyles } from "@material-ui/styles";
import moment from "moment";

import { PopoverProperty } from "./PopoverProperty";
import { RevenueStatementHeadCells } from "./data";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: (p) => (p.showPdfSection ? "calc(100vh - 620px)" : "calc(99vh)"),
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column-reverse",
    "& .MuiTableCell-head": {
      background: "#f2f2f2",
    },
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    "& .MuiTableRow-root.MuiTableRow-hover:hover": {
      "& td:nth-child(1)": {
        position: "sticky",
        left: "0",
        zIndex: 1,
        background: "#ebebeb",
      },
    },
    "& td:nth-child(1)": {
      position: "sticky",
      left: "0",
      background: "#ffff",
      zIndex: 1,
    },
    "& th:nth-child(1)": {
      position: "sticky",
      left: "0",
      zIndex: 3,
    },
  },
  infiniteScroll: {
    display: "flex",
    flexDirection: "column-reverse",
  },
  tableGrid: {
    backgroundColor: "#fff",
    overflowX: "auto", maxHeight: (p) => (!p.showPdfSection && "calc(100vh)"),

    // maxHeight: "500px",
  },
  tableHeaderLabel: { marginLeft: "15px", paddingRight: "10px", marginTop: "5px" },
  loader: { color: "#12abe0", top: "10px", display: "flex", marginTop: "3px" },
  tableActions: {
    margin: "0 2px",
    backgroundColor: " #D4E8F1",
  },
  disableHover: {
    "& .MuiIconButton-root:hover": {
      backgroundColor: "inherit",
    },
  },
  dateRoot: {
    color: "#ffffff",
    "& .MuiInputBase-inputMarginDense": {
      marginLeft: 12,
    },
  },
});

function CheckDetailsEditableTable(props) {
  const [rows, setRows] = useState(props.rows);
  const [currentRowIndex, setCurrentRowIndex] = useState(null);
  const [resetAnchor, setResetAnchor] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [newProperty, setNewProperty] = useState(null);
  const [startPaginationAt, setStartPaginationAt] = useState(0);
  const [search, setSearch] = useState({ open: false, text: "" });
  const [sort, setSort] = useState({ orderBy: "createdAt", order: "desc" });
  const client = useApolloClient();

  const [anchorEl, AnchorEl] = useState(null);
  const gridRef = React.createRef();

  const handleClose = () => {
    setNewProperty(null);
    AnchorEl(null);
  };

  const classes = usetableStyles();
  const tclasses = useStyles({ showPdfSection: props.showPdfSection });

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache",
    onCompleted: () => {
      props.setLoading(false);
    },
  });
  const [getESCount, { data: eSCount }] = useLazyQuery(GET_ES_COUNT, { fetchPolicy: "no-cache" });
  const [loadMoreList, { data: loadMoreData, loading }] = useLazyQuery(GET_ES_PAGINATED_LIST, {});

  useEffect(() => {
    if (loadMoreData?.getESPaginatedList?.hits) {
      let hits = copy(loadMoreData.getESPaginatedList.hits);
      hits = hits.reverse();
      props.setRows(hits.concat(rows));
      setTimeout(() => document.getElementById(`${hits.length - 1}-0`)?.scrollIntoView(), 0);
    }
  }, [loadMoreData]);

  useEffect(() => {
    getESCount({
      variables: {
        esIndex,
        filters: [
          {
            field: "check._id.keyword",
            value: props.checkId,
          },
        ],
        search: search.text ? `${search.text}*` : "",
      },
    });
  }, [props.parent, props.checkId, search.text]);

  useEffect(() => {
    if (eSCount?.getESCount) {
      setStartPaginationAt(eSCount.getESCount.total);
    }
  }, [eSCount]);

  const [updateCheckDetail] = useMutation(UPDATE_CHECK_DETAIL);

  const tableData = elasticData?.getESPaginatedList;

  // const startPaginationAt = 10;
  const esIndex = "checkdetails_flat";

  const onFieldChange = (rowId, field, type) => async (value) => {
    // const cRow = currentRow
    setCurrentRowIndex(currentRow);
    // let newPropertyAdded = false
    let row = rows.find((r) => r._id === rowId);
    if (get(row, field) == value && type !== "date") return;

    set(row, field, value);
    // made check for purchaser prop instead of simple number to get name, state and county
    if (field === "property.purchaserNumber") {
      set(row, `property.name`, "");
      set(row, `property.state`, "");
      set(row, `property.county`, "");
      let checkDetail
      const { data: result1 } = await client.query({
        query: GET_ES_PAGINATED_LIST,
        variables: {
          esIndex: "properties_flat",
          search: `number:"${value}"`,
          pagination: {
            first: 1,
            keep_alive: "1micros",
          },
        },
      });
      if (result1?.getESPaginatedList?.hits.length) {
        checkDetail = result1
      } else {
        const { data: result2 } = await client.query({
          query: GET_ES_PAGINATED_LIST,
          variables: {
            esIndex: "properties_flat",
            search: `name:"${value}"`,
            pagination: {
              first: 1,
              keep_alive: "1micros",
            },
          },
        });
        checkDetail = result2
      }

      let newProperty = {};
      if (checkDetail?.getESPaginatedList?.hits.length > 0) {
        newProperty = checkDetail.getESPaginatedList.hits[0];
        setNewProperty(null);
      } else {
        const { data: property } = await client.mutate({
          mutation: ADD_PROPERTY,
          variables: {
            property: {
              source: "Manual Entry",
              approvalStatus: "Unapproved",
              number: value,
            },
          },
        });
        newProperty = property.addProperty.property;
        setNewProperty(newProperty);
        // newPropertyAdded = true
      }
      Object.keys(newProperty).forEach((key) => {
        set(row, `property.${key}`, newProperty[key]);
      });
    }
    if (field === "IsDeleted") {
      setRows([].concat(rows.filter((r) => r._id !== rowId)));
    } else setRows([].concat(rows));

    row.check = props.checkId;
    updateCheckDetail({
      variables: { checkDetail: row },
      refetchQueries: [],
      awaitRefetchQueries: true,
    }).then((resp) => {
      if (!row._id && resp?.data?.updateCheckDetail?.updatedCheckDetail?._id) {
        set(row, `_id`, resp.data.updateCheckDetail.updatedCheckDetail._id);
        setResetAnchor(!resetAnchor);
        // if(newPropertyAdded){
        //     AnchorEl(document.getElementById(`${cRow}-0`));
        // }
      }
    });
  };

  useEffect(() => {
    if (currentRowIndex) {
      AnchorEl(document.getElementById(`${currentRowIndex}-0`));
    }
  }, [resetAnchor]);

  const cols = () =>
    RevenueStatementHeadCells.map((cell, index) => {
      cell.value = (row, { focus }) => {
        let value = get(row, cell.id);
        let date = get(row, cell.id);
        if (cell.type === "date" && value) {
          value = moment(value).format("MM/DD/YYYY");
        }

        return (
          <>
            <div id={`id-${cell.id}`}></div>
            {focus && cell.type === "autocomplete" ? (
              <AutoCompleteESField
                label={cell.title}
                value=""
                column={cell}
                index={index}
                onChange={onFieldChange(row._id, cell.id)}
                query={GET_ES_FILTER_LIST}
                esIndex={cell.esIndex}
              />
            ) : focus && cell.type === "date" ? (
              <Date
                focus={focus}
                value={date}
                dataDateFormat="MM/DD/YYYY"
                onChange={(value) => {
                  const date = moment(value).toISOString();
                  let dRow = rows.find((r) => r._id === row._id);
                  set(dRow, cell.id, date);
                  onFieldChange(row._id, cell.id, cell.type)(date);
                }}
              />
            ) : cell.type === "action" ? (
              <ActionCell id={cell.id + index} onChange={onFieldChange(row._id, "IsDeleted")} />
            ) : (
              <Input
                value={value}
                focus={focus}
                onChange={onFieldChange(row._id, cell.id)}
                addNewRow={addNewRow}
                RevenueStatementHeadCells={RevenueStatementHeadCells}
                field={cell.id}
                gridRef={gridRef}
              />
            )}
          </>
        );
      };
      return cell;
    });

  const [columns, setColumns] = useState(cols());

  const onColumnResize = (widthValues) => {
    const newColumns = [].concat(columns);
    Object.keys(widthValues).forEach((columnId) => {
      const column = columns.find(({ id }) => id === columnId);
      column.width = widthValues[columnId];
    });
    setColumns(newColumns);
  };

  // get paginated data hits from checkdetails_flat table
  useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex,
        filters: [
          {
            field: "check._id.keyword",
            value: props.checkId,
          },
        ],
        sort: { [sort.orderBy]: { order: sort.order } },
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: search.text ? `${search.text}*` : "",
      },
    });
  }, [props.parent, props.checkId, search.text, sort, startPaginationAt]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      let hits = copy(tableData?.hits);
      setRows(hits.reverse());
      let headers = copy(TableHeader);

      headers.forEach((column) => {
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: "custom",
            filterOptions: {
              display: (filterList, onChange, index, column) => {
                column.filterKey = headers.find((el) => el.name === column.name)?.filterKey;
                return (
                  <AutoCompleteFilter
                    filterList={filterList}
                    column={column}
                    index={index}
                    onChange={onChange}
                    query={GET_ES_FILTER_LIST}
                    esIndex={esIndex}
                  />
                );
              },
            },
          };
        }
      });

      // setColumns(headers);
      props.setLoading(false);
    } else if (tableData?.hits?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [elasticData, props.dependencyUpdate]);

  const addNewRow = (e, gridRef) => {
    if (e) e.preventDefault();
    rows.push({});
    setRows([].concat(rows));
    gridRef.current?.focusCell({ x: rows.length - 1, y: 0 });
    setTimeout(() => document.getElementById(`${rows.length - 1}-0`)?.click(), 0);
  };

  const loadMore = () => {
    setTimeout(() => {
      // setRows([{}, {}, {}].concat(rows))
      setTimeout(() => {
        loadMoreList({
          variables: {
            esIndex,
            filters: [
              {
                field: "check._id.keyword",
                value: props.checkId,
              },
            ],
            sort: { [sort.orderBy]: { order: sort.order } },
            pagination: {
              pit: tableData.pit,
              after: rows[0] ? rows[0].sort : null,
            },
          },
        });
        // setTimeout(() => document.getElementById(`4-0`)?.scrollIntoView(), 0)
      }, 0);
    }, 0);
  };

  const createSortHandler = (id) => {
    if (sort.orderBy === id) {
      setSort({ orderBy: id, order: sort.order === "asc" ? "desc" : "asc" });
    } else {
      setSort({ orderBy: id, order: "desc" });
    }
  };

  return (
    <Paper elevation={3}>
      <Grid id="checkDetailGrid" container style={{ backgroundColor: "#F2F2F2", maxHeight: "50vh" }}>
        <Grid item md={12} style={{ border: "1px solid #c1c1c1", paddingBottom: "10px" }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="center" style={{ justifyContent: "space-between" }}>
            <Grid item style={{ display: "flex" }}>
              {search.open ? (
                <Grid container spacing={1} alignItems="center">
                  <Grid item style={{ marginTop: "15px" }}>
                    <IconButton disableRipple={true} disableFocusRipple={true} className={tclasses.disableHover}>
                      <SearchIcon />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <TextField
                      id="search-field"
                      label=""
                      value={search.text}
                      onChange={(e) => setSearch({ ...search, text: e.target.value })}
                    />
                  </Grid>
                  <Grid item style={{ marginTop: "15px" }}>
                    <IconButton aria-label="delete" onClick={() => setSearch({ open: false, text: "" })}>
                      <CloseIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ) : (
                <Typography variant="h6" component="h2" className={tclasses.tableHeaderLabel}>
                  Check Details
                </Typography>
              )}
              {loading ? <CircularProgress size="32px" className={tclasses.loader}></CircularProgress> : ""}
            </Grid>
            <Grid item>
              <Grid container direction="row" style={{ marginTop: "5px", marginRight: "15px" }}>
                <Grid item style={{ marginTop: "5px" }}>
                  <Button color="secondary" id="addNewLineItemButton" className={classes.multiSelectionTopBarButtons} onClick={(e) => addNewRow(e, gridRef)}>
                    Add new line item
                  </Button>
                </Grid>
                <Grid item>
                  <IconButton
                    aria-label="delete"
                    className={tclasses.tableActions}
                    onClick={() => setSearch({ ...search, open: !search.open })}
                  >
                    <SearchIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={tclasses.tableGrid}>
          <InfiniteScroll
            dataLength={rows.length}
            next={loadMore}
            className={tclasses.infiniteScroll}
            inverse={true}
            hasMore={rows.length < tableData?.total}
            // loader={<h4>Loading...</h4>}
            scrollableTarget="scrollableDiv"
          >
            <TableContainer className={tclasses.container} id="scrollableDiv">
              <TableGrid
                ref={gridRef}
                setRows={setRows}
                columns={columns}
                rows={rows}
                getRowKey={(row) => row.id}
                rowHeight={74}
                headerHeight={74}
                cellWidth={100}
                isColumnsResizable
                focusOnSingleClick
                onColumnResize={onColumnResize}
                sort={sort}
                setCurrentRow={setCurrentRow}
                createSortHandler={createSortHandler}
                // focusOnSingleClick={props.focusOnSingleClick}
                disabledCellChecker={(row, column) => {
                  return column.disabled;
                }}
                isScrollable
              />
              {newProperty?._id && (
                <PopoverProperty
                  onFieldChange={onFieldChange}
                  data={rows}
                  property={newProperty}
                  anchorEl={anchorEl}
                  handleClose={handleClose}
                  onClose={handleClose}
                />
              )}
            </TableContainer>
          </InfiniteScroll>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default React.memo(TableHOC(CheckDetailsEditableTable), deepEqualObjects);
