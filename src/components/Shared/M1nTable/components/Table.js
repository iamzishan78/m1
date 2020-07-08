import React, { useState, useContext, useEffect } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandableCardProvider from "../../../ExpandableCard/ExpandableCardProvider";
import WellCardProvider from "../../../WellCard/WellCardProvider";
import OwnersDetailCard from "../../../OwnersDetailCard/OwnersDetailCard";
import ContactDetailCard from "../../../ContactDetailCard/ContactDetailCard";
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
import ContactPhoneIcon from "@material-ui/icons/ContactPhone";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import AddContactDialogContent from "./SubComponents/AddContactDialogContent";
import AddOwnerToContactDialogContent from "./SubComponents/AddOwnerToContactDialogContent";
import DeleteConfirmationDialogContent from "./SubComponents/DeleteConfirmationDialogContent";
import Button from "@material-ui/core/Button";
import LocalPrintshopRoundedIcon from "@material-ui/icons/LocalPrintshopRounded";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import ContactPhoneRoundedIcon from "@material-ui/icons/ContactPhoneRounded";
import BuyContactsInfoDialogContent from "./SubComponents/BuyContactsInfoDialogContent";
import PrintLabelsDialogContent from "./SubComponents/PrintLabelsDialogContent";
import SendMailersDialogContent from "./SubComponents/SendMailersDialogContent";
import BackupIcon from "@material-ui/icons/Backup";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  icons: {
    backgroundColor: "#efefef",
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "#dadbde !important",
    },
  },
  iconSelected: {
    backgroundColor: `${theme.palette.secondary.main} !important`,
    color: "#011133 !important",
    "& p": {
      color: "#011133 !important",
    },
  },
  TagSample: {
    backgroundColor: "#efefef",
    color: "rgb(1,17,51)",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "180px",
    minWidth: "80px",
    "&:hover": {
      backgroundColor: "#dadbde !important",
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
  dialogExpCard: {
    "& .MuiDialog-paperScrollPaper": {
      height: "100%",
    },
  },
  addIcon: { "& .MuiIconButton-root:hover": { color: "#011133" } },
  cellDataDiv: {
    padding: "10px",
    borderRadius: "7px",
    width: "fit-content",
    cursor: "text",
    "&:hover": {
      backgroundColor: "#fff !important",
    },
  },
  multiSelectionTopBarButtons: {
    margin: "6px 12px",
    fontWeight: "600",
    color: "#082768",
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
  const [rows, setRows] = useState();
  const [columns, setColumns] = useState([]);

  const [colInd, setColInd] = useState();
  const [rowInd, setRowInd] = useState();
  const [expandedObject, setExpandedObject] = useState();
  const [openDialog, setOpenDialog] = useState(false);

  const [showExpandableCard, setShowExpandableCard] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const [subComponent, setSubComponent] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");

  const [m1nSelectedRowsIndexes, setM1nSelectedRowsIndexes] = useState([]);
  const [m1nSelectedRowsIds, setM1nSelectedRowsIds] = useState([]);
  const [m1nSelectedRowsTracks, setM1nSelectedRowsTracks] = useState([]);

  useEffect(() => {
    if (props.rows) {
      setRows([
        ...props.rows.sort((a, b) => {
          return b.isTracked - a.isTracked;
        }),
      ]);
    }
  }, [props.rows]);

  useEffect(() => {
    if (rows && m1nSelectedRowsIndexes) {
      if (rows.length > 0 && m1nSelectedRowsIndexes.length > 0) {
        let selectedRowsTracks = m1nSelectedRowsIndexes.map((ind) => {
          if (rows[ind] && rows[ind].isTracked) return rows[ind].isTracked;
        });
        setM1nSelectedRowsTracks(selectedRowsTracks);
      } else setM1nSelectedRowsTracks([]);
    }
  }, [rows, m1nSelectedRowsIndexes, props.columns]);

  const multiSelectMouseHoverColor = (id, color) => {
    for (let i = 0; i < m1nSelectedRowsIndexes.length; i++) {
      if (
        document.getElementById(
          id + m1nSelectedRowsIds[i] + m1nSelectedRowsIndexes[i]
        )
      )
        document.getElementById(
          id + m1nSelectedRowsIds[i] + m1nSelectedRowsIndexes[i]
        ).style.backgroundColor = color;
    }
  };

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
                  let id = props.targetLabel + tableMeta.columnIndex;
                  return (
                    <TrackToggleButton
                      id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                      target={{ isTracked: value }}
                      targetLabel={props.targetLabel}
                      targetSourceId={tableMeta.rowData[0]}
                      dark
                      multipleIds={
                        m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !==
                          -1 && m1nSelectedRowsIndexes.length > 1
                          ? m1nSelectedRowsIds
                          : null
                      }
                      multipleTracks={
                        m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !==
                          -1 && m1nSelectedRowsIndexes.length > 1
                          ? m1nSelectedRowsTracks
                          : null
                      }
                      multiSelectMouseHoverColor={
                        m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !==
                          -1 && m1nSelectedRowsIndexes.length > 1
                          ? multiSelectMouseHoverColor
                          : null
                      }
                      idBase={id}
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
                  let id = props.targetLabel + tableMeta.columnIndex;

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
                          id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
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
                          onMouseOver={() => {
                            if (
                              m1nSelectedRowsIndexes.indexOf(
                                tableMeta.rowIndex
                              ) !== -1 &&
                              m1nSelectedRowsIndexes.length > 1
                            )
                              multiSelectMouseHoverColor(id, "#dadbde");
                          }}
                          onMouseOut={() => {
                            if (
                              m1nSelectedRowsIndexes.indexOf(
                                tableMeta.rowIndex
                              ) !== -1 &&
                              m1nSelectedRowsIndexes.length > 1
                            )
                              multiSelectMouseHoverColor(id, "#efefef");
                          }}
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
                      title={value.length > 0 ? "Wells" : "Not Available"}
                      placement="top"
                    >
                      <Badge
                        badgeContent={value.length > 0 ? value.length : null}
                        color="secondary"
                      >
                        <IconButton
                          size="medium"
                          color="primary"
                          className={`${classes.icons} ${
                            !value || value.length === 0
                              ? classes.noOwnersIcon
                              : ""
                          } ${
                            colInd === tableMeta.columnIndex &&
                            rowInd === tableMeta.rowIndex
                              ? classes.iconSelected
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (value && value.length > 0) {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                value,
                                "wellsPerOwner"
                              );
                            }
                          }}
                          aria-label="show owners"
                        >
                          <WellIcon
                            color={
                              value && value.length > 0 ? "#000" : "darkgrey"
                            }
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
          case "contactsCounter":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={value || value === 0 ? "Contacts" : "Add Contact"}
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
                              "ownerContacts"
                            );
                          }}
                          aria-label="show contacs"
                        >
                          <ContactPhoneIcon />
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
                                tableMeta.rowData[0],
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

          case "owners": //ownerPerContactCount
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={value.length > 0 ? "Owners" : "Not Available"}
                      placement="top"
                    >
                      <Badge
                        badgeContent={value.length > 0 ? value.length : null}
                        color="secondary"
                      >
                        <IconButton
                          size="medium"
                          color="primary"
                          className={`${classes.icons} ${
                            !value || value.length === 0
                              ? classes.noOwnersIcon
                              : ""
                          }  ${
                            colInd === tableMeta.columnIndex &&
                            rowInd === tableMeta.rowIndex
                              ? classes.iconSelected
                              : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (value.length > 0) {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                value,
                                "ownersPerContacts"
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
                  let id = props.targetLabel + tableMeta.columnIndex;
                  return (
                    <Tooltip
                      title={value && value[1] === 0 ? "Add Tags" : "Tags"}
                      placement="top"
                    >
                      <Badge
                        id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
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
                        onMouseOver={() => {
                          if (
                            m1nSelectedRowsIndexes.indexOf(
                              tableMeta.rowIndex
                            ) !== -1 &&
                            m1nSelectedRowsIndexes.length > 1
                          )
                            multiSelectMouseHoverColor(id, "#dadbde");
                        }}
                        onMouseOut={() => {
                          if (
                            m1nSelectedRowsIndexes.indexOf(
                              tableMeta.rowIndex
                            ) !== -1 &&
                            m1nSelectedRowsIndexes.length > 1
                          )
                            multiSelectMouseHoverColor(id, "#efefef");
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

          case "contactName":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  if (value === "" || value === null || !value) {
                    return value;
                  }

                  return (
                    <div
                      className={classes.cellDataDiv}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {value}{" "}
                      {value === "Jacob Avery" && ( //////temporary to demo only
                        <Tooltip title="Purchased contact info">
                          <MonetizationOnIcon
                            fontSize="small"
                            style={{
                              color: "#082768",
                              verticalAlign: "middle",
                            }}
                          />
                        </Tooltip>
                      )}
                    </div>
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
                  if (value === "" || value === null || !value) {
                    return value;
                  }

                  return (
                    <div
                      className={classes.cellDataDiv}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {column.name === "appraisedValue"
                        ? formatter.format(value)
                        : column.name === "lastUpdateAt"
                        ? anyToDate(value).toLocaleString("en-US", {
                            year: "numeric",
                            day: "numeric",
                            month: "numeric",
                          })
                        : value}
                    </div>
                  );
                },
              };
            }
            break;
        }
      });
      setColumns([...props.columns]);
    }
  }, [
    props.columns,
    props.rows,
    colInd,
    rowInd,
    m1nSelectedRowsIds,
    m1nSelectedRowsIndexes,
    m1nSelectedRowsTracks,
  ]);

  const handleExpandClick = async (cIndex, rIndex, idOrValues, type) => {
    setColInd(cIndex);
    setRowInd(rIndex);
    setExpandedObject(idOrValues);
    setOpenDialog(type);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setColInd(null);
    setRowInd(null);
    setExpandedObject(null);
  };

  const handleOpenExpandableCard = () => {
    setShowExpandableCard(true);
  };
  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
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
    selectableRows: "multiple",
    //// triggers when a row/s is selected ////
    onRowsSelect: (currentRowsSelected, rowsSelected) => {
      if (rowsSelected && rowsSelected.length > 0) {
        let indexArray = rowsSelected.map((d) => d.index).sort((a, b) => a - b);
        if (rows && indexArray) {
          if (rows.length > 0 && indexArray.length > 0) {
            let selectedRows = rows.filter(
              (row, index) => indexArray.indexOf(index) !== -1
            );
            let selectedRowsIds = selectedRows.map((row) => {
              if (row.id) return row.id;
              if (row.Id) return row.Id;
            });

            setM1nSelectedRowsIds(selectedRowsIds);
          } else setM1nSelectedRowsIds([]);
        }
        setM1nSelectedRowsIndexes(indexArray);
      } else {
        setM1nSelectedRowsIndexes([]);
        setM1nSelectedRowsIds([]);
      }
    },
    onRowsDelete: (rowsDeleted) => {
      handleExpandClick(null, null, null, "deleteOwnersFromContact");
      return false;
    },
    rowsSelected: m1nSelectedRowsIndexes,
    //// allows you to customize the top bar of selected items ////
    customToolbarSelect:
      props.header === "Interest Owners Tied to Contact"
        ? false
        : (selectedRows, displayData, setSelectedRow) => {
            //// if contacts set the multi selection top bar: ////
            if (
              props.header === "Owner's Contacts" ||
              props.header === "Contacts"
            ) {
              const getSelectedRows = () => {
                const selectedRows = [];
                for (let i = 0; i < m1nSelectedRowsIndexes.length; i++) {
                  selectedRows.push(rows[m1nSelectedRowsIndexes[i]]);
                }
                return selectedRows;
              };

              return (
                <div
                  style={{
                    height: "48px",
                  }}
                >
                  <Button
                    color="secondary"
                    startIcon={<ContactPhoneRoundedIcon />}
                    className={classes.multiSelectionTopBarButtons}
                    onClick={() => {
                      handleExpandClick(
                        null,
                        null,
                        getSelectedRows(),
                        "buyContactsInfo"
                      );
                    }}
                  >
                    Buy Info
                  </Button>
                  <Button
                    color="secondary"
                    startIcon={<EmailRoundedIcon />}
                    className={classes.multiSelectionTopBarButtons}
                    onClick={() => {
                      handleExpandClick(
                        null,
                        null,
                        getSelectedRows(),
                        "sendMailers"
                      );
                    }}
                  >
                    Mailers
                  </Button>
                  <Button
                    color="secondary"
                    startIcon={<LocalPrintshopRoundedIcon />}
                    className={classes.multiSelectionTopBarButtons}
                    onClick={() => {
                      handleExpandClick(
                        null,
                        null,
                        getSelectedRows(),
                        "printLabels"
                      );
                    }}
                  >
                    Labels
                  </Button>
                </div>
              );
            }

            //// default empty top bar ////
            return (
              <div
                style={{
                  height: "48px",
                }}
              />
            );
          },

    customToolbar: () => {
      return (
        <>
          {props.uploadIcon && (
            //////Upload Icon/////////////////////////
            <span className={classes.addIcon}>
              <Tooltip
                title={`Upload ${
                  props.targetLabel.charAt(0).toUpperCase() +
                  props.targetLabel.slice(1)
                }s`}
              >
                <IconButton size="medium" onClick={(e) => {}}>
                  <BackupIcon />
                </IconButton>
              </Tooltip>
            </span>
          )}
          {props.addAble && (
            //////Add Icon/////////////////////////
            <span className={classes.addIcon}>
              <Tooltip
                title={`Add${
                  props.targetLabel
                    ? " " +
                      props.targetLabel.charAt(0).toUpperCase() +
                      props.targetLabel.slice(1)
                    : ""
                }`}
              >
                <IconButton
                  size="medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      props.addAble.type &&
                      (props.addAble.type === "contact" ||
                        props.addAble.type === "contactToOwner")
                    )
                      handleExpandClick(null, null, null, "addContact");
                    if (
                      props.addAble.type &&
                      props.addAble.type === "ownerToContact"
                    )
                      handleExpandClick(null, null, null, "addOwnerToContact");
                  }}
                >
                  <AddCircleOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
            </span>
          )}
        </>
      );
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setSelectedRow(rows[dataIndex]);

      if (props.targetLabel === "owner") {
        setStateApp((state) => ({ ...state, selectedOwner: rows[dataIndex] }));
        setSubComponent(
          <OwnersDetailCard
            ownerId={rows[dataIndex].id}
            wellsIdsArray={rows[dataIndex].wellsCounter}
          />
        );
        setTitle(rows[dataIndex].name);
        setSubTitle(rows[dataIndex].interestType);
        handleOpenExpandableCard();
      }

      if (props.targetLabel === "well") {
        setStateApp((state) => ({ ...state, selectedWellId: rowData[0] }));
        setStateApp((state) => ({ ...state, selectedWell: rows[dataIndex] }));
        setSubComponent(<WellCardProvider />);
        setTitle(rows[dataIndex].wellName);
        setSubTitle(rows[dataIndex].operator);
        handleOpenExpandableCard();
      }

      if (props.targetLabel === "contact") {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedContact: rows[dataIndex].id,
        }));

        setSubComponent(
          <ContactDetailCard
            contactId={rows[dataIndex]._id}
            handleCloseExpandableCard={handleCloseExpandableCard}
          />
        );
        setTitle("Contact");
        setSubTitle(" ");
        handleOpenExpandableCard();
      }
    },
  };

  return (rows && rows.length > 0 && !props.addAble) ||
    (rows && props.addAble) ? (
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
            openDialog === "wellsPerOwner" ||
            openDialog === "ownerContacts" ||
            openDialog === "ownersPerContacts" ||
            openDialog === "buyContactsInfo" ||
            openDialog === "sendMailers" ||
            openDialog === "printLabels"
              ? true
              : false
          }
          maxWidth={
            openDialog === "ownerContacts"
              ? "xl"
              : openDialog === "owner" ||
                openDialog === "ownersPerContacts" ||
                openDialog === "wellsPerOwner"
              ? "lg"
              : openDialog === "addContact" ||
                openDialog === "addOwnerToContact"
              ? "xs"
              : "sm"
          }
        >
          {openDialog === "comment" && (
            <Comments
              focus
              targetSourceId={expandedObject}
              targetLabel={props.targetLabel}
              multipleIds={
                m1nSelectedRowsIndexes.indexOf(rowInd) !== -1 &&
                m1nSelectedRowsIndexes.length > 1
                  ? m1nSelectedRowsIds
                  : null
              }
            />
          )}
          {openDialog === "tag" && (
            <div className={classes.tagsDiv}>
              <Tags
                targetSourceId={expandedObject}
                targetLabel={props.targetLabel}
                multipleIds={
                  m1nSelectedRowsIndexes.indexOf(rowInd) !== -1 &&
                  m1nSelectedRowsIndexes.length > 1
                    ? m1nSelectedRowsIds
                    : null
                }
              />
            </div>
          )}
          {openDialog === "owner" && (
            <M1nTable
              selectedWell={{ id: expandedObject }}
              parent="OwnersPerWell"
            />
          )}
          {openDialog === "wellsPerOwner" && (
            <M1nTable wellsIdsArray={expandedObject} parent="WellsPerOwner" />
          )}
          {openDialog === "ownerContacts" && (
            <M1nTable parent="ownerContacts" ownerId={expandedObject} />
          )}
          {openDialog === "ownersPerContacts" && (
            <M1nTable
              parent="ownersPerContacts"
              ownersIdsArray={expandedObject}
              contactId={rows[rowInd]._id}
            />
          )}

          {openDialog === "addContact" && props.targetLabel === "contact" && (
            <AddContactDialogContent
              onClose={handleCloseDialog}
              parent={props.addAble.parent}
            />
          )}
          {openDialog === "addOwnerToContact" && (
            <AddOwnerToContactDialogContent
              onClose={handleCloseDialog}
              parent={props.addAble.parent}
              existingOwners={props.addAble.existingOwners}
            />
          )}
          {openDialog === "deleteOwnersFromContact" && (
            <DeleteConfirmationDialogContent
              onClose={handleCloseDialog}
              deleteFunc={props.deleteFunc}
              m1nSelectedRowsIds={m1nSelectedRowsIds}
              setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
            >
              {`Do you want to permanently delete the owner${
                expandedObject && expandedObject.length > 1 ? "s" : ""
              } from  this contact?`}
            </DeleteConfirmationDialogContent>
          )}
          {openDialog === "buyContactsInfo" && (
            <BuyContactsInfoDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          )}
          {openDialog === "sendMailers" && (
            <SendMailersDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          )}
          {openDialog === "printLabels" && (
            <PrintLabelsDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          )}
        </Dialog>
      )}

      {showExpandableCard && (
        <Dialog
          className={classes.dialogExpCard}
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
            targetSourceId={
              props.targetLabel === "owner" || props.targetLabel === "well"
                ? selectedRow.id
                : selectedRow._id
            }
            targetLabel={props.targetLabel}
            noTrackAvailable={title === "Contact" ? true : false}
          />
        </Dialog>
      )}
    </div>
  ) : props.loading || !rows ? (
    <div style={{ padding: "15px" }}>
      <CircularProgress size={80} disableShrink color="secondary" />
    </div>
  ) : (
    <Skeleton variant="rect" height={300}>
      <Typography variant="button">Not Available</Typography>
    </Skeleton>
  );
}
