import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Fragment,
} from "react";
import {
  TextField,
} from "@material-ui/core";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandableCardProvider from "../../../ExpandableCard/ExpandableCardProvider";
import WellCardProvider from "../../../WellCard/WellCardProvider";
import ContactDetailCard from "../../../ContactDetailCard/ContactDetailCard";
import { AppContext } from "../../../../AppContext";
import Tags from "../../Tagger";
import Comments from "../../Comments";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable, { TableFilterList } from "mui-datatables";
import { DndProvider } from 'react-dnd';
import { Box, IconButton, Menu, MenuItem, Select } from "@material-ui/core";
import TrackToggleButton from "../../TrackToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import ChatIcon from "@material-ui/icons/Chat";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import M1nTable from "../M1nTable";
import WellIcon from "../../svgIcons/well";
import Contact from "../../svgIcons/contact";
import ArrowRight from "../../svgIcons/arrow-right";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import AddContactDialogContent from "./SubComponents/AddContactDialogContent";
import DeleteConfirmationDialogContent from "./SubComponents/DeleteConfirmationDialogContent";
import MakeItAContactConfirmationDialogContent from "./SubComponents/MakeItAContactConfirmationDialogContent";
import Button from "@material-ui/core/Button";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import ContactPhoneRoundedIcon from "@material-ui/icons/ContactPhoneRounded";
import BuyContactsInfoDialogContent from "./SubComponents/BuyContactsInfoDialogContent";
import PrintLabelsDialogContent from "./SubComponents/PrintLabelsDialogContent";
import SendMailersDialogContent from "./SubComponents/SendMailersDialogContent";
import BackupIcon from "@material-ui/icons/Backup";
import { anyToDate, height } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import CellContentEdition from "./SubComponents/CellContentEdition";
import Avatar, { ConfigProvider } from "react-avatar";
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
import ParcelScreenIcon from "../../svgIcons/parcelScreen";
import ParcelsDetailCard from "../../../ParcelsDetailCard/ParcelsDetailCard";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { WELLQUERY } from "../../../../graphQL/useQueryWell";
import { useLazyQuery } from "@apollo/client";
import WellTableStyles from "../customStyles/WellTableStyle";
import ParcelOwnershipStyles from "../customStyles/ParcelOwnership";
import ProductionTableStyle from "../customStyles/ProductionDetailsStyle";
import moment from "moment";
import CheckIcon from "@material-ui/icons/Check";
import MergeContactDrawer from "./SubComponents/MergeContactDrawer";
import MultipleOwnerToContactDrawer from "./SubComponents/MultipleOwnerToContactDrawer";
import Chip from '@material-ui/core/Chip';
import FilterIcon from "../../svgIcons/filter";
import ViewColumnIcon from "../../svgIcons/view_column";
import ButtonDropDown from "./ButtonGroup"
// import value formatters 
import capitalizeFirstLetter from "../../../Shared/valueformatters/capitalize-first-letter.js";
import vf_currency from "../../../Shared/valueformatters/vf_currency.js";
import ticksToDateString from "../../../Shared/valueformatters/ticks-to-string.js";
import RightDialog from "../../../ContactDetailCard/components/RightDialog"


// queries 
import { OWNERSLATSLONS } from "../../../../graphQL/useQueryOwnerLatsLonsArray";
import { OPERATORSLATSLONS } from "../../../../graphQL/useQueryOperatorLatsLonsArray";
import { LEASELATSLONS } from "../../../../graphQL/useQueryLeaseLatsLonsArray";
import { CONTACTWELLS } from "../../../../graphQL/useQueryContactWells";

// suppress debug console logs
DndProvider.whyDidYouRender = false

const removeDuplicatesIds = (selectedRowsIds) => [...new Set(selectedRowsIds)];

const customStyles = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-body": {
      padding: (props) =>
        props.dense ? "0 !important" : "0px 16px !important",
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
          padding: 0,
        },
      },
      "& td:nth-child(3)": {
        "& div": {
          width: 300,
        },
      },
      "& td:nth-child(13)": {
        "& div": {
          width: 300,
          "& span": {
            maxWidth: 300,
          },
        },
      },
    },
    "& thead": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
    },
    "& tbody": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
    },
  },
}));

