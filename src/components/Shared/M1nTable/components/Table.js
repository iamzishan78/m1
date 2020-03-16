import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import Input from "@material-ui/core/Input";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";
import CircularProgress from "@material-ui/core/CircularProgress";
import Skeleton from "@material-ui/lab/Skeleton";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from "@material-ui/icons/Check";
import Badge from "@material-ui/core/Badge";
import M1nTable from "../M1nTable";
import ExpandableCardProvider from "../../../ExpandableCard/ExpandableCardProvider";
import Test from "../../../ExpandableCard/Test";
import WellCardProvider from "../../../WellCard/WellCardProvider";
import { useHistory } from "react-router-dom";

import { TableContext } from "./TableContext";
import { AppContext } from "../../../../AppContext";
import TrackToggleButton from "../../TrackToggleButton";
import Tags from "../../Tagger";
import Comments from "../../Comments";

import ChatIcon from "@material-ui/icons/Chat";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { JsxEmit } from "typescript";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "ownershipType",
    numeric: false,
    disablePadding: false,
    label: "Entity"
  },
  { id: "interestType", numeric: false, disablePadding: false, label: "Type" },
  {
    id: "ownershipPercentage",
    numeric: true,
    disablePadding: false,
    label: "Interest"
  },
  {
    id: "appraisedValue",
    numeric: true,
    disablePadding: false,
    label: "Appraised Value"
  },
  { id: "comments", numeric: false, disablePadding: false, label: "" },
  { id: "tags", numeric: false, disablePadding: false, label: "" },
  { id: "isTracked", numeric: false, disablePadding: false, label: "" }
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          /> */}
        </TableCell>

        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            //align={headCell.numeric ? 'right' : 'left'}
            align="left"
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  addForm: {
    margin: "15px",
    paddingLeft: "100px",
    "& > *": {
      margin: theme.spacing(1),
      width: 200
    }
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const [showAdd, setShowAdd] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [entityValue, setEntityValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [interestValue, setInterestValue] = useState("");
  const [appraisedValue, setAppraisedValue] = useState("");
  const [, setStateTable] = useContext(TableContext);

  const addOwner = props => {
    let newOwner = {
      name: nameValue,
      ownershipType: entityValue,
      interestType: typeValue,
      appraisedValue: appraisedValue,
      ownershipPercentage: interestValue
    };
    setStateTable(state => ({ ...state, ownerToAdd: newOwner }));

    setNameValue("");
    setEntityValue("");
    setTypeValue("");
    setInterestValue("");
    setAppraisedValue("");
    setShowAdd(false);
  };
  return (
    <Toolbar className={clsx(classes.root)}>
      {showAdd > 0 ? (
        <form className={classes.addForm} noValidate autoComplete="off">
          <TextField
            onChange={e => {
              setNameValue(e.target.value);
            }}
            value={nameValue}
            placeholder="Name"
            label="Name"
            variant="outlined"
            color="secondary"
            inputProps={{ "aria-label": "description" }}
          />
          <TextField
            onChange={e => {
              setEntityValue(e.target.value);
            }}
            value={entityValue}
            placeholder="Entity"
            label="Entity"
            variant="outlined"
            color="secondary"
            inputProps={{ "aria-label": "description" }}
          />
          <TextField
            onChange={e => {
              setTypeValue(e.target.value);
            }}
            value={typeValue}
            placeholder="Type"
            label="Type"
            variant="outlined"
            color="secondary"
            inputProps={{ "aria-label": "description" }}
          />
          <TextField
            onChange={e => {
              setInterestValue(e.target.value);
            }}
            value={interestValue}
            placeholder="Interest"
            label="Interest"
            variant="outlined"
            color="secondary"
            inputProps={{ "aria-label": "description" }}
          />
          <TextField
            onChange={e => {
              setAppraisedValue(e.target.value);
            }}
            value={appraisedValue}
            placeholder="Value"
            label="Appraised Value"
            variant="outlined"
            color="secondary"
            inputProps={{ "aria-label": "description" }}
          />
        </form>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          {props.header}
        </Typography>
      )}

      {showAdd ? (
        <Tooltip title="done">
          <IconButton
            color="primary"
            onClick={() => {
              addOwner(props);
            }}
            aria-label="done"
          >
            <CheckIcon color="secondary" />
          </IconButton>
        </Tooltip>
      ) : (
        props.addAble && (
          <Tooltip title="Add">
            <IconButton
              color="primary"
              onClick={e => {
                props.addAble.externalAdd
                  ? props.addAble.externalAddFunction(e)
                  : setShowAdd(true);
              }}
              aria-label="add"
            >
              <AddIcon color="secondary" />
            </IconButton>
          </Tooltip>
        )
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  expandedRow: {
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 0,
    paddingTop: 0
  },
  collapseInsideRow: {
    width: "100%"
  },
  tagWrapper: {
    margin: "10px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "nowrap"
  },
  expand: {
    backgroundColor: "#efefef",
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpenOwner: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      background: theme.palette.secondary.main
    }
    //transform: 'rotate(180deg)',
  },
  expandOpenTag: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      background: theme.palette.secondary.main
    }
    //transform: 'rotate(180deg)',
  },
  expandOpenComment: {
    backgroundColor: theme.palette.secondary.main,
    "&:hover": {
      background: theme.palette.secondary.main
    }
    //transform: 'rotate(180deg)',
  },
  cursorPointer: {
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

export default function SubTable(props) {
  const classes = useStyles();
  let history = useHistory();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateTable] = useContext(TableContext);

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("isTracked");
  const [selected, setSelected] = React.useState([]);

  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [source, setSource] = useState(null);
  const [rows, setRows] = React.useState();

  const [collapsedRow, setCollapsedRow] = useState(null);
  const [collapseComponent, setCollapseComponent] = useState("owner");
  const [expanded, setExpanded] = useState(false);
  const [expandedTag, setExpandedTag] = useState(false);
  const [expandedComment, setExpandedComment] = useState(false);
  const [expandedContact, setExpandedContact] = useState(false);
  const [expandedOwnersContacts, setExpandedOwnersContacts] = useState(false);
  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [selectedRow, setSelectedRow] = React.useState();

  useEffect(() => {
    if (stateTable.ownerToAdd) {
      setRows([stateTable.ownerToAdd, ...rows]);
    }
  }, [stateTable.ownerToAdd]);

  useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.Id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleExpandClickTag = async (index, component) => {
    setCollapseComponent(component);
    setCollapsedRow(index);
    setExpandedTag(!expandedTag);
    setExpanded(false);
    setExpandedComment(false);
    setExpandedContact(false);
    setExpandedOwnersContacts(false);
  };
  const handleExpandClickComment = async (index, component) => {
    setCollapseComponent(component);
    setCollapsedRow(index);
    setExpandedComment(!expandedComment);
    setExpanded(false);
    setExpandedTag(false);
    setExpandedContact(false);
    setExpandedOwnersContacts(false);
  };

  const handleExpandClick = async (index, component) => {
    setCollapseComponent(component);
    setCollapsedRow(index);
    setExpanded(!expanded);
    setExpandedTag(false);
    setExpandedComment(false);
    setExpandedContact(false);
    setExpandedOwnersContacts(false);
  };

  const handleExpandClickContact = async (index, component) => {
    setCollapseComponent(component);
    setCollapsedRow(index);
    setExpanded(false);
    setExpandedTag(false);
    setExpandedComment(false);
    setExpandedContact(!expandedContact);
    setExpandedOwnersContacts(false);
  };

  const handleExpandClickOwnersContacts = async (index, component) => {
    setCollapseComponent(component);
    setCollapsedRow(index);
    setExpanded(false);
    setExpandedTag(false);
    setExpandedComment(false);
    setExpandedContact(false);
    setExpandedOwnersContacts(!expandedOwnersContacts);
  };

  const handleRowClick = (e, row) => {
    console.log(e);
    console.log(e.nativeEvent);
    setMouseX(e.nativeEvent.clientX);
    setMouseY(e.nativeEvent.clientY - 70);
    setSelectedRow(row);
    if (props.targetLabel === "well")
      setStateApp(state => ({ ...state, selectedWell: row }));
    handleOpenExpandableCard();
  };
  const handleOpenExpandableCard = () => {
    //setStateApp(state => ({...state,showExpandableCard:true}))
    setShowExpandableCard(true);
  };
  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    // setStateApp(state => ({...state,showExpandableCard:true}))
  };

  /* let rowsLen = 0;
  if(rows && rows.length > 0) {
    rowsLen = rows.length
  }
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowsLen - page * rowsPerPage); */

  return rows && rows.length > 0 ? (
    <div className={classes.root}>
      {showExpandableCard &&
        ((props.targetLabel === "owner" && (
          <ExpandableCardProvider
            expanded={false}
            handleCloseExpandableCard={handleCloseExpandableCard}
            component={<Test hello="Owner Card Not Available" />}
            title={selectedRow ? selectedRow.name : null}
            subTitle={selectedRow ? selectedRow.interestType : null}
            parent="owner"
            mouseX={mouseX}
            mouseY={mouseY}
            position="absolute"
            cardLeft={mouseX}
            cardTop={mouseY}
            zIndex={101}
            cardWidth="380px"
            cardHeight="380px"
            cardWidthExpanded="85vw"
            cardHeightExpanded="80vh"
            source={stateApp.user}
            sourceSourceId={stateApp.user.id}
            sourceName={stateApp.user.name}
            sourceLabel="user"
            target={selectedRow ? selectedRow : null}
            targetSourceId={selectedRow ? selectedRow.id : null}
            targetName={selectedRow ? selectedRow.name : null}
            targetLabel="owner"
          ></ExpandableCardProvider>
        )) ||
          (props.targetLabel === "well" && (
            <ExpandableCardProvider
              expanded={false}
              handleCloseExpandableCard={handleCloseExpandableCard}
              component={<WellCardProvider></WellCardProvider>}
              title={selectedRow.wellName}
              subTitle={selectedRow.operator}
              parent="well"
              mouseX={mouseX}
              mouseY={mouseY}
              position="absolute"
              cardLeft={mouseX}
              cardTop={mouseY}
              zIndex={99}
              cardWidth="380px"
              cardHeight="380px"
              cardWidthExpanded="95vw"
              cardHeightExpanded="90vh"
              source={stateApp.user}
              sourceSourceId={stateApp.user.id}
              sourceName={stateApp.user.name}
              sourceLabel="user"
              target={selectedRow}
              targetSourceId={selectedRow.id}
              targetName={selectedRow.wellName}
              targetLabel="well"
            ></ExpandableCardProvider>
          )))}
      <Paper className={classes.paper}>
        {props.header !== null && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            header={props.header}
            addAble={props.addAble}
          />
        )}
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={props.columns}
            />
            <TableBody>
              {stableSort(rows, getSorting(order, orderBy)).map(
                (row, index) => {
                  //const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return [
                    <TableRow
                      hover
                      //onClick={event => handleClick(event, row.id)}
                      role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      // selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        {props.targetLabel !== "contact" && (
                          <IconButton
                            size="medium"
                            color="primary"
                            onClick={event => handleRowClick(event, row)}
                            aria-label="view more"
                          >
                            <VisibilityIcon color="secondary" />
                          </IconButton>
                        )}
                      </TableCell>
                      {props.columns.map((column, i) => {
                        if (props.columns.length - 4 > i) {
                          if (i === 0) {
                            return (
                              <TableCell
                                key={i}
                                className={
                                  props.targetLabel === "contact"
                                    ? classes.cursorPointer
                                    : null
                                }
                                component="th"
                                id={labelId}
                                scope="row"
                                padding="none"
                                onClick={
                                  props.targetLabel === "contact"
                                    ? event => {
                                        event.preventDefault();
                                        setStateApp(stateApp => ({
                                          ...stateApp,
                                          selectedContact: row.id
                                        }));
                                        history.push("/contact");
                                      }
                                    : null
                                }
                              >
                                {column.money
                                  ? formatter.format(row[column.id])
                                  : row[column.id]}
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                key={i}
                                className={
                                  props.targetLabel === "contact"
                                    ? classes.cursorPointer
                                    : null
                                }
                                align="left"
                                onClick={
                                  props.targetLabel === "contact"
                                    ? event => {
                                        event.preventDefault();
                                        setStateApp(stateApp => ({
                                          ...stateApp,
                                          selectedContact: row.id
                                        }));
                                        history.push("/contact");
                                      }
                                    : null
                                }
                              >
                                {column.money
                                  ? formatter.format(row[column.id])
                                  : row[column.id]}
                              </TableCell>
                            );
                          }
                        }
                      })}

                      {props.targetLabel === "well" && (
                        <TableCell align="right">
                          <Badge
                            badgeContent={row.ownerCount}
                            color="secondary"
                          >
                            <IconButton
                              size="medium"
                              color="primary"
                              className={clsx(classes.expand, {
                                [classes.expandOpenOwner]:
                                  expanded && collapsedRow === index
                              })}
                              onClick={() => handleExpandClick(index, "owners")}
                              aria-expanded={expanded && collapsedRow === index}
                              aria-label="show owners"
                            >
                              <PeopleAltIcon />
                            </IconButton>
                          </Badge>
                        </TableCell>
                      )}

                      {props.targetLabel === "owner" && (
                        <TableCell align="center">
                          <IconButton
                            size="medium"
                            color="primary"
                            className={clsx(classes.expand, {
                              [classes.expandOpenOwner]:
                                expandedContact && collapsedRow === index
                            })}
                            onClick={() =>
                              handleExpandClickContact(index, "contacts")
                            }
                            aria-expanded={
                              expandedContact && collapsedRow === index
                            }
                            aria-label="show contacts"
                          >
                            <AccountCircleIcon />
                          </IconButton>
                        </TableCell>
                      )}

                      {props.targetLabel === "contact" && (
                        <TableCell align="right">
                          <IconButton
                            size="medium"
                            color="primary"
                            className={clsx(classes.expand, {
                              [classes.expandOpenOwner]:
                                expandedOwnersContacts && collapsedRow === index
                            })}
                            onClick={() =>
                              handleExpandClickOwnersContacts(
                                index,
                                "ownersContacts"
                              )
                            }
                            aria-expanded={
                              expandedOwnersContacts && collapsedRow === index
                            }
                            aria-label="show owners"
                          >
                            <PeopleAltIcon />
                          </IconButton>
                        </TableCell>
                      )}

                      <TableCell align="center">
                        <IconButton
                          size="medium"
                          color="primary"
                          className={clsx(classes.expand, {
                            [classes.expandOpenComment]:
                              expandedComment && collapsedRow === index
                          })}
                          onClick={() =>
                            handleExpandClickComment(index, "comments")
                          }
                          aria-expanded={
                            expandedComment && collapsedRow === index
                          }
                          aria-label="show comments"
                        >
                          <ChatIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="medium"
                          color="primary"
                          className={clsx(classes.expand, {
                            [classes.expandOpenTag]:
                              expandedTag && collapsedRow === index
                          })}
                          onClick={() => handleExpandClickTag(index, "tags")}
                          aria-expanded={expandedTag && collapsedRow === index}
                          aria-label="show tags"
                        >
                          <LocalOfferIcon />
                        </IconButton>
                      </TableCell>

                      <TableCell align="center">
                        <TrackToggleButton
                          source={stateApp.user}
                          sourceLabel="user"
                          sourceSourceId={stateApp.user.id}
                          sourceName={stateApp.user.name}
                          target={row}
                          targetLabel={props.targetLabel}
                          targetSourceId={row.id}
                          targetName={
                            props.targetLabel === "well"
                              ? row.wellName
                              : row.name
                          }
                          dark
                        />
                      </TableCell>
                    </TableRow>,
                    <TableRow key={index}>
                      <TableCell className={classes.expandedRow} colSpan={9}>
                        <Collapse
                          className={classes.collapseInsideRow}
                          in={
                            (expanded ||
                              expandedTag ||
                              expandedComment ||
                              expandedContact ||
                              expandedOwnersContacts) &&
                            collapsedRow === index
                          }
                          timeout="auto"
                          unmountOnExit
                        >
                          {collapseComponent === "tags" ? (
                            <div className={classes.tagWrapper}>
                              {/*  <Tags public={true}/> */}
                              <Tags
                                public={false}
                                source={stateApp.user}
                                sourceLabel="user"
                                sourceSourceId={stateApp.user.id}
                                sourceName={stateApp.user.name}
                                target={row}
                                targetLabel={props.targetLabel}
                                targetSourceId={row.id}
                                targetName={
                                  props.targetLabel === "well"
                                    ? row.wellName
                                    : row.name
                                }
                              />
                            </div>
                          ) : collapseComponent === "comments" ? (
                            <Comments></Comments>
                          ) : collapseComponent === "owners" ? (
                            <M1nTable
                              selectedWell={row}
                              parent="OwnersPerWell"
                            />
                          ) : collapseComponent === "contacts" ? (
                            <M1nTable parent="Contacts"  externalAddFunction={()=>{}}/>/////////
                          ) : (
                           <p> Developing </p>/////////////////////////
                          )}
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  ];
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        /> */}
      </Paper>
    </div>
  ) : props.loading || !rows ? (
    <CircularProgress size={80} disableShrink color="secondary" />
  ) : (
    <Skeleton variant="rect" height={300}>
      <Typography variant="button">Not Available</Typography>
    </Skeleton>
  );
}
