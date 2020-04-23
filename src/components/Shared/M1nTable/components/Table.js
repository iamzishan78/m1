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
import WellIcon from "../../svgIcons/well";
import { useHistory } from "react-router-dom";

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
    color: "#011133 !important",
    "& p": {
      color: "#011133 !important",
    },
  },
  TagSample: {
    color: "rgb(1,17,51)",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "180px",
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
  table: {
    "& .MuiTableRow-root": {
      cursor: "zoom-in",
    },
    "& .MuiTableRow-head": {
      cursor: "default",
    },
    "& .MuiTableRow-footer": {
      cursor: "default",
    },
  },
}));

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 21,
});

export default function SubTable(props) {
  let history = useHistory();
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, setRows] = useState();
  const [columns, setColumns] = useState([]);

  const [colInd, setColInd] = useState();
  const [rowInd, setRowInd] = useState();
  const [expandedObjectId, setExpandedObjectId] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [subComponent, setSubComponent] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  useEffect(() => {
    if (props.rows) {
      setRows([
        ...props.rows.sort((a, b) => {
          return b.isTracked - a.isTracked;
        }),
      ]);
    }
  }, [props.rows]);

  ////setting all icons columns/////
  useEffect(() => {
    if (props.columns) {
      props.columns.forEach((column) => {
        switch (column.name) {
          case "isTracked":
            {
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

            break;
          case "commentsCounter":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={
                        !value || value === 0 ? "Add Comments" : "Comments"
                      }
                      placement="top"
                    >
                      <Badge
                        badgeContent={value ? value : null}
                        color="secondary"
                      >
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
                          onClick={(e) => {
                            e.stopPropagation();
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
            break;
          case "wellsCounter":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={value ? "Wells" : "Not Available"}
                      placement="top"
                    >
                      <Badge
                        badgeContent={value ? value : null}
                        color="secondary"
                      >
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
                          onClick={(e) => {
                            e.stopPropagation();
                            if (value && value > 0) {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                tableMeta.rowData[1],
                                "well"
                              );
                            }
                          }}
                          aria-label="show owners"
                        >
                          <WellIcon
                            color={value && value !== 0 ? "#000" : "darkgrey"}
                            opacity="1.0"
                            small
                          />
                        </IconButton>
                      </Badge>
                    </Tooltip>
                  );
                },
              };
            }
            break;
          case "ownerCount":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={value ? "Owners" : "Not Available"}
                      placement="top"
                    >
                      <Badge
                        badgeContent={value ? value : null}
                        color="secondary"
                      >
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
                          onClick={(e) => {
                            e.stopPropagation();
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
            break;
          case "tags":
            {
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
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
            break;
          default:
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return column.name === "appraisedValue"
                    ? formatter.format(value)
                    : value;
                },
              };
            }
            break;
        }

        // if (column.name === "isTracked") {
        //   column.options = {
        //     ...column.options,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (
        //         <TrackToggleButton
        //           target={{ isTracked: value }}
        //           targetLabel={props.targetLabel}
        //           targetSourceId={tableMeta.rowData[0]}
        //           dark
        //         />
        //       );
        //     },
        //   };
        // }

        // if (column.name === "commentsCounter") {
        //   column.options = {
        //     ...column.options,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (
        //         <Tooltip
        //           title={!value || value === 0 ? "Add Comments" : "Comments"}
        //           placement="top"
        //         >
        //           <Badge badgeContent={value ? value : null} color="secondary">
        //             <IconButton
        //               size="medium"
        //               color="primary"
        //               className={`${classes.icons} ${
        //                 !value || value === 0 ? classes.noCommentsIcon : ""
        //               } ${
        //                 colInd === tableMeta.columnIndex &&
        //                 rowInd === tableMeta.rowIndex
        //                   ? classes.iconSelected
        //                   : ""
        //               }`}
        //               onClick={() => {
        //                 handleExpandClick(
        //                   tableMeta.columnIndex,
        //                   tableMeta.rowIndex,
        //                   tableMeta.rowData[0],
        //                   "comment"
        //                 );
        //               }}
        //               aria-label="show comments"
        //             >
        //               <ChatIcon />
        //             </IconButton>
        //           </Badge>
        //         </Tooltip>
        //       );
        //     },
        //   };
        // }

        // if (column.name === "wellsCounter") {
        //   column.options = {
        //     ...column.options,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (
        //         <Tooltip
        //           title={value ? "Wells" : "Not Available"}
        //           placement="top"
        //         >
        //           <Badge badgeContent={value ? value : null} color="secondary">
        //             <IconButton
        //               size="medium"
        //               color="primary"
        //               className={`${classes.icons} ${
        //                 !value ? classes.noOwnersIcon : ""
        //               } ${
        //                 colInd === tableMeta.columnIndex &&
        //                 rowInd === tableMeta.rowIndex
        //                   ? classes.iconSelected
        //                   : ""
        //               }`}
        //               onClick={() => {
        //                 if (value && value > 0) {
        //                   handleExpandClick(
        //                     tableMeta.columnIndex,
        //                     tableMeta.rowIndex,
        //                     tableMeta.rowData[1],
        //                     "well"
        //                   );
        //                 }
        //               }}
        //               aria-label="show owners"
        //             >
        //               <WellIcon
        //                 color={value && value !== 0 ? "#000" : "darkgrey"}
        //                 opacity="1.0"
        //                 small
        //               />
        //             </IconButton>
        //           </Badge>
        //         </Tooltip>
        //       );
        //     },
        //   };
        // }

        // if (column.name === "ownerCount") {
        //   column.options = {
        //     ...column.options,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (
        //         <Tooltip
        //           title={value ? "Owners" : "Not Available"}
        //           placement="top"
        //         >
        //           <Badge badgeContent={value ? value : null} color="secondary">
        //             <IconButton
        //               size="medium"
        //               color="primary"
        //               className={`${classes.icons} ${
        //                 !value ? classes.noOwnersIcon : ""
        //               } ${
        //                 colInd === tableMeta.columnIndex &&
        //                 rowInd === tableMeta.rowIndex
        //                   ? classes.iconSelected
        //                   : ""
        //               }`}
        //               onClick={() => {
        //                 if (value && value > 0) {
        //                   handleExpandClick(
        //                     tableMeta.columnIndex,
        //                     tableMeta.rowIndex,
        //                     tableMeta.rowData[1],
        //                     "owner"
        //                   );
        //                 }
        //               }}
        //               aria-label="show owners"
        //             >
        //               <PeopleAltIcon />
        //             </IconButton>
        //           </Badge>
        //         </Tooltip>
        //       );
        //     },
        //   };
        // }

        // if (column.name === "tags") {
        //   column.options = {
        //     ...column.options,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return (
        //         <Tooltip
        //           title={value[1] === 0 ? "Add Tags" : "Tags"}
        //           placement="top"
        //         >
        //           <Badge
        //             className={`${classes.TagSample} ${
        //               colInd === tableMeta.columnIndex &&
        //               rowInd === tableMeta.rowIndex
        //                 ? classes.iconSelected
        //                 : ""
        //             }`}
        //             badgeContent={value[1]}
        //             color="secondary"
        //             onClick={() => {
        //               handleExpandClick(
        //                 tableMeta.columnIndex,
        //                 tableMeta.rowIndex,
        //                 tableMeta.rowData[0],
        //                 "tag"
        //               );
        //             }}
        //           >
        //             {value[0] && value[0].length > 0 ? (
        //               <React.Fragment>
        //                 <p className="first">{value[0].join(", ")}</p>
        //                 <p className="two">...</p>
        //               </React.Fragment>
        //             ) : (
        //               <p className="three">No Tags</p>
        //             )}
        //           </Badge>
        //         </Tooltip>
        //       );
        //     },
        //   };
        // }

        // if (column.name === "appraisedValue") {
        //   column.options = {
        //     ...column.options,
        //     customBodyRender: (value, tableMeta, updateValue) => {
        //       return formatter.format(value);
        //     },
        //   };
        // }
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

    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setSelectedRow(rows[dataIndex]);

      if (props.targetLabel === "owner") {
        setSubComponent(<Test hello="Owner Card Not Available" />);
        setTitle(rows[dataIndex].name);
        setSubTitle(rows[dataIndex].interestType);
        handleOpenExpandableCard();
      }

      if (props.targetLabel === "well") {
        setStateApp((state) => ({ ...state, selectedWellId: rowData[0] }));
        setStateApp((state) => ({ ...state, selectedWell: rows[dataIndex] }));
        setSubComponent(<WellCardProvider></WellCardProvider>);
        setTitle(rows[dataIndex].wellName);
        setSubTitle(rows[dataIndex].operator);
        handleOpenExpandableCard();
      }

      if (props.targetLabel === "contact") {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedContact: rows[dataIndex].id,
        }));
        history.push("/contact");
      }
    },
  };

  return rows && rows.length > 0 ? (
    <div className={classes.root}>
      <MUIDataTable
        className={classes.table}
        title={props.header}
        data={rows}
        columns={columns}
        options={options}
      />

      {openDialog && (
        <Dialog
          className={classes.dialog}
          open={openDialog ? true : false}
          onClose={handleCloseDialog}
          fullWidth={
            openDialog === "comment" ||
            openDialog === "owner" ||
            openDialog === "well"
              ? true
              : false
          }
          maxWidth={
            openDialog === "owner" ||
            openDialog === "ownerContacts" ||
            openDialog === "well"
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

      {showExpandableCard && (
        <Dialog
          fullWidth
          maxWidth="xl"
          open={showExpandableCard}
          onClose={handleCloseExpandableCard}
        >
          <ExpandableCardProvider
            expanded={true}
            handleCloseExpandableCard={handleCloseExpandableCard}
            component={subComponent}
            title={title}
            subTitle={subTitle}
            parent="table"
            mouseX={0}
            mouseY={0}
            position="relative"
            cardLeft={"0"}
            cardTop={"0"}
            zIndex={1201}
            cardWidthExpanded="100%"
            cardHeightExpanded="100%"
            targetSourceId={selectedRow.id}
            targetLabel={props.targetLabel}
          />
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