const productionStyle = makeStyles((theme) => ({
  table: {
    "& .MuiTableCell-body": {
      padding: (props) =>
        props.dense ? "0 !important" : "0px 16px !important",
    },
    "& .MuiTableCell-head": {
      "& span": {
        justifyContent: "center",
      },
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
        textAlign: "center",
        "& div": {
          justifyContent: "center",
        },
      },
    },
    "& thead": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
    },
    "& tbody": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
    },
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    "& .MuiTableBody-root": {
      height: '50px',
    },
    "& .MuiPaper-root > .MuiToolbar-gutters": {
      paddingLeft: '11px !important'
    },
    "& .MuiPaper-elevation1": {
      flexDirection: "row !important" ,
      height: '65px !important',
      width: '100% !important',
      display: 'flex !important',
      flex: 'auto',
      alignItems: 'center !important'
    },
    "& .MuiButton-text": {
      padding: "5px 12px"
    },
    "& .Mui-disabled": {
      backgroundColor: "transparent",
    },
    "& .MuiToolbar-root": {
      backgroundColor: "#F2F2F2",
      borderBottom: '1px solid rgba(224, 224, 224, 1)'
    },
    "& .MuiToolbar-regular > div:nth-child(2) .MuiIconButton-root": {
      backgroundColor: "#D4E8F1",
    },
    "& .MuiToolbar-regular > div:nth-child(2)": {
      flex: '0 1 auto',
    },
    "& .MuiTableCell-body": {
      padding: (props) => (props.dense ? "0 !important" : "12px 16px"),
    },
    "& .MuiTableHead-root": {
      "& th": {
        backgroundColor: "#F2F2F2",
        zIndex: "auto",
        padding: (props) => (props.dense ? "10px" : null),
        "& button":{
          "& .MuiButton-label":{
              textAlign:'left'
          }
        }
      },
      "& .MuiTableCell-paddingCheckbox": {
        padding: (props) => (props.dense ? "0 !important" : "16px"),
      },
    },
    "& tr": {
      paddingRight: (props) => (props.dense ? "12px" : null),
      "& td": {
        // "& div": {
        //   padding: (props) =>
        //     (props.parent === "ownersPerParcel" ||
        //       props.parent === "ownersPerParcelWells") &&
        //     "0 5px !important",
        //   width: (props) =>
        //     (props.parent === "ownersPerParcel" ||
        //       props.parent === "ownersPerParcelWells") &&
        //     "max-content !important",
        //   maxWidth: (props) =>
        //     (props.parent === "ownersPerParcel" ||
        //       props.parent === "ownersPerParcelWells") &&
        //     "300px !important",
        // },
      },
    },
    "& thead": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
      zIndex: 999,
      position: 'sticky'
    },
    "& tbody": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
      height: "50px"
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
    margin: "0px 5px",
    fontWeight: "600",
    backgroundColor: "rgba(1, 17, 51, 1)",
    color: "#fff",
    border: '1px solid #B3B3B3',
    "&:hover":{
      backgroundColor: "#263451",
      color: "#fff",
    }
  },
  monetizationIcon: {
    margin: "10px",
    color: "#155388",
  },
  blue: { color: theme.palette.secondary.main, fontWeight: "bold" },
  customDropDown: {
    height: "31px",
    // border: "1px solid red",
    display: "inline",
    left: "223px",
    position: "absolute",
    top: "19px"
  },
  clickableCell: {
    cursor: "pointer",
    padding: "10px 30px 10px 10px",
    position: "relative",
    minWidth: "100px",
    borderRadius: "7px",
    color: "#17aadd",
    "&:hover": {
      textDecoration: "underline",
    },
    fontWeight: "bold"
  }
}));

var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 21,
});

const myTheme = createMuiTheme({
  overrides: {
    MUIDataTable: {
      responsiveScroll: {
        maxHeight: '80px'
      }
    }
  }
});

