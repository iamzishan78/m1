import React, { useState, useContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandableCardProvider from "../../../ExpandableCard/ExpandableCardProvider";
import Test from "../../../ExpandableCard/Test";
import WellCardProvider from "../../../WellCard/WellCardProvider";
import { AppContext } from "../../../../AppContext";
import Tags from "../../Tagger";
import Comments from "../../Comments";
import Dialog from "@material-ui/core/Dialog";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { IconButton, Typography } from "@material-ui/core";
import TrackToggleButton from "../../TrackToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import ChatIcon from "@material-ui/icons/Chat";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import M1nTable from "../M1nTable";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  icons: {
    backgroundColor: "#efefef",
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "#dadbde",
    },
  },
  iconSelected: {
    backgroundColor: theme.palette.secondary.main,
  },
  TagSample: {
    color: "rgb(1,17,51)",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "180px",
    // backgroundColor: "#EFEFEF",
    minWidth: "80px",
    "&:hover": {
      backgroundColor: "#DADBDE",
      cursor: "pointer",
    },
    "& .first": {
      marginLeft: "13px",
      height: "20px",
      overflow: "hidden",
      wordBreak: "break-all",
    },
    "& .two": {
      marginRight: "13px",
    },
    "& .three": {
      marginLeft: "13px",
      marginRight: "13px",
      color: "darkgrey",
    },
  },
  tagsDiv: {
    margin: "8px",
  },
  noOwnersIcon: {
    color: "darkgrey",
    "&:hover": {
      cursor: "auto",
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
  },
  noCommentsIcon: {
    color: "darkgrey",
  },
}));

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 21,
});

