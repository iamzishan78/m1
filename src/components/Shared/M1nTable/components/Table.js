import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
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
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import CellContentEdition from "./SubComponents/CellContentEdition";
import Avatar, { ConfigProvider } from "react-avatar";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import MapLocation from "../../svgIcons/MapLocation";
import RoomIcon from "@material-ui/icons/Room";
import { useDispatch, useSelector } from "react-redux";
import { setMapGridCardState } from "../../../../actions";
import {
  deepEqualObjects,
  deepEqual,
  setStateIfDeepEqual,
} from "../../functions";
import AddParcelOwnerDialogContent from "./SubComponents/AddParcelOwnerDialogContent";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    "& .MuiTableCell-body": {
      padding: (props) => (props.dense ? "0 !important" : "12px 16px"),
    },
    "& .MuiTableHead-root": {
      "& th": {
        backgroundColor: "#F2F2F2",
        zIndex: "auto",
        padding: (props) => (props.dense ? "10px" : null),
      },
      "& .MuiTableCell-paddingCheckbox": {
        padding: (props) => (props.dense ? "0 !important" : "16px"),
      },
    },
    "& tr": {
      paddingRight: (props) => (props.dense ? "12px" : null),
    },
    "& thead": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      WebkitTransition: "opacity 1s ease-out",
    },
    "& tbody": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      WebkitTransition: "opacity 1s ease-out",
    },
  },
  loadingTable: {
    "& thead": { opacity: "0" },
    "& tbody": { opacity: "0" },
  },
  emptyTable: {
    "& thead": { opacity: "0" },
  },
  icons: {
    backgroundColor: (props) => (props.dense ? "transparent" : "#efefef"),
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
    "& p": {
      marginTop: (props) => (props.dense ? "5px" : "13px"),
      marginBottom: (props) => (props.dense ? "5px" : "13px"),
    },
    "& .first": {
      marginLeft: (props) => (props.dense ? "5px" : "13px"),
      height: "20px",
      overflow: "hidden",
      wordBreak: "break-all",
    },
    "& .two": {
      marginRight: (props) => (props.dense ? "5px" : "13px"),
    },
    "& .three": {
      marginLeft: (props) => (props.dense ? "5px" : "13px"),
      marginRight: (props) => (props.dense ? "5px" : "13px"),
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
    position: "relative",
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

function SubTable(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();

  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, Rows] = useState([]);
  const setRows = (newState) => {
    setStateIfDeepEqual(Rows, newState);
  };
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  const [colInd, ColInd] = useState();
  const setColInd = (newState) => {
    setStateIfDeepEqual(ColInd, newState);
  };
  const [rowInd, RowInd] = useState();
  const setRowInd = (newState) => {
    setStateIfDeepEqual(RowInd, newState);
  };
  const [expandedObject, ExpandedObject] = useState();
  const setExpandedObject = (newState) => {
    setStateIfDeepEqual(ExpandedObject, newState);
  };
  const [openDialog, OpenDialog] = useState(false);
  const setOpenDialog = (newState) => {
    setStateIfDeepEqual(OpenDialog, newState);
  };

  const [showExpandableCard, ShowExpandableCard] = useState(false);
  const setShowExpandableCard = (newState) => {
    setStateIfDeepEqual(ShowExpandableCard, newState);
  };

  const [selectedRow, SelectedRow] = useState();
  const setSelectedRow = (newState) => {
    setStateIfDeepEqual(SelectedRow, newState);
  };

  const [subComponent, SubComponent] = useState(null);
  const setSubComponent = (newState) => {
    setStateIfDeepEqual(SubComponent, newState);
  };
  const [title, Title] = useState("");
  const setTitle = (newState) => {
    setStateIfDeepEqual(Title, newState);
  };
  const [subTitle, SubTitle] = useState("");
  const setSubTitle = (newState) => {
    setStateIfDeepEqual(SubTitle, newState);
  };

  const m1nSelectedRowsIndexesRef = useRef([]);
  const setM1nSelectedRowsIndexes = (state) => {
    if (!deepEqual(m1nSelectedRowsIndexesRef.current, state)) {
      m1nSelectedRowsIndexesRef.current = state;
    }
  };
  const m1nSelectedRowsIdsRef = useRef([]);
  const setM1nSelectedRowsIds = (state) => {
    if (!deepEqual(m1nSelectedRowsIdsRef.current, state)) {
      m1nSelectedRowsIdsRef.current = state;
    }
  };
  const [m1nSelectedRowsTracks, M1nSelectedRowsTracks] = useState([]);
  const setM1nSelectedRowsTracks = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsTracks, newState);
  };

  useEffect(() => {
    if (props.rows) {
      if (props.orderByTracks)
        setRows([
          ...props.rows.sort((a, b) => {
            return b.isTracked - a.isTracked;
          }),
        ]);
      else setRows([...props.rows]);
    }
  }, [props.rows, props.orderByTracks]);

  useEffect(() => {
    if (rows && m1nSelectedRowsIndexesRef.current) {
      if (rows.length > 0 && m1nSelectedRowsIndexesRef.current.length > 0) {
        let selectedRowsTracks = m1nSelectedRowsIndexesRef.current.map(
          (ind) => {
            if (rows[ind] && rows[ind].isTracked) return rows[ind].isTracked;
          }
        );
        setM1nSelectedRowsTracks(selectedRowsTracks);
      } else setM1nSelectedRowsTracks([]);
    }
  }, [rows, props.columns]);

  const multiSelectMouseHoverColor = (id, color) => {
    for (let i = 0; i < m1nSelectedRowsIndexesRef.current.length; i++) {
      if (
        document.getElementById(
          id +
            m1nSelectedRowsIdsRef.current[i] +
            m1nSelectedRowsIndexesRef.current[i]
        )
      )
        document.getElementById(
          id +
            m1nSelectedRowsIdsRef.current[i] +
            m1nSelectedRowsIndexesRef.current[i]
        ).style.backgroundColor = color;
    }
  };

  ////setting all icons columns/////
  useEffect(() => {
    if (props.columns) {
      props.columns.forEach((column) => {
        switch (column.name) {
          case "coordinates": //// fly to the map icon
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let id = props.targetLabel + tableMeta.columnIndex;

                  return (
                    <Tooltip
                      title={
                        !value || value.length < 2
                          ? "Not Available"
                          : "Fly To Map"
                      }
                      placement="top"
                      style={{ marginRight: "10px" }}
                    >
                      <IconButton
                        id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons} ${
                          !value || value.length < 2
                            ? classes.noCommentsIcon
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (value && value.length === 2) {
                            setStateApp((state) => ({
                              ...state,
                              popupOpen: false,
                              selectedWell: null,
                              selectedWellId: tableMeta.rowData[0],
                              flyTo: {
                                longitude: value[0],
                                latitude: value[1],
                              },
                            }));

                            dispatch(
                              setMapGridCardState({
                                mapGridCardActivated: "min",
                              })
                            );
                          }
                        }}
                        aria-label="fly"
                      >
                        <RoomIcon />
                      </IconButton>
                    </Tooltip>
                  );
                },
              };
            }
            break;

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
                        m1nSelectedRowsIndexesRef.current.indexOf(
                          tableMeta.rowIndex
                        ) !== -1 && m1nSelectedRowsIndexesRef.current.length > 1
                          ? m1nSelectedRowsIdsRef.current
                          : null
                      }
                      multipleTracks={
                        m1nSelectedRowsIndexesRef.current.indexOf(
                          tableMeta.rowIndex
                        ) !== -1 && m1nSelectedRowsIndexesRef.current.length > 1
                          ? m1nSelectedRowsTracks
                          : null
                      }
                      multiSelectMouseHoverColor={
                        m1nSelectedRowsIndexesRef.current.indexOf(
                          tableMeta.rowIndex
                        ) !== -1 && m1nSelectedRowsIndexesRef.current.length > 1
                          ? multiSelectMouseHoverColor
                          : null
                      }
                      idBase={id}
                      iconZiseSmall={props.dense ? true : undefined}
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
                      style={{ marginRight: "10px" }}
                    >
                      <Badge
                        badgeContent={value ? value : null}
                        color="secondary"
                      >
                        <IconButton
                          id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                          size={props.dense ? "small" : "medium"}
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
                              m1nSelectedRowsIndexesRef.current.indexOf(
                                tableMeta.rowIndex
                              ) !== -1 &&
                              m1nSelectedRowsIndexesRef.current.length > 1
                            )
                              multiSelectMouseHoverColor(id, "#dadbde");
                          }}
                          onMouseOut={() => {
                            if (
                              m1nSelectedRowsIndexesRef.current.indexOf(
                                tableMeta.rowIndex
                              ) !== -1 &&
                              m1nSelectedRowsIndexesRef.current.length > 1
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
                      style={{ marginRight: "10px" }}
                    >
                      <Badge
                        badgeContent={value.length > 0 ? value.length : null}
                        color="secondary"
                      >
                        <IconButton
                          size={props.dense ? "small" : "medium"}
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
                      style={{ marginRight: "10px" }}
                    >
                      <Badge
                        badgeContent={value ? value : null}
                        color="secondary"
                      >
                        <IconButton
                          size={props.dense ? "small" : "medium"}
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
                      style={{ marginRight: "10px" }}
                    >
                      <Badge
                        badgeContent={value ? value : null}
                        color="secondary"
                      >
                        <IconButton
                          size={props.dense ? "small" : "medium"}
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
                      style={{ marginRight: "10px" }}
                    >
                      <Badge
                        badgeContent={value.length > 0 ? value.length : null}
                        color="secondary"
                      >
                        <IconButton
                          size={props.dense ? "small" : "medium"}
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
                    <div style={{ marginRight: "10px" }}>
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
                              m1nSelectedRowsIndexesRef.current.indexOf(
                                tableMeta.rowIndex
                              ) !== -1 &&
                              m1nSelectedRowsIndexesRef.current.length > 1
                            )
                              multiSelectMouseHoverColor(id, "#dadbde");
                          }}
                          onMouseOut={() => {
                            if (
                              m1nSelectedRowsIndexesRef.current.indexOf(
                                tableMeta.rowIndex
                              ) !== -1 &&
                              m1nSelectedRowsIndexesRef.current.length > 1
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
                    </div>
                  );
                },
              };
            }
            break;

          case "fullContactAddress":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <CellContentEdition
                      id={tableMeta.rowData[0]}
                      entityId={tableMeta.rowData[1]}
                      content={{
                        address1: tableMeta.rowData[2],
                        address2: tableMeta.rowData[3],
                        city: tableMeta.rowData[4],
                        state: tableMeta.rowData[5],
                        zip: tableMeta.rowData[6],
                        country: tableMeta.rowData[7],
                      }}
                      targetLabel={props.targetLabel}
                    />
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
                  const valueFormatter = (v) => {
                    if (column.name === "appraisedValue")
                      return formatter.format(v);

                    if (column.name === "lastUpdateAt")
                      return anyToDate(v).toLocaleString("en-US", {
                        year: "numeric",
                        day: "numeric",
                        month: "numeric",
                      });

                    return v;
                  };

                  ////// if non editable column
                  if (!column.editable) {
                    //// if no value
                    if (value === "" || value === null || !value) return value;

                    //// if value
                    return (
                      <div
                        className={classes.cellDataDiv}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {valueFormatter(value)}
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: "flex" }}>
                      {props.targetLabel === "contact" &&
                        column.name === "name" && (
                          <Avatar
                            color={Avatar.getRandomColor(value, [
                              "#b5d2f6",
                              "#ade2e9",
                              "#eaeaea",
                              "#f2c1e2",
                              "#d7d6fb",
                            ])}
                            fgColor="#000"
                            name={valueFormatter(value)}
                            size="35"
                            round
                          />
                        )}
                      <CellContentEdition
                        id={tableMeta.rowData[0]}
                        content={{ [column.name]: valueFormatter(value) }}
                        targetLabel={props.targetLabel}
                        dropDownOptions={
                          column.dropDownOptions ? column.dropDownOptions : null
                        }
                        entityId={
                          props.targetLabel === "Parcel Owner" ||
                          props.targetLabel === "contact"
                            ? tableMeta.rowData[1]
                            : null
                        }
                      />
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
  }, [props.columns, props.rows, colInd, rowInd, m1nSelectedRowsTracks]);

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
    setStateApp((state) => ({
      ...state,
      popupOpen: false,
      expandedCard: false,
    }));
  };

  // 'view contact' on deals modal
  const selectRowOpenContact = (contact) => {
    const rowIndex = rows.findIndex((r) => r._id === contact._id);
    const row = rows[rowIndex];

    setSelectedRow(rows);

    setStateApp((stateApp) => ({
      ...stateApp,
      selectedContact: row.id,
    }));

    setSubComponent(
      <ContactDetailCard
        selectRowOpenContact={selectRowOpenContact}
        contactId={row._id}
        handleCloseExpandableCard={handleCloseExpandableCard}
      />
    );
    setTitle("CONTACT DETAILS");
    setSubTitle(" ");
    handleOpenExpandableCard();
  };

  const options = {
    filterType: "multiselect",
    rowsPerPage: props.startPaginationAt ? props.startPaginationAt : 25,
    rowsPerPageOptions:
      props.rows && props.rows.length > 25
        ? [10, 25, 50, 100]
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
              if (row._id) return row._id;
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
    rowsSelected: m1nSelectedRowsIndexesRef.current,
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
                for (
                  let i = 0;
                  i < m1nSelectedRowsIndexesRef.current.length;
                  i++
                ) {
                  selectedRows.push(rows[m1nSelectedRowsIndexesRef.current[i]]);
                }
                return selectedRows;
              };

              return (
                <div
                  style={{
                    height: "48px",
                    display: "flex",
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
                  <Divider orientation="vertical" flexItem />
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteContact");
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }

            //// if Parcel Owner set the multi selection top bar: ////
            if (props.targetLabel === "Parcel Owner") {
              return (
                <Tooltip title={"Delete"}>
                  <IconButton
                    size="medium"
                    style={{ margin: "0 5px" }}
                    onClick={(e) => {
                      handleExpandClick(null, null, null, "deleteParcelOwner");
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
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
                <IconButton
                  size="medium"
                  onClick={(e) => {
                    routeChange("/bulkupload");
                  }}
                >
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
                    if (
                      props.addAble.type &&
                      props.addAble.type === "ownerToParcel"
                    )
                      handleExpandClick(null, null, null, "addOwnerToParcel");
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
            selectRowOpenContact={selectRowOpenContact}
            contactId={rows[dataIndex]._id}
            handleCloseExpandableCard={handleCloseExpandableCard}
          />
        );
        setTitle("CONTACT DETAILS");
        setSubTitle(" ");
        handleOpenExpandableCard();
      }
    },
  };

  let history = useHistory();

  let routeChange = (route) => {
    history.push(route);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className={`${classes.table} ${
          rows && !props.loading ? "" : classes.loadingTable
        } ${columns && columns.length > 0 ? "" : classes.emptyTable}`}
      >
        <MUIDataTable
          className={classes.table}
          title={props.header}
          data={rows ? rows : []}
          columns={columns ? columns : []}
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
                  openDialog === "addOwnerToParcel" ||
                  openDialog === "addOwnerToContact" ||
                  openDialog === "deleteOwnersFromContact" ||
                  openDialog === "deleteContact"
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
                  m1nSelectedRowsIndexesRef.current.indexOf(rowInd) !== -1 &&
                  m1nSelectedRowsIndexesRef.current.length > 1
                    ? m1nSelectedRowsIdsRef.current
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
                    m1nSelectedRowsIndexesRef.current.indexOf(rowInd) !== -1 &&
                    m1nSelectedRowsIndexesRef.current.length > 1
                      ? m1nSelectedRowsIdsRef.current
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
            {openDialog === "addOwnerToParcel" && (
              <AddParcelOwnerDialogContent
                onClose={handleCloseDialog}
                customLayerId={props.addAble.customLayerId}
              />
            )}
            {openDialog === "deleteOwnersFromContact" && (
              <DeleteConfirmationDialogContent
                header="Delete Owner(s)"
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={m1nSelectedRowsIdsRef.current}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to permanently delete the owner${
                  m1nSelectedRowsIdsRef.current &&
                  m1nSelectedRowsIdsRef.current.length > 1
                    ? "s"
                    : ""
                } from  this contact?`}
              </DeleteConfirmationDialogContent>
            )}
            {openDialog === "deleteContact" && (
              <DeleteConfirmationDialogContent
                header="Delete Contact(s)"
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={m1nSelectedRowsIdsRef.current}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {props.header === "Owner's Contacts" &&
                  `Do you want to remove the contact${
                    m1nSelectedRowsIdsRef.current &&
                    m1nSelectedRowsIdsRef.current.length > 1
                      ? "s"
                      : ""
                  } from this owner?`}

                {props.header === "Contacts" &&
                  `Do you want to delete the contact${
                    m1nSelectedRowsIdsRef.current &&
                    m1nSelectedRowsIdsRef.current.length > 1
                      ? "s"
                      : ""
                  }?`}
              </DeleteConfirmationDialogContent>
            )}
            {openDialog === "deleteParcelOwner" && (
              <DeleteConfirmationDialogContent
                header={`Delete Owner${
                  m1nSelectedRowsIdsRef.current &&
                  m1nSelectedRowsIdsRef.current.length > 1
                    ? "s"
                    : ""
                }`}
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={m1nSelectedRowsIdsRef.current}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to delete the owner${
                  m1nSelectedRowsIdsRef.current &&
                  m1nSelectedRowsIdsRef.current.length > 1
                    ? "s"
                    : ""
                }?`}
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
              noTrackAvailable={props.targetLabel === "contact" ? true : false}
            />
          </Dialog>
        )}
      </div>

      {props.loading && (
        <div
          style={{
            padding: "15px",
            position: "absolute",
            top: "95px",
            left: "30px",
            zIndex: "150",
          }}
        >
          <CircularProgress size={80} disableShrink color="secondary" />
        </div>
      )}
    </div>
  );
}

export default React.memo(SubTable, deepEqualObjects);