function SubTable(props) {
  const classes = useStyles(props);
  const wellTableClass = WellTableStyles(props);
  const parcelTableClass = ParcelOwnershipStyles(props);
  const productionClass = ProductionTableStyle(props);

  const dispatch = useDispatch();

  // contexts 
  const [stateApp, setStateApp] = useContext(AppContext);


  // function state 
  const [trueTargetLabel, TrueTargetLabel] = useState(null);
  const [rowsPerPage, RowsPerPage] = useState(props.startPaginationAt);
  const [firstMount, FirstMount] = useState(true);
  const [title, Title] = useState("");
  const [subTitle, SubTitle] = useState("");
  const [m1nSelectedRowsIndexes, M1nSelectedRowsIndexes] = useState([]);
  const [m1nSelectedRowsIds, M1nSelectedRowsIds] = useState([]);
  const [m1nSelectedRowsTracks, M1nSelectedRowsTracks] = useState([]);
  const [subComponent, SubComponent] = useState(null);
  const [targetLabelToExpand, TargetLabelToExpand] = useState(null);
  const [multipleExpandableCard, MultipleExpandableCard] = useState(false);
  const [selectedRow, SelectedRow] = useState();
  const [showExpandableCard, ShowExpandableCard] = useState(false);
  const [openDialog, OpenDialog] = useState(false);
  const [expandedObject, ExpandedObject] = useState();
  const [pageInd, PageInd] = useState(0);
  const [rowInd, RowInd] = useState();
  const [colInd, ColInd] = useState();
  const [viewColumns, ViewColumns] = useState([]);
  const [cumulative, Cumulative] = useState({});
  const [columns, setColumns] = useState([]);
  const [tableStyle, setTableStyle] = useState(classes);
  const [year, setYear] = React.useState(2020);
  const [total, Total] = useState(false);
  const [rows, Rows] = useState([]);

  // deep state 
  const setFirstMount = (newState) => { setStateIfDeepEqual(FirstMount, newState); };
  const setRowsPerPage = (newState) => { setStateIfDeepEqual(RowsPerPage, newState); };
  const setTrueTargetLabel = (newState) => { setStateIfDeepEqual(TrueTargetLabel, newState); };
  const setM1nSelectedRowsTracks = (newState) => { setStateIfDeepEqual(M1nSelectedRowsTracks, newState); };
  const setM1nSelectedRowsIds = (newState) => { setStateIfDeepEqual(M1nSelectedRowsIds, newState); };
  const setM1nSelectedRowsIndexes = (newState) => { setStateIfDeepEqual(M1nSelectedRowsIndexes, newState); };
  const setSubTitle = (newState) => { setStateIfDeepEqual(SubTitle, newState); };
  const setTitle = (newState) => { setStateIfDeepEqual(Title, newState); };
  const setTargetLabelToExpand = (newState) => { setStateIfDeepEqual(TargetLabelToExpand, newState); };
  const setSubComponent = (newState) => { setStateIfDeepEqual(SubComponent, newState); };
  const setSelectedRow = (newState) => { setStateIfDeepEqual(SelectedRow, newState); };
  const setMultipleExpandableCard = (newState) => { setStateIfDeepEqual(MultipleExpandableCard, newState); };
  const setShowExpandableCard = (newState) => { setStateIfDeepEqual(ShowExpandableCard, newState); };
  const setColInd = (newState) => { setStateIfDeepEqual(ColInd, newState); };
  const setRowInd = (newState) => { setStateIfDeepEqual(RowInd, newState); };
  const setPageInd = (newState) => { setStateIfDeepEqual(PageInd, newState); };
  const setExpandedObject = (newState) => { setStateIfDeepEqual(ExpandedObject, newState); };
  const setOpenDialog = (newState) => { setStateIfDeepEqual(OpenDialog, newState); };
  const setTotal = (newState) => { setStateIfDeepEqual(Total, newState); };
  const setCumulative = (newState) => { setStateIfDeepEqual(Cumulative, newState); };
  const setViewColumns = (newState) => { setStateIfDeepEqual(ViewColumns, newState); };
  const setRows = (newState) => { setStateIfDeepEqual(Rows, newState); };

  // queries 
  const [getWell, { data: dataWell }] = useLazyQuery(WELLQUERY);
  const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(OWNERSLATSLONS);
  const [getOperatorWells, { data: dataOperatorWells }] = useLazyQuery(OPERATORSLATSLONS);
  const [getLeaseWells, { data: dataLeaseWells }] = useLazyQuery(LEASELATSLONS);
  const [getContactsWells, { data: dataContactWells }] = useLazyQuery(CONTACTWELLS);


  // handlers 
  const handleWellFlyTo = (value) => {

    // setting state to fly to the selected well 
    setStateApp((stateApp) => ({
      ...stateApp,
      fitBounds: null,
      selectedWell: null,
      selectedWellId: value.wellId ? value.wellId.toLowerCase() : null,
      wellSelectedCoordinates: [value.center[0], value.center[1]],
      wellListFromSearch: [
        {
          id: value.wellId,
          longitude: value.center[0],
          latitude: value.center[1],
        },
      ],
    }));
    stateApp.toggleLayersActivity("Search", true);

  };


  const handleOwnerFlyTo = (value) => {
    getOwnerWells({
      variables: {
        ownerId: value.objToPopulateSearchLayer.objectId,
      },
    });
  };

  const handleOperatorFlyTo = (value) => {
    getOperatorWells({
      variables: {
        operatorName: value.objToPopulateSearchLayer.objectName,
      },
    });
  };

  const handleLeaseFlyTo = (value) => {
    if (value.objToPopulateSearchLayer.objectName
      && value.objToPopulateSearchLayer.objectName !== "") {
      getLeaseWells({
        variables: {
          fieldName: "Lease",
          value: value.objToPopulateSearchLayer.objectName,
        },
      });
    } else {
      getLeaseWells({
        variables: {
          fieldName: "LeaseId",
          value: value.objToPopulateSearchLayer.objectId,
        },
      });
    }

  };



  const handleClickFlyToIcon = (entityType, searchTarget) => {
    console.log('entity type', entityType)
    if (entityType == "well") {
      handleWellFlyTo(searchTarget)
    }
    if (entityType == "owner") {
      handleOwnerFlyTo(searchTarget)
    }
    if (entityType == "operator") {
      handleOperatorFlyTo(searchTarget)
    }
    if (entityType == "lease") {
      handleLeaseFlyTo(searchTarget)
    }
  };




  //// opening the well detail card after fetch the extra well data needed
  useEffect(() => {
    if (
      props.parent &&
      (props.parent === "search" || props.parent === "owner_WellInterests" || props.parent === "assocTaxRollInterests") &&
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
    if (dataOwnerWells && dataOwnerWells.ownerLatsLonsArray) {
      if (dataOwnerWells.ownerLatsLonsArray.length !== 0) {
        setStateApp((stateApp) =>
          dataOwnerWells.ownerLatsLonsArray.length === 1
            ? {
              ...stateApp,
              selectedWell: null,
              fitBounds: null,
              selectedWellId: dataOwnerWells.ownerLatsLonsArray[0].id.toLowerCase(),
              wellSelectedCoordinates: [
                dataOwnerWells.ownerLatsLonsArray[0].longitude,
                dataOwnerWells.ownerLatsLonsArray[0].latitude,
              ],
              wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray],
            }
            : {
              ...stateApp,
              fitBounds: null,
              wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray],
            }
        );
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
      }
    }
  }, [dataOwnerWells]);


  useEffect(() => {
    // effect to fly to the operator wells  
    // i duplicated this code to get things moving 
    // will probably need to be combined w/ code in search.js 

    if (dataOperatorWells && dataOperatorWells.operatorLatsLonsArray) {
      if (dataOperatorWells.operatorLatsLonsArray.length !== 0) {

        setStateApp((stateApp) =>
          dataOperatorWells.operatorLatsLonsArray.length === 1
            ? {
              ...stateApp,
              selectedWell: null,
              fitBounds: null,
              selectedWellId: dataOperatorWells.operatorLatsLonsArray[0].id.toLowerCase(),
              wellSelectedCoordinates: [
                dataOperatorWells.operatorLatsLonsArray[0].longitude,
                dataOperatorWells.operatorLatsLonsArray[0].latitude,
              ],
              wellListFromSearch: [
                ...dataOperatorWells.operatorLatsLonsArray,
              ],
            }
            : {
              ...stateApp,
              fitBounds: null,
              wellListFromSearch: [
                ...dataOperatorWells.operatorLatsLonsArray,
              ],
            }
        );
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
      }
    }
  }, [dataOperatorWells]);

  useEffect(() => {
    // effect to fly to the lease wells  
    // i duplicated this code to get things moving 
    // will probably need to be combined w/ code in search.js 

    if (dataLeaseWells && dataLeaseWells.leaseLatsLonsArray) {
      if (dataLeaseWells.leaseLatsLonsArray.length !== 0) {


        setStateApp((stateApp) =>
          dataLeaseWells.leaseLatsLonsArray.length === 1
            ? {
              ...stateApp,
              selectedWell: null,
              fitBounds: null,
              selectedWellId: dataLeaseWells.leaseLatsLonsArray[0].id.toLowerCase(),
              wellSelectedCoordinates: [
                dataLeaseWells.leaseLatsLonsArray[0].longitude,
                dataLeaseWells.leaseLatsLonsArray[0].latitude,
              ],
              wellListFromSearch: [...dataLeaseWells.leaseLatsLonsArray],
            }
            : {
              ...stateApp,
              fitBounds: null,
              wellListFromSearch: [...dataLeaseWells.leaseLatsLonsArray],
            }
        );
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
      }
    }
  }, [dataLeaseWells]);


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
        let calc_keys = [
          "oil",
          "gas",
          "water",
          "allocatedOil",
          "allocatedWater",
          "allocatedGas",
        ];
        let current_keys = [];
        if ([...props.rows].length != 0) {
          let keys = Object.keys([...props.rows][0]);
          current_keys = calc_keys.filter((value) => keys.includes(value));
        }
        temp = computeCumulative(current_keys, [...props.rows]);
        switch (props.parent) {
          case "production_WellDetails":
            let reconstruct_row = {
              ...props.rows[0],
              ...temp,
            };
            Object.keys(reconstruct_row).forEach((key) => {
              if (!calc_keys.includes(key)) {
                reconstruct_row[key] = "";
              }
            });
            reconstruct_row["ReportDate"] = "Cumulative";
            setRows(
              displayCumulative([...props.rows], props.total, reconstruct_row)
            );
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
    data.forEach((row) => {
      keys.forEach((key) => {
        if (ret_val[key]) {
          ret_val[key] = ret_val[key] + parseFloat(row[key]);
        } else {
          ret_val[key] = parseFloat(row[key]);
        }
      });
    });
    return ret_val;
  };

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
                      className={`${classes.icons} ${colInd === tableMeta.columnIndex &&
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
                              if (props.parent === "owner_WellInterests") {
                                selectedWell.id = selectedWell.wellId;
                                delete selectedWell.wellId;
                              }
                              setSelectedRow(selectedWell);
                              setStateApp((state) => ({
                                ...state,
                                selectedWellId:
                                  props.parent === "owner_WellInterests"
                                    ? tableMeta.rowData[1]
                                    : tableMeta.rowData[0],
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

                    // this whole implementation is a mesteban patch 
                    // it is all kinds of fucked up 

                    <Tooltip
                      title={
                        "Fly To Map"
                      }
                      placement="top"
                      style={{ marginRight: "10px" }}
                    >
                      <IconButton
                        id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickFlyToIcon(props.targetLabel, value)
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
                      : props.parent === "owner_WellInterests"
                        ? tableMeta.rowData[1]
                        : props.parent === "ownersPerParcel"
                          ? tableMeta.rowData[1]
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
                      : props.parent === "owner_WellInterests"
                        ? tableMeta.rowData[1]
                        : props.parent === "ownersPerParcel"
                          ? tableMeta.rowData[1]
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
                          className={`${classes.icons} ${!value || value === 0 ? classes.noCommentsIcon : ""
                            } ${colInd === tableMeta.columnIndex &&
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
                          className={`${classes.icons} ${!value || value.length === 0
                            ? classes.noOwnersIcon
                            : ""
                            } ${colInd === tableMeta.columnIndex &&
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

          case "isContact":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  if (
                    (props.targetLabel == "deal" ||
                      props.targetLabel == "activity") &&
                    value === null
                  ) {
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
                  }

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
                        className={`${classes.icons} ${!value || value === "false"
                          ? classes.noCommentsIcon
                          : ""
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open same model for single contact as we have in multi contact

                          if ((!value || value === "false") && (m1nSelectedRowsIndexes?.length === 0)) {
                            m1nSelectedRowsIndexes.push(tableMeta.rowIndex)
                          }
                          if (m1nSelectedRowsIndexes?.length > 0) {
                            const selectedRows = m1nSelectedRowsIndexes.map((index) => rows[index]);
                            return handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, selectedRows, "multipleOwnerToContact");
                          }

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
                                handleCloseExpandableCard={
                                  handleCloseExpandableCard
                                }
                              />
                            );
                            setTitle("Contact Details");
                            setMultipleExpandableCard(true);
                            setSubTitle(" ");
                            handleOpenExpandableCard();
                          } else {
                            // Code is not used as we are opening different model from above
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
                            }
                            else if (props.targetLabel == "Parcel Ownership") {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                {
                                  globalOwner:
                                    props.parent === "ownersPerParcel"
                                      ? tableMeta.rowData[9]
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
                            // Code is not used as we are opening different model from above
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
                          className={`${classes.icons} ${!value ? classes.noOwnersIcon : ""
                            } ${colInd === tableMeta.columnIndex &&
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
                          className={`${classes.icons} ${!value || value.length === 0
                            ? classes.noOwnersIcon
                            : ""
                            }  ${colInd === tableMeta.columnIndex &&
                              rowInd === tableMeta.rowIndex
                              ? classes.iconSelected
                              : ""
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (value.length > 0) {
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
                      : props.parent === "owner_WellInterests"
                        ? tableMeta.rowData[1]
                        : props.parent === "ownersPerParcel"
                          ? tableMeta.rowData[1]
                          : tableMeta.rowData[0];

                  return (
                    <div style={{ marginRight: "10px" }}>
                      <Tooltip
                        title={value && value[1] === 0 ? "Add Tags" : "Tags"}
                        placement="top"
                      >
                        <Badge
                          id={id + targetSourceId + tableMeta.rowIndex}
                          className={`${classes.TagSample} ${colInd === tableMeta.columnIndex &&
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
                  return (
                    <span style={{ paddingLeft: 10, paddingRight: 10 }}>
                      {value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  );
                } else {
                  return (
                    <span style={{ paddingLeft: 10, paddingRight: 10 }}>0</span>
                  );
                }
              },
            };
            break;
          default:
            //// this is where the column names get mapped 
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {


                  const valueFormatter = (v) => {
                    if (
                      (column.name === "status" &&
                        props.targetLabel === "deal") ||
                      (column.name === "type" &&
                        props.targetLabel === "activity")
                    )
                      return capitalizeFirstLetter(v);

                    if (column.name === "appraisedValue")
                      return vf_currency(v);

                    if (column.name === "taxValue")
                      return vf_currency(v);

                    if (column.name === "offerPrice" && !!v && !isNaN(v))
                      return vf_currency(v);

                    if (column.name === "lastUpdateAt")
                      return anyToDate(v).toLocaleString("en-US", {
                        year: "numeric",
                        day: "numeric",
                        month: "numeric",
                      });

                    if (column.name === "closeDate" && !!v)
                      return moment.parseZone(v).format("MM/DD/yyyy");

                    if (
                      (column.name === "end" || column.name === "start") &&
                      !!v
                    )
                      return anyToDate(v).toLocaleString("en-US", {
                        year: "numeric",
                        day: "numeric",
                        month: "numeric",
                        minute: "2-digit",
                        hour: "2-digit",
                      });

                    return v;
                  };

                  if (
                    column.name === "isClosed" &&
                    props.targetLabel === "activity" &&
                    value === true
                  )
                    return (
                      <div style={{ textAlign: "center" }}>
                        <CheckIcon />
                      </div>
                    );

                  if (
                    column.name === "isClosed" &&
                    props.targetLabel === "activity" &&
                    value === false
                  )
                    return (
                      <div style={{ textAlign: "center" }}>
                        {/* <CheckBoxOutlineBlankIcon /> */}
                      </div>
                    );

                  ////// if non editable column
                  if (
                    (!column.editable &&
                      props.targetLabel === "Parcel Ownershipship" &&
                      column.name === "name" &&
                      tableMeta.rowData[11] !== "false") ||
                    ((column.name === "end" || column.name === "start") &&
                      props.targetLabel === "activity")
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
                          --
                        </p>
                      );

                    //// if value
                    return (
                      <div
                        style={
                          props.targetLabel === "activity"
                            ? { minWidth: "175px" }
                            : {}
                        }
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
                    <div
                      style={{ display: "flex", alignItems: "center", justifyContent: "left" }}
                      className={props.parent === "assocTaxRollInterests" && (!tableMeta.rowData[14] || tableMeta.rowData[19]) ? [classes.blue] : []}
                    >

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
                      {props.targetLabel !== "contact" &&
                        (
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
                        )}
                      {props.targetLabel === "contact" &&
                        column.name !== "name" && (
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
                        )}
                      {props.targetLabel === "contact" &&
                        column.name === "name" && (
                          <p className={classes.clickableCell}
                            onClick={() => {
                              setStateApp((stateApp) => ({
                                ...stateApp,
                                selectedContact: tableMeta.rowData[0],
                              }));

                              setSubComponent(
                                <ContactDetailCard
                                  selectRowOpenContact={selectRowOpenContact}
                                  handleCloseExpandableCard={handleCloseExpandableCard}
                                />
                              );
                              setTitle("Contact Details");
                              setSubTitle(" ");
                              handleOpenExpandableCard();
                            }}
                          >{value}</p>
                        )}


                      {/* temporarily removing the purchased data icon as we do not have functionality to actually purchase contact data currently - KC 3/17/21 */}
                      {/* {props.targetLabel === "contact" &&
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
                        )} */}
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
  };

  const handleCloseExpandableCard = () => {
    if (targetLabelToExpand === "contact") {
      setMultipleExpandableCard(false);
      setTargetLabelToExpand("well");
    } else {
      setShowExpandableCard(false);
      setTargetLabelToExpand(null);
      setStateApp((state) => ({
        ...state,
        popupOpen: false,
        expandedCard: false,
      }));
    }
  };

  // 'view contact' on deals modal
  const selectRowOpenContact = (contact) => {
    const rowIndex = rows.findIndex((r) => r._id === contact._id);
    const row = rows[rowIndex];
    setSelectedRow(rows);
    setStateApp((stateApp) => ({
      ...stateApp,
      selectedContact: row._id,
    }));

    setSubComponent(
      <ContactDetailCard
        selectRowOpenContact={selectRowOpenContact}
        handleCloseExpandableCard={handleCloseExpandableCard}
      />
    );
    setTitle("Contact Details");
    setSubTitle(" ");
    handleOpenExpandableCard();
  };

  let history = useHistory();

  let routeChange = (route) => {
    history.push(route);
  };

  useEffect(() => {
    if (props.targetLabel) {
      let ret_val = null;
      switch (props.targetLabel) {
        case 'owner':
          ret_val = wellTableClass.table;
          break;
        case "production_detail":
          ret_val = productionClass.table;
          break;
        case "Parcel Ownership":
          ret_val = parcelTableClass.table;
          break;
        default:
          ret_val = classes.table;
          break;
      }
      setTableStyle(ret_val);
    }
  }, [props.targetLabel]);

  const options = {
    filterType: "dropdown",
    rowsPerPage: rowsPerPage ? rowsPerPage : 25,
    rowsPerPageOptions:
      props.rows && props.rows.length > 25
        ? [10, 25, 50, 100]
        : props.rows && props.rows.length > 10
          ? [10, 25]
          : [],
    selectableRows:
      props.targetLabel == "production_detail" ? false : "multiple",
    print: false,
    download: props.parent == "OwnersPerWell" ? true : false,
    viewColumns: props.targetLabel !== "usermanagement",

    onColumnViewChange: (changedColumn, action) => {
      if (
        props.parent === "Contacts" &&
        columns &&
        (action == "add" || action == "remove") &&
        changedColumn
      )
        props.setColumnsBase([
          ...columns.map((column) => {
            if (column.name == changedColumn)
              if (action == "add")
                return {
                  ...column,
                  options: column.options
                    ? { ...column.options, display: true }
                    : {
                      display: true,
                    },
                };
              else
                return {
                  ...column,
                  options: column.options
                    ? { ...column.options, display: false }
                    : {
                      display: false,
                    },
                };

            return column;
          }),
        ]);
    },
    //// triggers when a row/s is selected ////
    onRowSelectionChange: (currentRowsSelected, rowsSelected) => {
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
              if (props.parent === "owner_WellInterests") return row.wellId;
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
                <div
                  style={{
                    marginTop: "6px",
                    height: "35px",
                    display: "flex",
                  }}
                >
                {props.header !== "Active Users" && (
                  <>
                    {/* {m1nSelectedRowsIndexes?.length > 1 && ( */}
                      <Button
                        color="secondary"
                        startIcon={<MergeTypeIcon />}
                        className={classes.multiSelectionTopBarButtons}
                        disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length <= 1}
                        onClick={() => {
                          handleExpandClick(
                            null,
                            null,
                            getSelectedRows(),
                            "merge"
                          );
                        }}
                      >
                        Merge
                      </Button>
                    {/* )} */}

                    {/* temporary comment out until melissa is back */}
                    {/* <Button
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
                      </Button> */}
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

      console.log('props addable type', props.addAble.type)
      var buttonLabel = "+ ADD"; 
      if (props.addAble.type === "contact"){buttonLabel = '+ ADD CONTACT'}
      if (props.addAble.type === "wellInterest"){buttonLabel = '+ ADD INTEREST'}
      if (props.addAble.type === "deals"){buttonLabel = '+ ADD DEAL'}
      if (props.addAble && props.parent === "UserManagement"){buttonLabel = "+ ADD USER"}
      if (props.addAble.type === "ownerToParcel"){buttonLabel = '+ ADD INTEREST OWNER'}


      const addAction = (e) => {
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

        if (props.addAble.type && props.addAble.type === "wellInterest") {
          setStateApp((stateApp) => ({
            ...stateApp,
            wellInterestDialog: true,
            //activeDeal: { cardId: null, laneId: null },
          }));
        }

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
      }


      const options = [
        { 
          text: buttonLabel,
          isShow: false,
          action: addAction
        },
        {  text: 'Import Contacts', isShow: true, action: () => routeChange("/bulkupload") }
      ];

      const getSelectedRows = () => {
        const selectedRows = [];
        for (let i = 0; i < m1nSelectedRowsIndexes.length; i++) {
          selectedRows.push(rows[m1nSelectedRowsIndexes[i]]);
        }
        return selectedRows;
      };

      return (
        <>
        <div style={{ display: 'inline', float: 'left', marginRight: '15px',  marginTop: '5px'}}>
          {(props.addAble.type === "wellInterest" 
          || props.addAble.type === "deals"
          || props.addAble.type === "ownerToParcel"
          || (props.addAble && props.parent === "UserManagement"))
          
          && (
            <Button
              color="secondary"
              className={classes.multiSelectionTopBarButtons}
              onClick={addAction}
            >
              {buttonLabel}
            </Button>
          )}
          {props.addAble.type === "contact" && (<ButtonDropDown options={options} />)}

          
          {
          props.addAble.type === "contact" && (
            <>
              <Button
                color="secondary"
                startIcon={<MergeTypeIcon />}
                className={classes.multiSelectionTopBarButtons}
                disabled
              >
                Merge
              </Button>
              <Button
                color="secondary"
                startIcon={<EmailRoundedIcon />}
                className={classes.multiSelectionTopBarButtons}
                disabled
              >
                Mailers
              </Button>
            </>
          )
          }
        </div>
        </>
      );
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setSelectedRow(rows[dataIndex]);

      if (props.targetLabel === "deal") {
        let card = { ...rows[dataIndex] };
        delete card["dealStage"];
        setStateApp((stateApp) => ({
          ...stateApp,
          dealDialog: true,
          activeDeal: card,
        }));
      }

      if (props.parent === "assocTaxRollInterests") {
        let card = { ...rows[dataIndex] };
        setStateApp((stateApp) => ({
          ...stateApp,
          wellInterestDialog: true,
          activeWellInterest: card,
        }));
      }

      if (props.targetLabel === "activity") {
        if (rows[dataIndex]?._id)
          setStateApp((stateApp) => ({
            ...stateApp,
            selectedActivityId: rows[dataIndex]._id,
            activityDialog: true,
          }));
      }

      if (props.targetLabel === "Parcel Ownership") {
        if (rows[dataIndex]?._id) {
          setOpenDialog("addOwnerToParcel");
          setSelectedRow(rows[dataIndex]);
        }
      }

      if (props.targetLabel === "contact") {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedContact: rows[dataIndex]._id,
        }));

        setSubComponent(
          <ContactDetailCard
            selectRowOpenContact={selectRowOpenContact}
            handleCloseExpandableCard={handleCloseExpandableCard}
          />
        );
        setTitle("Contact Details");
        setSubTitle(" ");
        handleOpenExpandableCard();
      }
    },
    onChangePage: (pageState) => {
      setPageInd(pageState);
    },
    customSort: (data, colIndex, order) => {
      let temp_rows = [];
      let temp_rows_per_page = rowsPerPage ? rowsPerPage : 25;
      let temp = data.filter((item) => item.data[1] != "Cumulative");
      if (props.parent === "production_WellDetails") {
        if (colIndex === 1) {
          temp_rows = temp.sort((a, b) => {
            const dateA = moment(moment(a.data[colIndex], "MM/YYYY")).valueOf();
            const dateB = moment(moment(b.data[colIndex], "MM/YYYY")).valueOf();
            return (dateA < dateB ? -1 : 1) * (order === "desc" ? 1 : -1);
          });
        } else {
          temp_rows = temp.sort((a, b) => {
            if (isNaN(parseInt(a)) && isNaN(parseInt(b))) {
              a.data[colIndex] = parseInt(a.data[colIndex]);
              b.data[colIndex] = parseInt(b.data[colIndex]);
            }
            return (
              (a.data[colIndex] < b.data[colIndex] ? -1 : 1) *
              (order === "desc" ? 1 : -1)
            );
          });
        }

        let insertInBetween = temp_rows_per_page - 1;
        let cumulative_array = Object.values(cumulative);
        let temp_cumulative_array = [];

        for (let counter = 0; counter < cumulative_array.length; counter++) {
          if (
            counter != 0 &&
            counter != 9 &&
            counter != 10 &&
            counter != 11 &&
            counter != 12
          ) {
            temp_cumulative_array.push(cumulative_array[counter]);
          }
        }

        if (Object.entries(cumulative).length != 0) {
          let multiplier = temp_rows.length / insertInBetween;

          for (let counter = 1; counter <= multiplier; counter++) {
            let insert_index = 0;
            if (counter != 1) {
              insert_index = counter * temp_rows_per_page;
              temp_rows.splice(insert_index - 1, 0, {
                data: temp_cumulative_array,
              });
            } else {
              temp_rows.splice(insertInBetween, 0, {
                data: temp_cumulative_array,
              });
            }
          }
        }

        temp_rows.push({ data: temp_cumulative_array });
        return temp_rows;
      } else {
        return data.sort((a, b) => {
          return (
            (a.data[colIndex] < b.data[colIndex] ? -1 : 1) *
            (order === "desc" ? 1 : -1)
          );
        });
      }
    },
    onChangeRowsPerPage: (numberOfRows) => {
      if (props.total === true) {
        switch (props.parent) {
          case "production_WellDetails":
            let trimmed = rows.filter(
              (item) => item.ReportDate != "Cumulative"
            );
            setRowsPerPage(numberOfRows);
            setRows(
              displayCumulative(trimmed, props.total, cumulative, numberOfRows)
            );
            break;
          default:
            break;
        }
      }
    },


    onTableChange: (action, tableState) => {
      if (props.header === "Contacts") {
        let filters = [];
        const leadSourceIndex = tableState.columns.findIndex(
          (i) => i.name === "leadSource"
        );
        const lastUpdateByIndex = tableState.columns.findIndex(
          (i) => i.name === "lastUpdateBy.name"
        );
        const contactOwnerIndex = tableState.columns.findIndex(
          (i) => i.name === "contactOwner"
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
        if (tableState.filterList[contactOwnerIndex]?.length !== 0) {
          filters.push({
            field: "contactOwners.name",
            value: tableState.filterList[contactOwnerIndex],
          });
        }
        if (tableState.filterList[tagsIndex]?.length !== 0) {
          filters.push({
            field: "tags.tag",
            value: tableState.filterList[tagsIndex],
          });
        }

        const pageVariables = {
          variables: {
            pagination: {
              first: tableState.rowsPerPage,
              after: null,
            },
            ...(!isEmpty(tableState.sortOrder)) && {
              sort:
              {
                field:
                  tableState.sortOrder?.name ===
                    "fullContactAddress"
                    ? "address1"
                    : tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.dbName ||
                    tableState.columns.find(el => el.name === tableState.sortOrder?.name)?.name,
                order:
                  tableState.sortOrder?.direction === "asc"
                    ? 1
                    : -1,
              }
            },

            filters: filters,
            search: tableState.searchText,
            userId: stateApp.user.mongoId,
          },
        };
        if(stateApp.isContactSearching){
          action = 'search'
          setStateApp((stateApp) => ({
            ...stateApp,
            isContactSearching: false,
          }));
        }
        switch (action) {
          case "changeRowsPerPage":
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
                pageOverride: tableState.page,
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
            break;
          case "filterChange":
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            props.contactsPageProps.getContactsFilterOptions(pageVariables);
            break;
          case "resetFilters":
            props.contactsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            props.contactsPageProps.getPaginatedContacts(pageVariables);
            props.contactsPageProps.getContactsFilterOptions();
            break;
          default:
        }
      }

      if (props.header === "Well Interests"
      && props.parent === "owner_WellInterests") {

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
            userId: stateApp.user.mongoId,
          },
        };

        switch (action) {
          case "changeRowsPerPage":
            props.wellInterestsPageProps.setLoading(true);
            tableState.page = 0;
            setPageInd(tableState.page);
            setRowsPerPage(tableState.rowsPerPage);
            props.wellInterestsPageProps.getPaginatedWellInterests(
              pageVariables
            );
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
            props.wellInterestsPageProps.getPaginatedWellInterests(
              pageVariables
            );
            break;
          case "search":
            break;
          case "onSearchClose":
            break;
          case "propsUpdate":
            break;
          case "filterChange":
            break;
          case "resetFilters":
            break;
          default:
        }
      }
    },
  };

  if (props.header === "Well Interests"
    && props.parent === "owner_WellInterests") {
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
    options.rowsPerPageOptions =
      props.contactsPageProps.contactsCount > 25
        ? [10, 25, 50]
        : props.contactsPageProps.contactsCount > 10
          ? [10, 25]
          : [10];
    options.count = props.contactsPageProps.contactsCount;
    options.serverSide = true;
    //options.print = true;
    //options.export = true;
  }

  const displayCumulative = (data, total, cumulative, rowsPerPage = 25) => {
    let rows = data;
    if (total === true && rows.length != 0) {
      let insertInBetween = rowsPerPage - 1;
      if (Object.entries(cumulative).length != 0) {
        let multiplier = rows.length / insertInBetween;
        for (let temp = 1; temp <= multiplier; temp++) {
          let insert_index = 0;
          if (temp != 1) {
            insert_index = temp * rowsPerPage;
            rows.splice(insert_index - 1, 0, cumulative);
          } else {
            rows.splice(insertInBetween, 0, cumulative);
          }
        }
        rows.push(cumulative);
      }
      if (rows[rows.length - 1] != cumulative) {
        rows.push(cumulative);
      }
    }
    return rows;
  };


  const handleYearChange = (event) => {
    setYear(event.target.value);
    props.getWellOwnersByYear(event.target.value)
  };

  const TableFilterList = (props) => {
    return <Box className={classes.customDropDown} >
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={year}
        onChange={handleYearChange}
      >
        <MenuItem selected={year === 2019} value={2019}>2019</MenuItem>
        <MenuItem selected={year === 2020} value={2020}>2020</MenuItem>

      </Select>
    </Box>
  };

  const getHeaders = () => {
    return  props.header === 'Contacts' ? (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'left'}}>
        <Contact />
        <label style={{ marginLeft: '10px', fontSize: '16px'}}>{props.header}</label>
        <ArrowRight/>
        <label style={{ color: '#18AADD', fontSize: '16px' }}>All Contacts</label>
      </div>
      ) : props.header
  }
  return (
    <div style={{
      width: "100%",
      height: "100%",
      position: "relative"
    }}>
      <div
        className={`${classes.table} ${rows && !props.loading ? "" : classes.loadingTable
          } ${columns && columns.length > 0 ? "" : classes.emptyTable}`}
      >

        <MUIDataTable
          className={tableStyle}
          title={getHeaders()}
          data={rows ? rows : []}
          columns={columns ? columns : []}
          components={{
            TableFilterList: props.header == 'Tax Roll Ownership' ? TableFilterList : null,
            icons: {
              FilterIcon,
              ViewColumnIcon,
            }
          }}
          options={{
            ...options,
            searchText: props.header === 'Contacts' ? stateApp.contactSearchQuery : null,
            search: 
                    (
                       props.header === 'Contacts'
                    || props.header === 'Deals'
                    || props.header === 'Activities'
                    || props.header === 'Monthly Production'
                    ) 
                    ? false : props.parent != "search"
            // searchOpen: true,
            //download: false,
            // search: props.parent != "search",  
            //print: false,
          }}
        />
        {
          openDialog
          && openDialog === "sendMailers"
          && (<RightDialog
            open={openDialog ? true : false}
            handleClickDialogClose={handleCloseDialog}
            width={"700px"}
          >
            <SendMailersDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          </RightDialog>)
        }

        {
          openDialog
          && openDialog === "buyContactsInfo"
          && (<RightDialog
            open={openDialog ? true : false}
            handleClickDialogClose={handleCloseDialog}
            width={"700px"}
          >
            <BuyContactsInfoDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          </RightDialog>)
        }

        {openDialog
          && openDialog !== "addDeals"
          && openDialog !== "sendMailers"
          && openDialog !== "buyContactsInfo"
          && (<Dialog
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
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    selectedContact: contactId,
                  }));
                  setSubComponent(
                    <ContactDetailCard
                      selectRowOpenContact={selectRowOpenContact}
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
                onClose={() => {
                  setSelectedRow(null);
                  handleCloseDialog();
                }}
                customLayerId={props.addAble.customLayerId}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
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
                {`Do you want to permanently delete the owner${m1nSelectedRowsIds &&
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
                  `Do you want to remove the contact${m1nSelectedRowsIds &&
                    m1nSelectedRowsIds.length > 1 &&
                    removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                    ? "s"
                    : ""
                  } from this owner?`}

                {props.header === "Contacts" &&
                  `Do you want to delete the selected contact${m1nSelectedRowsIds &&
                    m1nSelectedRowsIds.length > 1 &&
                    removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                    ? "s"
                    : ""
                  }?`}
              </DeleteConfirmationDialogContent>
            )}
            {openDialog === "deleteParcelOwnership" && (
              <DeleteConfirmationDialogContent
                header={`Delete Owner${m1nSelectedRowsIds &&
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
                {`Do you want to delete the owner${m1nSelectedRowsIds &&
                  m1nSelectedRowsIds.length > 1 &&
                  removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                  ? "s"
                  : ""
                  }?`}
              </DeleteConfirmationDialogContent>
            )}
            {openDialog === "deleteParcelInterest" && (
              <DeleteConfirmationDialogContent
                header={`Delete Parcel Interest${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                  }`}
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to delete the Parcel Interest${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                  }?`}
              </DeleteConfirmationDialogContent>
            )}

            {openDialog === "deleteDeal" && (
              <DeleteConfirmationDialogContent
                header={`Delete Deal${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
                  }`}
                onClose={handleCloseDialog}
                deleteFunc={props.deleteFunc}
                m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
              >
                {`Do you want to delete the selected deal${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
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
            {openDialog === "merge" && (
              <MergeContactDrawer
                onClose={handleCloseDialog}
                rows={expandedObject}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                setRows={setExpandedObject}
              />
            )}
            {openDialog === "multipleOwnerToContact" && (
              <MultipleOwnerToContactDrawer
                onClose={handleCloseDialog}
                rows={expandedObject}
                setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                setRows={setExpandedObject}
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
                header={`Delete User${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""
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
                  : `Are you sure you want to delete selected user${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1
                    ? "s"
                    : ""
                  }?`}
              </DeleteConfirmationDialogContent>
            )}
          </Dialog>
          )}

        {multipleExpandableCard && targetLabelToExpand == "contact" && (
          <Dialog
            className={classes.dialogExpCard}
            fullWidth
            maxWidth="xl"
            open={multipleExpandableCard}
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
              targetSourceId={selectedRow._id}
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
        {showExpandableCard &&
          targetLabelToExpand !== "well" &&
          targetLabelToExpand !== "contact" &&
          multipleExpandableCard == false && (
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
