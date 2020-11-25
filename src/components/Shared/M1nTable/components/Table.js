import React, { useState, useContext, useEffect, useRef, Fragment } from "react";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandableCardProvider from "../../../ExpandableCard/ExpandableCardProvider";
import WellCardProvider from "../../../WellCard/WellCardProvider"
import OwnersDetailCard from "../../../OwnersDetailCard/OwnersDetailCard";
import ContactDetailCard from "../../../ContactDetailCard/ContactDetailCard";
import { AppContext } from "../../../../AppContext";
import Tags from "../../Tagger";
import Comments from "../../Comments";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
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
import DeleteConfirmationDialogContent from "./SubComponents/DeleteConfirmationDialogContent";
import MakeItAContactConfirmationDialogContent from "./SubComponents/MakeItAContactConfirmationDialogContent";
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
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { useDispatch, useSelector } from "react-redux";
import { setMapGridCardState } from "../../../../actions";
import {
  deepEqualObjects,
  deepEqual,
  setStateIfDeepEqual,
} from "../../functions";
import InviteUserDialog from "./SubComponents/InviteUserDialog";
import ReinviteUserDialog from "./SubComponents/ReinviteUserDialog";
import AddParcelOwnerDialogContent from "./SubComponents/AddParcelOwnerDialogContent";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AddParcelToEntityDialogContent from "./SubComponents/AddParcelToEntityDialogContent/AddParcelToEntityDialogContent";
import Convert_contact from "../../svgIcons/convert_contact";
import Contact_card from "../../svgIcons/contact_card";
import TransactDialog from "../../../Transact/components/dialog";
import ParcelScreenIcon from "../../svgIcons/parcelScreen";
import ParcelsDetailCard from "../../../ParcelsDetailCard/ParcelsDetailCard";
import debounce from "lodash/debounce";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { WELLQUERY } from "../../../../graphQL/useQueryWell";
import { useLazyQuery } from "@apollo/client";
import moment from 'moment';

var ticksToDateString = function (ticks) {
  var epochTicks = 621355968000000000;
  var ticksPerMillisecond = 10000; // whoa!
  var maxDateMilliseconds = 8640000000000000;
  if (isNaN(ticks)) {
    //      0001-01-01T00:00:00.000Z
    return "NANA-NA-NATNA:NA:BA.TMAN";
  }
  // convert the ticks into something javascript understands
  var ticksSinceEpoch = ticks - epochTicks;
  var millisecondsSinceEpoch = ticksSinceEpoch / ticksPerMillisecond;
  if (millisecondsSinceEpoch > maxDateMilliseconds) {
    //      +035210-09-17T07:18:31.111Z
    return "+WHOAWH-OA-ISTOO:FA:RA.WAYZ";
  }
  // output the result in something the human understands
  var date = new Date(millisecondsSinceEpoch);
  return date.toISOString();
};

const removeDuplicatesIds = (selectedRowsIds) => [...new Set(selectedRowsIds)];

const customStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-body": {
      padding: (props) => (props.dense ? "0 !important" : "0px 16px !important")
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
      "& td": {
        "& div": {
          padding: 0
        }
      },
      "& td:nth-child(3)": {
        "& div": {
          width: 300
        }
      },
      "& td:nth-child(13)": {
        "& div": {
          width: 300,
          "& span": {
            maxWidth: 300
          }
        }
      },
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
  }
}));

const productionStyle = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-body": {
      padding: (props) => (props.dense ? "0 !important" : "0px 16px !important")
    },
    "& .MuiTableCell-head": {
      "& span": {
        justifyContent: 'center'
      }
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
      "& td": {
        textAlign: 'center',
        "& div": {
          justifyContent: 'center'
        }
      }
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
  }
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    "& .MuiTableCell-body": {
      padding: (props) => (props.dense ? "0 !important" : "12px 16px")
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
  monetizationIcon: {
    margin: "10px",
    color: "#155388",
  },
}));

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 21,
});