export default function SubTable(props) {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  const [colInd, setColInd] = useState();
  const [rowInd, setRowInd] = useState();
  const [expandedObjectId, setExpandedObjectId] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    if (props.rows) {
      setRows([...props.rows]);
    }
  }, [props.rows]);

  ////setting all icons columns/////
  useEffect(() => {
    if (props.columns) {
      props.columns.forEach((column) => {
        if (column.name === "isTracked") {
          column.options = {
            ...column.options,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <TrackToggleButton
                  target={{ isTracked: value }}
                  targetLabel={props.targetLabel}
                  targetSourceId={tableMeta.rowData[0]}
                  dark
                />
              );
            },
          };
        }

        if (column.name === "commentsCounter") {
          column.options = {
            ...column.options,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <Tooltip
                  title={!value || value === 0 ? "Add Comments" : "Comments"}
                  placement="top"
                >
                  <Badge badgeContent={value ? value : null} color="secondary">
                    <IconButton
                      size="medium"
                      color="primary"
                      className={`${classes.icons} ${
                        !value || value === 0 ? classes.noCommentsIcon : ""
                      } ${
                        colInd === tableMeta.columnIndex &&
                        rowInd === tableMeta.rowIndex
                          ? classes.iconSelected
                          : ""
                      }`}
                      onClick={() => {
                        handleExpandClick(
                          tableMeta.columnIndex,
                          tableMeta.rowIndex,
                          tableMeta.rowData[0],
                          "comment"
                        );
                      }}
                      aria-label="show comments"
                    >
                      <ChatIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
              );
            },
          };
        }

        if (column.name === "ownerCount") {
          column.options = {
            ...column.options,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <Tooltip
                  title={value ? "Owners" : "Not Available"}
                  placement="top"
                >
                  <Badge badgeContent={value ? value : null} color="secondary">
                    <IconButton
                      size="medium"
                      color="primary"
                      className={`${classes.icons} ${
                        !value ? classes.noOwnersIcon : ""
                      } ${
                        colInd === tableMeta.columnIndex &&
                        rowInd === tableMeta.rowIndex
                          ? classes.iconSelected
                          : ""
                      }`}
                      onClick={() => {
                        if (value && value > 0) {
                          handleExpandClick(
                            tableMeta.columnIndex,
                            tableMeta.rowIndex,
                            tableMeta.rowData[1],
                            "owner"
                          );
                        }
                      }}
                      aria-label="show owners"
                    >
                      <PeopleAltIcon />
                    </IconButton>
                  </Badge>
                </Tooltip>
              );
            },
          };
        }

        if (column.name === "tags") {
          column.options = {
            ...column.options,
            customBodyRender: (value, tableMeta, updateValue) => {
              return (
                <Tooltip
                  title={value[1] === 0 ? "Add Tags" : "Tags"}
                  placement="top"
                >
                  <Badge
                    className={`${classes.TagSample} ${
                      colInd === tableMeta.columnIndex &&
                      rowInd === tableMeta.rowIndex
                        ? classes.iconSelected
                        : ""
                    }`}
                    badgeContent={value[1]}
                    color="secondary"
                    onClick={() => {
                      handleExpandClick(
                        tableMeta.columnIndex,
                        tableMeta.rowIndex,
                        tableMeta.rowData[0],
                        "tag"
                      );
                    }}
                  >
                    {value[0] && value[0].length > 0 ? (
                      <React.Fragment>
                        <p className="first">{value[0].join(", ")}</p>
                        <p className="two">...</p>
                      </React.Fragment>
                    ) : (
                      <p className="three">No Tags</p>
                    )}
                  </Badge>
                </Tooltip>
              );
            },
          };
        }

        if (column.name === "appraisedValue") {
          column.options = {
            ...column.options,
            customBodyRender: (value, tableMeta, updateValue) => {
              return formatter.format(value);
            },
          };
        }
      });
      setColumns([...props.columns]);
    }
  }, [props.columns, props.rows, colInd, rowInd]);

  const handleExpandClick = async (cIndex, rIndex, id, type) => {
    setColInd(cIndex);
    setRowInd(rIndex);
    setExpandedObjectId(id);
    setOpenDialog(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setColInd(null);
    setRowInd(null);
    setExpandedObjectId(null);
  };

  const handleRowClick = (e, row) => {
    console.log(e);
    console.log(e.nativeEvent);
    setMouseX(e.nativeEvent.clientX);
    setMouseY(e.nativeEvent.clientY - 70);
    setSelectedRow(row);
    if (props.targetLabel === "well")
      setStateApp((state) => ({ ...state, selectedWell: row }));
    handleOpenExpandableCard();
  };
  const handleOpenExpandableCard = () => {
    setShowExpandableCard(true);
  };
  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
  };

  const AddIconClickHandeler = (e) => {
    if (props.addAble.externalAdd) {
      props.addAble.externalAddFunction(e);
    }

    // props.addAble.externalAdd
    //   ?props.addAble.externalAdd
    //   : ; //add here your "add funtion" to add inside the table
  };
  const options = {
    filterType: "multiselect",
    rowsPerPageOptions:
      props.rows && props.rows.length > 100
        ? [10, 25, 100, 1000]
        : props.rows && props.rows.length > 25
        ? [10, 25, 100]
        : props.rows && props.rows.length > 10
        ? [10, 25]
        : [],

    selectableRows: "none",
  };

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

      <MUIDataTable
        title={props.header}
        data={rows}
        columns={columns}
        options={options}
      />

      {openDialog && (
        <Dialog
          className={classes.dialog}
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth={
            openDialog === "comment" || openDialog === "owner" ? true : false
          }
          maxWidth={
            openDialog === "owner" || openDialog === "ownerContacts"
              ? "md"
              : "sm"
          }
        >
          {openDialog === "comment" && (
            <Comments focus targetSourceId={expandedObjectId} />
          )}
          {openDialog === "tag" && (
            <div className={classes.tagsDiv}>
              <Tags targetSourceId={expandedObjectId} />
            </div>
          )}
          {openDialog === "owner" && (
            <M1nTable
              selectedWell={{ api: expandedObjectId }}
              parent="OwnersPerWell"
            />
          )}

          {openDialog === "ownerContacts" && (
            <M1nTable parent="Contacts" externalAddFunction={() => {}} />
          )}
        </Dialog>
      )}
    </div>
  ) : props.loading || !rows ? (
    <CircularProgress size={80} disableShrink color="secondary" />
  ) : (
    <Skeleton variant="rect" height={300}>
      <Typography variant="button">Not Available</Typography>
    </Skeleton>
  );
}