function SubTable(props) {
  const classes = useStyles(props);
  const customClassess = customStyles(props);
  const productionClassess = productionStyle(props);

  const dispatch = useDispatch();

  const [stateApp, setStateApp] = useContext(AppContext);
  const [rows, Rows] = useState([]);
  const setRows = (newState) => {
    setStateIfDeepEqual(Rows, newState);
  };

  const [total, Total] = useState(false);
  const setTotal = (newState) => {
    setStateIfDeepEqual(Total, newState);
  };

  const [cumulative, Cumulative] = useState({});
  const setCumulative = (newState) => {
    setStateIfDeepEqual(Cumulative, newState);
  };

  const [columns, setColumns] = useState([]);
  // const setColumns = (newState) => {
  //   setStateIfDeepEqual(Columns, newState);
  // };

  const [viewColumns, ViewColumns] = useState([]);
  const setViewColumns = (newState) => {
    setStateIfDeepEqual(ViewColumns, newState);
  };

  const [colInd, ColInd] = useState();
  const setColInd = (newState) => {
    setStateIfDeepEqual(ColInd, newState);
  };
  const [rowInd, RowInd] = useState();
  const setRowInd = (newState) => {
    setStateIfDeepEqual(RowInd, newState);
  };
  const [pageInd, PageInd] = useState(0);
  const setPageInd = (newState) => {
    setStateIfDeepEqual(PageInd, newState);
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
  const [targetLabelToExpand, TargetLabelToExpand] = useState(null);
  const setTargetLabelToExpand = (newState) => {
    setStateIfDeepEqual(TargetLabelToExpand, newState);
  };

  const [title, Title] = useState("");
  const setTitle = (newState) => {
    setStateIfDeepEqual(Title, newState);
  };
  const [subTitle, SubTitle] = useState("");
  const setSubTitle = (newState) => {
    setStateIfDeepEqual(SubTitle, newState);
  };

  const [m1nSelectedRowsIndexes, M1nSelectedRowsIndexes] = useState([]);
  const setM1nSelectedRowsIndexes = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsIndexes, newState);
  };

  const [m1nSelectedRowsIds, M1nSelectedRowsIds] = useState([]);
  const setM1nSelectedRowsIds = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsIds, newState);
  };

  const [m1nSelectedRowsTracks, M1nSelectedRowsTracks] = useState([]);
  const setM1nSelectedRowsTracks = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsTracks, newState);
  };

  const [trueTargetLabel, TrueTargetLabel] = useState(null);
  const setTrueTargetLabel = (newState) => {
    setStateIfDeepEqual(TrueTargetLabel, newState);
  };

  const [rowsPerPage, RowsPerPage] = useState(props.startPaginationAt);
  const setRowsPerPage = (newState) => {
    setStateIfDeepEqual(RowsPerPage, newState);
  };

  const [firstMount, FirstMount] = useState(true);
  const setFirstMount = (newState) => {
    setStateIfDeepEqual(FirstMount, newState);
  };

  const [getWell, { data: dataWell }] = useLazyQuery(WELLQUERY);

  //// opening the well detail card after fetch the extra well data needed
  useEffect(() => {
    if (
      props.parent &&
      (props.parent === "search" || props.parent === "owner_WellInterests") &&
      props.targetLabel == "well" &&
      dataWell &&
      dataWell.well
    ) {
      let selectedWell = props.rows.find((row) => {
        if (row.id) return row.id === dataWell.well.id;
        return row.Id === dataWell.well;
      });

      selectedWell = { ...selectedWell, ...dataWell.well };
      //// temporary to fix the ticks dates fields comming from the rest api
      if (
        selectedWell.permitApprovedDate &&
        selectedWell.permitApprovedDate != "null"
      )
        selectedWell.permitApprovedDate = ticksToDateString(
          selectedWell.permitApprovedDate
        );
      if (selectedWell.spudDate && selectedWell.spudDate != "null")
        selectedWell.spudDate = ticksToDateString(selectedWell.spudDate);
      if (selectedWell.completionDate && selectedWell.completionDate != "null")
        selectedWell.completionDate = ticksToDateString(
          selectedWell.completionDate
        );
      if (
        selectedWell.firstProductionDate &&
        selectedWell.firstProductionDate != "null"
      )
        selectedWell.firstProductionDate = ticksToDateString(
          selectedWell.firstProductionDate
        );
      //// temporary end
      if (selectedWell) {

        setSelectedRow(selectedWell);
        setStateApp((state) => ({
          ...state,
          selectedWellId: dataWell.well.id,
          selectedWell,
        }));
        setSubComponent(<WellCardProvider />);
        setTitle(
          selectedWell.wellName ? selectedWell.wellName : selectedWell.WellName
        );
        setSubTitle(
          selectedWell.operator ? selectedWell.operator : selectedWell.Operator
        );
        handleOpenExpandableCard();
      }
    }
  }, [dataWell]);

  useEffect(() => {
    if (props.targetLabel === "Parcel Interest")
      setTrueTargetLabel("Parcel Ownership");
  }, [props.targetLabel]);

  useEffect(() => {
    if (props.rows) {
      const updInSameOrder = (commingRows) => {
        if (!rows || rows.length == 0) return commingRows;

        let updatedRows = [];
        let newRows = [];

        commingRows.forEach((updRow) => {
          const position = rows.findIndex(
            (row) =>
              (row.id && row.id === updRow.id) ||
              (row.Id && row.Id === updRow.Id) ||
              (row._id && row._id === updRow._id)
          );

          if (position > -1) updatedRows[position] = updRow;
          else newRows.push(updRow);
        });

        return [...newRows, ...updatedRows.filter((r) => r)];
      };

      if (props.rows.length > 0 && props.orderByTracks) {
        if (firstMount) {
          setRows([
            ...props.rows.sort((a, b) => {
              return b.isTracked - a.isTracked;
            }),
          ]);
          setFirstMount(false);
        } else setRows(updInSameOrder([...props.rows]));
      } else setRows([...props.rows]);

      if (props.total == true) {
        let temp = {};
        let calc_keys = ['oil', 'gas', 'water', 'allocatedOil', 'allocatedWater', 'allocatedGas'];
        let current_keys = [];
        if ([...props.rows].length != 0) {
          let keys = Object.keys([...props.rows][0]);
          current_keys = calc_keys.filter(value => keys.includes(value));
        }
        temp = computeCumulative(current_keys, [...props.rows])
        switch(props.parent){
          case "production_WellDetails":
            let reconstruct_row = {
              ...props.rows[0],
              ...temp
            }
            Object.keys(reconstruct_row).forEach(key => {
              if (!calc_keys.includes(key)) {
                reconstruct_row[key] = "";
              }
            });
            reconstruct_row["ReportDate"] = "Cumulative";
            setRows(displayCumulative([...props.rows], props.total, reconstruct_row));
            setCumulative(reconstruct_row);
            break;
          default:
            break;
        }
      }
      setTotal(props.total);
    }
  }, [props.rows, props.orderByTracks]);

  const computeCumulative = (keys, data) => {
    let ret_val = {};
    data.forEach(row => {
        keys.forEach(key => {
          if (ret_val[key]) {
            ret_val[key] = ret_val[key] + parseFloat(row[key]);
          } else {
            ret_val[key] = parseFloat(row[key]);
          }
        });
    });
    return ret_val;
  }

  useEffect(() => {
    if (rows && m1nSelectedRowsIndexes) {
      if (rows.length > 0 && m1nSelectedRowsIndexes.length > 0) {
        let selectedRowsTracks = m1nSelectedRowsIndexes.map((ind) => {
          if (rows[ind]) return rows[ind].isTracked;
        });
        setM1nSelectedRowsTracks(selectedRowsTracks);
      } else setM1nSelectedRowsTracks([]);
    }
  }, [rows, props.columns, m1nSelectedRowsIndexes]);

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

  const handleExpandClick = async (cIndex, rIndex, idOrValues, type) => {
    setColInd(cIndex);
    setRowInd(rIndex);
    setExpandedObject(idOrValues);
    setOpenDialog(type);
  };

  ////setting all icons columns/////
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuID, setMenuID] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [isUMSettings, setUsermanagementSettings] = useState([]);

  const closeMenu = () => {
    setUsermanagementSettings([]);
    setSelectedUser(null);
    setSelectedUserIndex(null);
    setM1nSelectedRowsIds([]);
  };

  const changeAdminAccess = () => {
    selectedUser.adminAccess = !selectedUser.adminAccess;
    rows !== null
      ? setExpandedObject([rows, selectedUser])
      : setExpandedObject([props.rows, selectedUser]);
    closeMenu();
  };

  const openMenu = (event, rowIndex, user) => {
    setSelectedUser(user);
    setSelectedUserIndex(rowIndex);
    setM1nSelectedRowsIds([user._id]);
    setUsermanagementSettings(
      <Menu
        anchorEl={event.currentTarget}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        keepMounted
        id={rowIndex}
        open={true}
        onClose={closeMenu}
      >
        {/* <MenuItem
          className={classes.userMenuItem}
          onClick={selectedUser !== null && changeAdminAccess}
        >
          {selectedUser !== null &&
          typeof selectedUser.adminAccess !== "undefined" &&
          selectedUser.adminAccess
            ? "Remove Admin Access"
            : "Grant Admin Access"}
        </MenuItem> */}
        {user.lastLogin == null || user.lastLogin == undefined ? (
          <div>
            <MenuItem
              className={classes.userMenuItem}
              onClick={(e) =>
                handleExpandClick(null, null, null, "reinviteUser")
              }
            >
              Resend Invite
            </MenuItem>
            <Divider />
          </div>
        ) : (
          <div></div>
        )}
        <MenuItem
          className={classes.userMenuItem}
          onClick={(e) => handleExpandClick(null, null, null, "deleteUser")}
        >
          Delete User
        </MenuItem>
      </Menu>
    );
  };

  const searchRequest = (e) => {
    e.setLoading(true);
    e.tableState.page = 0;
    e.tableState.count = 0;
    setPageInd(e.tableState.page);
    e.getPaginatedContacts(e.pageVariables);
    e.getContactsFilterOptions(e.pageVariables);
  };

  const delayedSearchRequest = React.useMemo(
    () =>
      debounce((request, callback) => {
        searchRequest(request);
      }, 500),
    []
  );

  useEffect(() => {
    if (props.columns) {
      props.columns.forEach((column) => {
        switch (column.name) {
          case "detailCard":
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let id = props.targetLabel + tableMeta.columnIndex;
                  return (
                    <Tooltip title={"Detail Card"} placement="top">
                      <IconButton
                        id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons} ${
                          colInd === tableMeta.columnIndex &&
                          rowInd === tableMeta.rowIndex
                            ? classes.iconSelected
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (value) {
                            setStateApp((state) => ({
                              ...state,
                              popupOpen: false,
                              selectedWell: null,
                              selectedParcel: null,
                            }));
                            getWell({
                              variables: { wellId: value },
                            });
                          } else {
                            let selectedWell = props.rows.find((row) => {
                              if (row.id) return row.id == tableMeta.rowData[0];
                              return row.Id == tableMeta.rowData[0];
                            });

                            if (selectedWell) {
                              if (props.targetLabel === "well") {
                                setSelectedRow(selectedWell);
                                setStateApp((state) => ({
                                  ...state,
                                  selectedWellId: tableMeta.rowData[0],
                                  selectedWell: selectedWell,
                                }));
                                setSubComponent(<WellCardProvider />);
                                setTitle(
                                  selectedWell.wellName
                                    ? selectedWell.wellName
                                    : selectedWell.WellName
                                );
                                setSubTitle(
                                  selectedWell.operator
                                    ? selectedWell.operator
                                    : selectedWell.Operator
                                );
                                handleOpenExpandableCard();
                              } else if (props.targetLabel === "owner") {
                                if (props.parent === "OwnersPerWell") {
                                  selectedWell.id = selectedWell.globalOwnerId;
                                  delete selectedWell.globalOwnerId;
                                }

                                dispatch(
                                  setMapGridCardState({
                                    selectedOwner: selectedWell,
                                  })
                                );
                              }
                            }
                          }
                        }}
                        aria-label="Detail Card"
                      >
                        <AssessmentIcon />
                      </IconButton>
                    </Tooltip>
                  );
                },
              };
            break;
          case "actions":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let id = props.targetLabel + tableMeta.columnIndex;
                  return (
                    <>
                      <Tooltip
                        title="settings"
                        placement="top"
                        style={{ marginRight: "10px" }}
                      >
                        <IconButton
                          id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                          size={props.dense ? "small" : "medium"}
                          onClick={(e) => {
                            openMenu(
                              e,
                              tableMeta.rowIndex,
                              typeof rows[tableMeta.rowIndex] !== "undefined"
                                ? rows[tableMeta.rowIndex]
                                : props.rows[tableMeta.rowIndex]
                            );
                          }}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  );
                },
              };
            }

            break;
          case "adminAccess":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <div style={{ textAlign: "center" }}>
                      {value ? "Yes" : "No"}
                    </div>
                  );
                },
                setCellHeaderProps: () => ({
                  style: { display: "flex", justifyContent: "center" },
                }),
              };
            }

            break;
          case "parcelIcon": //// open parcel detail card
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={"See Parcel Details"}
                      placement="top"
                      style={{ marginRight: "10px" }}
                    >
                      <IconButton
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons}`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (tableMeta.rowData[2]) {
                            setStateApp((stateApp) => ({
                              ...stateApp,
                              selectedContact: value,
                            }));
                            setSelectedRow({ _id: tableMeta.rowData[2] });
                            setTargetLabelToExpand("parcel");

                            setSubComponent(
                              <ParcelsDetailCard id={tableMeta.rowData[2]} />
                            );
                            setTitle("PARCEL DETAILS");
                            setSubTitle(" ");
                            handleOpenExpandableCard();
                          }
                        }}
                      >
                        <ParcelScreenIcon style={{ margin: "4px" }} />
                      </IconButton>
                    </Tooltip>
                  );
                },
              };
            }
            break;
          case "coordinates": //// fly to the map icon
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let id = props.targetLabel + tableMeta.columnIndex;

                  return (
                    <Tooltip
                      title={
                        value &&
                        (value.bbox ||
                          value.center ||
                          value.objToPopulateSearchLayer)
                          ? "Fly To Map"
                          : "Not Available"
                      }
                      placement="top"
                      style={{ marginRight: "10px" }}
                    >
                      <IconButton
                        id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons} ${
                          value &&
                          (value.bbox ||
                            value.center ||
                            value.objToPopulateSearchLayer)
                            ? ""
                            : classes.noCommentsIcon
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (value) {
                            if (value.bbox || value.center) {
                              setStateApp((state) => {
                                if (value.bbox)
                                  return {
                                    ...state,
                                    popupOpen: false,
                                    selectedWell: null,
                                    selectedWellId: null,
                                    fitBounds: {
                                      maxLat: value.bbox[3],
                                      minLat: value.bbox[1],
                                      maxLong: value.bbox[2],
                                      minLong: value.bbox[0],
                                    },
                                  };

                                //// value.center
                                return {
                                  ...state,
                                  popupOpen: false,
                                  selectedWell: null,
                                  activateWellDetailsFromTable: false,
                                  selectedWellId:
                                    props.targetLabel == "well"
                                      ? tableMeta.rowData[0]
                                      : null,
                                  flyTo: {
                                    longitude: value.center[0],
                                    latitude: value.center[1],
                                  },
                                };
                              });

                              dispatch(
                                setMapGridCardState({
                                  mapGridCardActivated: "min",
                                })
                              );
                            } else if (value.objToPopulateSearchLayer) {
                              dispatch(
                                setMapGridCardState({
                                  objToPopulateSearchLayer:
                                    value.objToPopulateSearchLayer,
                                  mapGridCardActivated: "min",
                                })
                              );
                            }
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
                  let id =
                    (trueTargetLabel ? trueTargetLabel : props.targetLabel) +
                    tableMeta.columnIndex;

                  let targetSourceId =
                    props.parent === "OwnersPerWell"
                      ? tableMeta.rowData[2]
                      : tableMeta.rowData[0];
                  return (
                    <TrackToggleButton
                      id={id + targetSourceId + tableMeta.rowIndex}
                      target={{ isTracked: value }}
                      targetLabel={
                        trueTargetLabel ? trueTargetLabel : props.targetLabel
                      }
                      targetSourceId={targetSourceId}
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
                  let targetSourceId =
                    props.parent === "OwnersPerWell"
                      ? tableMeta.rowData[2]
                      : tableMeta.rowData[0];

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
                          id={id + targetSourceId + tableMeta.rowIndex}
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
                              targetSourceId,
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
          // case "contactsCounter":
          //   {
          //     column.options = {
          //       ...column.options,
          //       customBodyRender: (value, tableMeta, updateValue) => {
          //         return (
          //           <Tooltip
          //             title={value || value === 0 ? "Contacts" : "Add Contact"}
          //             placement="top"
          //             style={{ marginRight: "10px" }}
          //           >
          //             <Badge
          //               badgeContent={value ? value : null}
          //               color="secondary"
          //             >
          //               <IconButton
          //                 size={props.dense ? "small" : "medium"}
          //                 color="primary"
          //                 className={`${classes.icons} ${
          //                   !value || value === 0 ? classes.noCommentsIcon : ""
          //                 } ${
          //                   colInd === tableMeta.columnIndex &&
          //                   rowInd === tableMeta.rowIndex
          //                     ? classes.iconSelected
          //                     : ""
          //                 }`}
          //                 onClick={(e) => {
          //                   e.stopPropagation();
          //                   handleExpandClick(
          //                     tableMeta.columnIndex,
          //                     tableMeta.rowIndex,
          //                     tableMeta.rowData[0],
          //                     "ownerContacts"
          //                   );
          //                 }}
          //                 aria-label="show contacs"
          //               >
          //                 <ContactPhoneIcon />
          //               </IconButton>
          //             </Badge>
          //           </Tooltip>
          //         );
          //       },
          //     };
          //   }
          //   break;
          case "isContact":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return (
                    <Tooltip
                      title={
                        !value || value === "false"
                          ? "Convert To Contact"
                          : "Contact Details"
                      }
                      placement="top"
                    >
                      <IconButton
                        size={props.dense ? "small" : "medium"}
                        color="primary"
                        className={`${classes.icons} ${
                          !value || value === "false"
                            ? classes.noCommentsIcon
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (value && value !== "false") {
                            setTargetLabelToExpand("contact");
                            setStateApp((stateApp) => ({
                              ...stateApp,
                              selectedContact: value,
                            }));
                            setSelectedRow({ _id: value });

                            setSubComponent(
                              <ContactDetailCard
                                selectRowOpenContact={selectRowOpenContact}
                                contactId={value}
                                handleCloseExpandableCard={
                                  handleCloseExpandableCard
                                }
                              />
                            );
                            setTitle("CONTACT DETAILS");
                            setSubTitle(" ");
                            handleOpenExpandableCard();
                          } else {
                            if (props.targetLabel == "owner") {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                {
                                  globalOwner:
                                    props.parent === "OwnersPerWell"
                                      ? tableMeta.rowData[2]
                                      : tableMeta.rowData[0],
                                  entity: tableMeta.rowData[1],
                                },
                                "makeOwnerAContact"
                              );
                            } else
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                tableMeta.rowData[0],
                                "makeOwnerAContact"
                              );
                          }
                        }}
                        aria-label="show contact"
                      >
                        {!value || value === "false" ? (
                          <Convert_contact style={{ margin: "4px" }} />
                        ) : (
                          <Contact_card style={{ margin: "4px" }} />
                        )}
                      </IconButton>
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
                              // handleExpandClick(
                              //   tableMeta.columnIndex,
                              //   tableMeta.rowIndex,
                              //   value,
                              //   "ownersPerContacts"
                              // );
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
                  let targetSourceId =
                    props.parent === "OwnersPerWell"
                      ? tableMeta.rowData[2]
                      : tableMeta.rowData[0];

                  return (
                    <div style={{ marginRight: "10px" }}>
                      <Tooltip
                        title={value && value[1] === 0 ? "Add Tags" : "Tags"}
                        placement="top"
                      >
                        <Badge
                          id={id + targetSourceId + tableMeta.rowIndex}
                          className={`${classes.TagSample} ${
                            colInd === tableMeta.columnIndex &&
                            rowInd === tableMeta.rowIndex
                              ? classes.iconSelected
                              : ""
                          }`}
                          badgeContent={value ? value[1] : 0}
                          color="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleExpandClick(
                              tableMeta.columnIndex,
                              tableMeta.rowIndex,
                              targetSourceId,
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
                          {value && value[0] && value[0].length > 0 ? (
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
                      nonEditable={!column.editable}
                    />
                  );
                },
              };
            }
            break;
          case "oil":
          case "gas":
          case "water":
          case "allocatedWater":
          case "allocatedGas":
          case "allocatedOil":
            column.options = {
              ...column.options,
              customBodyRender: (value, tableMeta, updateValue) => {
                if (value) {
                  return (<span style={{paddingLeft: 10, paddingRight: 10}}>{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>);
                } else {
                  return (<span style={{paddingLeft: 10, paddingRight: 10}}>0</span>)
                }
              },
            };
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

                  // if (column.name === "lastUpdateBy.name") {
                  //   if (props.rows[tableMeta.rowIndex]) {
                  //     value = props.rows[tableMeta.rowIndex].lastUpdateBy?.name;
                  //   }
                  // }

                  ////// if non editable column
                  if (
                    !column.editable &&
                    props.targetLabel === "Parcel Ownershipship" &&
                    column.name === "name" &&
                    tableMeta.rowData[11] !== "false"
                  ) {
                    //// if no value
                    if (value === "" || value === null || !value)
                      return (
                        <p
                          style={{
                            color: "#B3B3B3",
                            padding: "10px",
                            margin: "0",
                          }}
                        >
                          N/A
                        </p>
                      );

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
                          props.targetLabel === "Parcel Interest" ||
                          props.targetLabel === "Parcel Ownershipship" ||
                          props.targetLabel === "contact"
                            ? tableMeta.rowData[1]
                            : null
                        }
                        nonEditable={!column.editable}
                      />
                      {props.targetLabel === "contact" &&
                        column.name === "name" &&
                        tableMeta.rowData[
                          props.columns.findIndex(
                            (val) => val.name === "melissaRowsCount"
                          )
                        ] &&
                        tableMeta.rowData[
                          props.columns.findIndex(
                            (val) => val.name === "melissaRowsCount"
                          )
                        ] !== 0 && (
                          <MonetizationOnIcon
                            className={classes.monetizationIcon}
                          />
                        )}
                    </div>
                  );
                },
              };
            }
            break;
        }
      });
      setColumns([...props.columns]);
      setViewColumns(props.addColumnFilter);
    }
  }, [
    props.columns,
    props.rows,
    rows,
    colInd,
    rowInd,
    m1nSelectedRowsTracks,
    m1nSelectedRowsIndexes,
    m1nSelectedRowsIds,
  ]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setColInd(null);
    setRowInd(null);
    setExpandedObject(null);
    setStateApp({ ...stateApp, isEditSelectedProfileName: null });
  };

  const handleOpenExpandableCard = () => {
    setShowExpandableCard(true);
    console.log("Expandable card opened");
  };
  const handleCloseExpandableCard = () => {
    setShowExpandableCard(false);
    setTargetLabelToExpand(null);
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
    filterType: "dropdown",
    rowsPerPage: rowsPerPage ? rowsPerPage : 25,
    rowsPerPageOptions:
      props.rows && props.rows.length > 25
        ? [10, 25, 50, 100]
        : props.rows && props.rows.length > 10
        ? [10, 25]
        : [],
    selectableRows: props.targetLabel == "production_detail" ? false : "multiple",
    print:
      props.targetLabel !== "deals" && 
      props.targetLabel !== "usermanagement" && 
      props.targetLabel !== "owner" && 
      props.targetLabel !== "production_detail",
    viewColumns: props.targetLabel !== "usermanagement",
    //// triggers when a row/s is selected ////
    onRowsSelect: (currentRowsSelected, rowsSelected) => {
      // console.log("currentRowsSelected", JSON.stringify(currentRowsSelected));
      // console.log("rowsSelected", JSON.stringify(rowsSelected));
      if (rowsSelected && rowsSelected.length > 0) {
        let indexArray = rowsSelected
          .map((d) => d.dataIndex)
          .sort((a, b) => a - b);
        if (rows && indexArray) {
          if (rows.length > 0 && indexArray.length > 0) {
            let selectedRows = rows.filter(
              (row, index) => indexArray.indexOf(index) !== -1
            );
            let selectedRowsIds = selectedRows.map((row) => {
              if (props.parent === "OwnersPerWell") return row.globalOwnerId;
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
    rowsSelected: m1nSelectedRowsIndexes,
    //// allows you to customize the top bar of selected items ////
    customToolbarSelect:
      props.header === "Interest Owners Tied to Contact"
        ? false
        : (selectedRows, displayData, setSelectedRow) => {
            //// if contacts set the multi selection top bar: ////
            if (
              props.header === "Owner's Contacts" ||
              props.header === "Contacts" ||
              props.header === "Active Users"
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
                    display: "flex",
                  }}
                >
                  {props.header !== "Active Users" && (
                    <>
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
                        Buy Contact Info
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
                        Send Mailers
                      </Button>
                      {/* <Button
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
                      </Button> */}
                      <Divider orientation="vertical" flexItem />
                    </>
                  )}
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        props.header !== "Active Users"
                          ? handleExpandClick(null, null, null, "deleteContact")
                          : handleExpandClick(null, null, null, "deleteUser");
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }

            //// if Parcel Ownership set the multi selection top bar: ////
            if (props.targetLabel === "Parcel Ownership") {
              return (
                <Tooltip title={"Delete"}>
                  <IconButton
                    size="medium"
                    style={{ margin: "0 5px" }}
                    onClick={(e) => {
                      handleExpandClick(
                        null,
                        null,
                        null,
                        "deleteParcelOwnership"
                      );
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              );
            }

            //// if Parcel Interest set the multi selection top bar: ////
            if (props.targetLabel === "Parcel Interest") {
              return (
                <Tooltip title={"Delete"}>
                  <IconButton
                    size="medium"
                    style={{ margin: "0 5px" }}
                    onClick={(e) => {
                      handleExpandClick(
                        null,
                        null,
                        null,
                        "deleteParcelInterest"
                      );
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              );
            }

            //// if Parcel Ownership set the multi selection top bar: ////
            if (props.targetLabel === "deals") {
              return (
                <Tooltip title={"Delete"}>
                  <IconButton
                    size="medium"
                    style={{ margin: "0 5px" }}
                    onClick={(e) => {
                      handleExpandClick(null, null, null, "deleteDeal");
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
                title={`Import ${
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
                    if (props.addAble.type && props.addAble.type === "contact")
                      handleExpandClick(null, null, null, "addContact");

                    if (
                      props.addAble.type &&
                      props.addAble.type === "ownerToParcel"
                    )
                      handleExpandClick(null, null, null, "addOwnerToParcel");

                    if (props.addAble.type && props.addAble.type === "deals")
                      setStateApp((stateApp) => ({
                        ...stateApp,
                        dealDialog: true,
                        activeDeal: { cardId: null, laneId: null },
                      }));
                    if (
                      props.addAble.type &&
                      props.addAble.type === "parcelInterestsToEntity"
                    )
                      // handleExpandClick(null, null, null, "addOwnerToParcel");
                      handleExpandClick(
                        null,
                        null,
                        null,
                        "addParcelInterestsToEntity"
                      );
                    if (
                      props.addAble.type &&
                      props.addAble.type === "inviteUser"
                    )
                      handleExpandClick(null, null, null, "inviteUser");
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

      // if (props.targetLabel === "owner") {
      //   setStateApp((state) => ({ ...state, selectedOwner: rows[dataIndex] }));
      //   setSubComponent(
      //     <OwnersDetailCard
      //       ownerId={rows[dataIndex].id}
      //       wellsIdsArray={rows[dataIndex].wellsCounter}
      //     />
      //   );
      //   setTitle(rows[dataIndex].name);
      //   setSubTitle(rows[dataIndex].interestType);
      //   handleOpenExpandableCard();
      // }
      if (props.targetLabel === "deals") {
        console.log("ROW DATA: ", rows[dataIndex]);
        console.log("ROW DATA 0 INDEX: ", rowData[0]);
        let card = { ...rows[dataIndex] };
        delete card["dealStage"];
        setStateApp((stateApp) => ({
          ...stateApp,
          dealDialog: true,
          activeDeal: card,
        }));
      }

      // if (props.targetLabel === "well") {
      //   setStateApp((state) => ({ ...state, selectedWellId: rowData[0] }));
      //   setStateApp((state) => ({ ...state, selectedWell: rows[dataIndex] }));
      //   setSubComponent(<WellCardProvider />);
      //   setTitle(rows[dataIndex].wellName);
      //   setSubTitle(rows[dataIndex].operator);
      //   handleOpenExpandableCard();
      // }

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
    onChangePage: (pageState) => {
      console.log(`here: pageInd=${pageInd} pageState=${pageState}`);
      setPageInd(pageState);
    },
    customSort: (data, colIndex, order) => {
      if (props.parent === "production_WellDetails") {
        return data.sort((a, b) => { if (colIndex === 1) 
          { 
            const dateA = moment(moment(a.data[colIndex], "MM/YYYY")).valueOf();
            const dateB = moment(moment(b.data[colIndex], "MM/YYYY")).valueOf();
            return (dateA < dateB ? -1 : 1) * (order === "desc" ? 1 : -1);
          }  else { 
            return (a.data[colIndex] < b.data[colIndex] ? -1: 1 ) * (order === 'desc' ? 1 : -1); 
          }
        });
      } else {
        return data.sort((a, b) => { 
          return (a.data[colIndex] < b.data[colIndex] ? -1: 1 ) * (order === 'desc' ? 1 : -1); 
        });
      }
    },
    // onChangeRowsPerPage: (numberOfRows) => {
    //   console.log(numberOfRows);
      // if (props.total === true) {
      //   switch(props.parent) {
      //     case "production_WellDetails":
      //       let trimmed = rows.filter(item => item.ReportDate !== "Cumulative");
      //       setRows(displayCumulative(trimmed, props.total, cumulative));
      //       break;
      //     default:
      //       break;
      //   }
      // }
    // },
    // onColumnSortChange: (column, direction) => {
    //   if (props.total === true) {
    //     switch(props.parent) {
    //       case "production_WellDetails":
    //         let trimmed = rows.filter(item => item.ReportDate !== "Cumulative");
    //         setRows(trimmed);
    //         break;
    //       default:
    //         break;
    //     }
    //   }
    // },
    onTableChange: (action, tableState) => {
      if (props.header === "Contacts") {
        let filters = [];
        const leadSourceIndex = tableState.columns.findIndex(
          (i) => i.name === "leadSource"
        );
        const lastUpdateByIndex = tableState.columns.findIndex(
          (i) => i.name === "lastUpdateBy.name"
        );
        const tagsIndex = tableState.columns.findIndex(
          (i) => i.name === "tags"
        );

        if (tableState.filterList[leadSourceIndex]?.length !== 0) {
          filters.push({
            field: "leadSource",
            value: tableState.filterList[leadSourceIndex],
          });
        }
        if (tableState.filterList[lastUpdateByIndex]?.length !== 0) {
          filters.push({
            field: "lastUpdateBy.name",
            value: tableState.filterList[lastUpdateByIndex],
          });
        }
        if (tableState.filterList[tagsIndex]?.length !== 0) {
          filters.push({
            field: "tag.tag",
            value: tableState.filterList[tagsIndex],
          });
        }

        const pageVariables = {
          variables: {
            pagination: {
              first: tableState.rowsPerPage,
              after: null,
            },
            sort: tableState.activeColumn
              ? {
                  field:
                    tableState.columns[tableState.activeColumn]?.name ===
                    "fullContactAddress"
                      ? "address1"
                      : tableState.columns[tableState.activeColumn]?.name,
                  order:
                    tableState.columns[tableState.activeColumn]
                      ?.sortDirection === "asc"
                      ? 1
                      : -1,
                }
              : [],

            filters: filters,
            search: tableState.searchText,
          },
        };
        switch (action) {
          case "changeRowsPerPage":
            console.log("changeRowsPerPage");
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            setRowsPerPage(tableState.rowsPerPage);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            break;
          case "changePage":
            props.contactsPageProps.setLoading(true);
            props.contactsPageProps.getPaginatedContacts({
              ...pageVariables,
              variables: {
                ...pageVariables.variables,
                pagination: {
                  ...pageVariables.variables.pagination,
                  before:
                    props.rows && tableState.page < pageInd
                      ? props.rows[0]?._id
                      : null,
                  after:
                    props.rows && tableState.page > pageInd
                      ? props.rows[props.rows.length - 1]?._id
                      : null,
                },
                pageOverride: tableState.page
              },
            });
            break;
          case "sort":
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            break;
          case "search":
            delayedSearchRequest({
              tableState: tableState,
              setLoading: props.contactsPageProps.setLoading,
              getPaginatedContacts:
                props.contactsPageProps.getPaginatedContacts,
              getContactsFilterOptions:
                props.contactsPageProps.getContactsFilterOptions,
              pageVariables,
            });
            break;
          case "onSearchClose":
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            tableState.count = 0;
            setPageInd(tableState.page);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            props.contactsPageProps.getContactsFilterOptions();
            break;
          case "propsUpdate":
            console.log("work propsUpdate");
            break;
          case "filterChange":
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            break;
          case "resetFilters":
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            break;
          default:
            console.log("action not handled.");
        }
      }

      if (props.header === "Well Interests") {
        // let filters = [];
        // const leadSourceIndex = tableState.columns.findIndex(
        //   (i) => i.name === "leadSource"
        // );
        // const lastUpdateByIndex = tableState.columns.findIndex(
        //   (i) => i.name === "lastUpdateBy.name"
        // );
        // const tagsIndex = tableState.columns.findIndex(
        //   (i) => i.name === "tags"
        // );

        // if (tableState.filterList[leadSourceIndex]?.length !== 0) {
        //   filters.push({
        //     field: "leadSource",
        //     value: tableState.filterList[leadSourceIndex],
        //   });
        // }
        // if (tableState.filterList[lastUpdateByIndex]?.length !== 0) {
        //   filters.push({
        //     field: "lastUpdateBy.name",
        //     value: tableState.filterList[lastUpdateByIndex],
        //   });
        // }
        // if (tableState.filterList[tagsIndex]?.length !== 0) {
        //   filters.push({
        //     field: "tag.tag",
        //     value: tableState.filterList[tagsIndex],
        //   });
        // }

        const pageVariables = {
          variables: {
            pagination: {
              first: tableState.rowsPerPage,
              after: null,
            },
            sort: tableState.activeColumn
              ? {
                  field:
                    tableState.columns[tableState.activeColumn]?.name ===
                    "fullContactAddress"
                      ? "address1"
                      : tableState.columns[tableState.activeColumn]?.name,
                  order:
                    tableState.columns[tableState.activeColumn]
                      ?.sortDirection === "asc"
                      ? 1
                      : -1,
                }
              : [],

            filters: {
              field: "id",
              value: props.wellInterestsPageProps.ownerId,
            },
            // search: tableState.searchText,
          },
        };

        switch (action) {
          case "changeRowsPerPage":
            console.log("changeRowsPerPage");
            props.wellInterestsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            setRowsPerPage(tableState.rowsPerPage);
            props.wellInterestsPageProps.getPaginatedWellInterests(pageVariables);
            break;
          case "changePage":
            props.wellInterestsPageProps.setLoading(true);
            props.wellInterestsPageProps.getPaginatedWellInterests({
              ...pageVariables,
              variables: {
                ...pageVariables.variables,
                pagination: {
                  ...pageVariables.variables.pagination,
                  before:
                    props.rows && tableState.page < pageInd
                      ? props.rows[0]?.cursor
                      : null,
                  after:
                    props.rows && tableState.page > pageInd
                      ? props.rows[props.rows.length - 1]?.cursor
                      : null,
                },
              },
            });
            break;
          case "sort":
            props.wellInterestsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            props.wellInterestsPageProps.getPaginatedWellInterests(pageVariables);
            break;
          case "search":
            // delayedSearchRequest({
            //   tableState: tableState,
            //   setLoading: props.wellInterestsPageProps.setLoading,
            //   getPaginatedWellInterests:
            //     props.wellInterestsPageProps.getPaginatedWellInterests,
            //   getContactsFilterOptions:
            //     props.wellInterestsPageProps.getContactsFilterOptions,
            //   pageVariables,
            // });
            break;
          case "onSearchClose":
            // props.wellInterestsPageProps.setLoading(true);
            // tableState.page = 0;
            // tableState.count = 0;
            // setPageInd(tableState.page);
            // props.wellInterestsPageProps.getPaginatedWellInterests(pageVariables);
            // props.wellInterestsPageProps.getContactsFilterOptions();
            break;
          case "propsUpdate":
            console.log("work propsUpdate");
            break;
          case "filterChange":
            // props.wellInterestsPageProps.setLoading(true);
            // tableState.page = 0;
            // setPageInd(tableState.page);
            // props.wellInterestsPageProps.getPaginatedWellInterests(pageVariables);
            break;
          case "resetFilters":
            // props.wellInterestsPageProps.setLoading(true);
            // tableState.page = 0;
            // setPageInd(tableState.page);
            // props.wellInterestsPageProps.getPaginatedWellInterests(pageVariables);
            break;
          default:
            console.log("action not handled.");
        }
      }

      // else if (props.header === "Monthly Production") {
      //   switch(action) {
      //     case "propsUpdate":
      //       console.log(tableState.data);
      //       break;
      //     default:
      //       break;
      //   }
      // }
    },
  };

  if (props.header === "Well Interests") {
    console.log('props.header === "Well Interests"');
    options.rowsPerPageOptions = 
      props.wellInterestsPageProps.wellInterestsCount > 25
        ? [10, 25, 50, 100]
        : props.wellInterestsPageProps.wellInterestsCount > 10
        ? [10, 25]
        : [];
    options.count = props.wellInterestsPageProps.wellInterestsCount;
    options.serverSide = true;
  }

  if (props.header === "Contacts") {
    console.log('props.header === "Contacts"');
    options.rowsPerPageOptions =
      props.contactsPageProps.contactsCount > 25
        ? [10, 25, 50, 100]
        : props.contactsPageProps.contactsCount > 10
        ? [10, 25]
        : [];
    options.count = props.contactsPageProps.contactsCount;
    options.serverSide = true;
    options.print = false;
  }

  let history = useHistory();

  let routeChange = (route) => {
    history.push(route);
  };

  const displayCumulative = (data, total, cumulative) => {
    let rows = data;
      if (total === true && rows.length != 0) {
        let insertInBetween = options.rowsPerPage - 1;
        if (Object.entries(cumulative).length != 0) {
          let multiplier = rows.length / insertInBetween;
          for (let temp = 1; temp <= multiplier; temp++) {
            let insert_index = 0;
            if (temp != 1) {
              insert_index = temp * options.rowsPerPage;
              rows.splice(insert_index - 1, 0, cumulative);
            } else {
              rows.splice(insertInBetween, 0, cumulative);
            }
          };
          rows.push(cumulative)
        }
      }

    return rows;
  }

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        className={`${classes.table} ${
          rows && !props.loading ? "" : classes.loadingTable
        } ${columns && columns.length > 0 ? "" : classes.emptyTable}`}
      >
        <MUIDataTable
          className={props.targetLabel == "owner" ? customClassess.table : props.targetLabel == "production_detail"  ? productionClassess.table : classes.table}
          title={props.header}
          data={rows ? rows : []}
          columns={columns ? columns : []}
          
          options={{
            download:
              // props.targetLabel == "owner" || props.targetLabel == "well"
              //   ? true
              //   :
              false,
            ...options,
          }}
        />

        {/* <TransactDialog
          selectRowOpenContact={selectRowOpenContact}
          contactId={props.contactId}
        /> */}
        {openDialog && openDialog !== "addDeals" && (
          <Dialog
            className={classes.dialog}
            open={openDialog ? true : false}
            onClose={handleCloseDialog}
            fullWidth={
              openDialog === "comment" ||
              openDialog === "owner" ||
              openDialog === "wellsPerOwner" ||
              openDialog === "buyContactsInfo" ||
              openDialog === "sendMailers" ||
              openDialog === "printLabels" ||
              openDialog === "deleteUser" ||
              openDialog === "addParcelInterestsToEntity"
                ? true
                : false
            }
            maxWidth={
              openDialog === "owner" ||
              openDialog === "wellsPerOwner" ||
              openDialog === "ownerContacts"
                ? "xl"
                : openDialog === "owner" ||
                  openDialog === "ownersPerContacts" ||
                  openDialog === "wellsPerOwner" ||
                  openDialog === "owner" ||
                  openDialog === "wellsPerOwner" ||
                  openDialog === "addParcelInterestsToEntity"
                ? "lg"
                : openDialog === "addContact" ||
                  openDialog === "addOwnerToParcel" ||
                  openDialog === "deleteOwnersFromContact" ||
                  openDialog === "deleteContact" ||
                  openDialog === "deleteUser"
                ? "xs"
                : "sm"
            }
          >
            {openDialog === "comment" && (
              <Comments
                focus
                targetSourceId={expandedObject}
                targetLabel={
                  trueTargetLabel ? trueTargetLabel : props.targetLabel
                }
                multipleIds={
                  m1nSelectedRowsIndexes.indexOf(rowInd) !== -1 &&
                  m1nSelectedRowsIndexes.length > 1
                    ? removeDuplicatesIds(m1nSelectedRowsIds)
                    : null
                }
              />
            )}
            {openDialog === "tag" && (
              <div className={classes.tagsDiv}>
                <Tags
                  targetSourceId={expandedObject}
                  targetLabel={
                    trueTargetLabel ? trueTargetLabel : props.targetLabel
                  }
                  multipleIds={
                    m1nSelectedRowsIndexes.indexOf(rowInd) !== -1 &&
                    m1nSelectedRowsIndexes.length > 1
                      ? removeDuplicatesIds(m1nSelectedRowsIds)
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
            {openDialog === "makeOwnerAContact" && (
              <MakeItAContactConfirmationDialogContent
                targetLabel={props.targetLabel}
                onClose={handleCloseDialog}
                entity={expandedObject}
                openContactDetailCard={(contactId) => {
                  setTargetLabelToExpand("contact");
                  setSelectedRow({ _id: contactId });
                  setSubComponent(
                    <ContactDetailCard
                      selectRowOpenContact={selectRowOpenContact}
                      contactId={contactId}
                      handleCloseExpandableCard={handleCloseExpandableCard}
                    />
                  );
                  setTitle("CONTACT DETAILS");
                  setSubTitle(" ");
                  handleCloseDialog();
                  handleOpenExpandableCard();
                }}
              >
                {`Do you want to create a new Contact from this Owner?`}
              </MakeItAContactConfirmationDialogContent>
            )}

            {openDialog === "addContact" && props.targetLabel === "contact" && (
              <AddContactDialogContent
                onClose={handleCloseDialog}
                parent={props.addAble.parent}
              />
            )}

            {openDialog === "addOwnerToParcel" && (
              <AddParcelOwnerDialogContent
                onClose={handleCloseDialog}
                customLayerId={props.addAble.customLayerId}
              />
            )}
            {openDialog === "addParcelInterestsToEntity" && (
              <AddParcelToEntityDialogContent
                onClose={handleCloseDialog}
                entityId={props.addAble.entityId}
              />
            )}
            {openDialog === "deleteOwnersFromContact" && (
              <DeleteConfirmationDialogContent
                header="Delete Owner(s)"
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to permanently delete the owner${
                  m1nSelectedRowsIds &&
                  m1nSelectedRowsIds.length > 1 &&
                  removeDuplicatesIds(m1nSelectedRowsIds).length > 1
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
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {props.header === "Owner's Contacts" &&
                  `Do you want to remove the contact${
                    m1nSelectedRowsIds &&
                    m1nSelectedRowsIds.length > 1 &&
                    removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                      ? "s"
                      : ""
                  } from this owner?`}

                {props.header === "Contacts" &&
                  `Do you want to delete the selected contact${
                    m1nSelectedRowsIds &&
                    m1nSelectedRowsIds.length > 1 &&
                    removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                      ? "s"
                      : ""
                  }?`}
              </DeleteConfirmationDialogContent>
            )}
            {openDialog === "deleteParcelOwnership" && (
              <DeleteConfirmationDialogContent
                header={`Delete Owner${
                  m1nSelectedRowsIds &&
                  m1nSelectedRowsIds.length > 1 &&
                  removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                    ? "s"
                    : ""
                }`}
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to delete the owner${
                  m1nSelectedRowsIds &&
                  m1nSelectedRowsIds.length > 1 &&
                  removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                    ? "s"
                    : ""
                }?`}
              </DeleteConfirmationDialogContent>
            )}
            {openDialog === "deleteParcelInterest" && (
              <DeleteConfirmationDialogContent
                header={`Delete Parcel Interest${
                  m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                }`}
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to delete the Parcel Interest${
                  m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                }?`}
              </DeleteConfirmationDialogContent>
            )}

            {openDialog === "deleteDeal" && (
              <DeleteConfirmationDialogContent
                header={`Delete Deal${
                  m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                }`}
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to delete the selected deal${
                  m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
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
            {openDialog === "inviteUser" && (
              <InviteUserDialog
                rows={rows}
                setRows={setExpandedObject}
                onClose={handleCloseDialog}
              />
            )}
            {openDialog === "reinviteUser" && (
              <ReinviteUserDialog
                selectedUser={selectedUser}
                setRows={setExpandedObject}
                onClose={handleCloseDialog}
                onCloseMenu={closeMenu}
              />
            )}
            {openDialog === "deleteUser" && (
              <DeleteConfirmationDialogContent
                header={`Delete User${
                  m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                }`}
                onClose={handleCloseDialog}
                deleteFunc={() => {
                  props.deleteFunc(selectedUser.id);
                  closeMenu();
                }}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {selectedUser !== null
                  ? `Remove '${selectedUser.displayName}' from list?`
                  : `Are you sure you want to delete selected user${
                      m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1
                        ? "s"
                        : ""
                    }?`}
              </DeleteConfirmationDialogContent>
            )}
          </Dialog>
        )}
        
        {showExpandableCard && targetLabelToExpand !== "well" && (
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
                    targetLabelToExpand === "owner" ||
                    targetLabelToExpand === "well" ||
                    (!targetLabelToExpand &&
                      (props.targetLabel === "owner" ||
                        props.targetLabel === "well"))
                      ? selectedRow.id
                      : selectedRow._id
                  }
                  targetLabel={
                    targetLabelToExpand ? targetLabelToExpand : props.targetLabel
                  }
                  noTrackAvailable={
                    targetLabelToExpand === "contact" ||
                    (!targetLabelToExpand && props.targetLabel === "contact")
                      ? true
                      : false
                  }
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
      {isUMSettings}
    </div>
  );
}

export default React.memo(SubTable, deepEqualObjects);
