/* eslint-disable no-lone-blocks */
import React, { useState, useContext, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import ExpandableCardProvider from "../../../ExpandableCard/ExpandableCardProvider";
import WellCardProvider from "../../../WellCard/WellCardProvider";
import ContactDetailCard from "../../../ContactDetailCard/ContactDetailCard";
import Tags from "../../Tagger";
import Comments from "../../Comments";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import MUIDataTable, { TableViewCol } from "mui-datatables";
import { DndProvider } from "react-dnd";
import { Box, ButtonGroup, IconButton, Menu, MenuItem, Select } from "@material-ui/core";
import TrackToggleButton from "../../TrackToggleButton";
import Tooltip from "@material-ui/core/Tooltip";
import Badge from "@material-ui/core/Badge";
import ChatIcon from "@material-ui/icons/Chat";
import CachedIcon from '@material-ui/icons/Cached';
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";

import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
import AssignmentTurnedInOutlinedIcon from '@material-ui/icons/AssignmentTurnedInOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import TextSMS from '@material-ui/icons/TextsmsOutlined';
import MonetizationOnIcon from "@material-ui/icons/LocalAtmOutlined";
import EmailIcon from "@material-ui/icons/Mail";

import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import M1nTable from "../M1nTable";
import WellIcon from "../../svgIcons/well";
import AddContactDialogContent from "./SubComponents/AddContactDialogContent";
import DeleteConfirmationDialogContent from "./SubComponents/DeleteConfirmationDialogContent";
import MakeItAContactConfirmationDialogContent from "./SubComponents/MakeItAContactConfirmationDialogContent";
import Button from "@material-ui/core/Button";
import EmailRoundedIcon from "@material-ui/icons/EmailRounded";
import EditIcon from '@material-ui/icons/Edit';
import MergeTypeIcon from "@material-ui/icons/MergeType";
import BuyContactsInfoDialogContent from "./SubComponents/BuyContactsInfoDialogContent";
import PrintLabelsDialogContent from "./SubComponents/PrintLabelsDialogContent";
import SendMailersDialogContent from "./SubComponents/SendMailersDialogContent";
import { anyToDate } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import CellContentEdition from "./SubComponents/CellContentEdition";
import Avatar from "react-avatar";
import RoomIcon from "@material-ui/icons/Room";
import { useDispatch } from "react-redux";
import { setMapGridCardState } from "actions";
import { deepEqualObjects, setStateIfDeepEqual } from "../../functions";
import InviteUserDialog from "./SubComponents/InviteUserDialog";
import ReinviteUserDialog from "./SubComponents/ReinviteUserDialog";
import AddParcelOwnerDialogContent from "./SubComponents/AddParcelOwnerDialogContent";
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import AddParcelToEntityDialogContent from "./SubComponents/AddParcelToEntityDialogContent/AddParcelToEntityDialogContent";
import Convert_contact from "../../svgIcons/convert_contact";
import Contact_card from "../../svgIcons/contact_card";
import ParcelScreenIcon from "../../svgIcons/parcelScreen";
import ParcelsDetailCard from "../../../ParcelsDetailCard/ParcelsDetailCard";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { WELLQUERY } from "graphQL/useQueryWell";
import { useLazyQuery, useMutation } from "@apollo/client";
import WellTableStyles from "../customStyles/WellTableStyle";
import ParcelOwnershipStyles from "../customStyles/ParcelOwnership";
import ProductionTableStyle from "../customStyles/ProductionDetailsStyle";
import moment from "moment";
import MergeContactDrawer from "./SubComponents/MergeContactDrawer";
import { AssignOwnerToContactDrawerContainer, MultipleOwnerToContactDrawerContainer } from 'store/containers';
import ExportContacts from "components/Shared/ExportContacts";
import Grid from "@material-ui/core/Grid";
import { Warning as WarningIcon, CheckCircle } from "@material-ui/icons";
import StackedBarChart from "components/Shared/Charts/StackedBarChart";
import ButtonDropDown from "./ButtonGroup";
// auto complete for well API#
// import SearchWells from "components/Shared/Wells/WellsAutoCompleteFilter";

import NavigateNextIcon from "@material-ui/icons/NavigateNext";

// contexts
import { AppContext } from "AppContext";

// mui components
import Breadcrumbs from "@material-ui/core/Breadcrumbs";

// functions / value formatters
import capitalizeFirstLetter from "components/Shared/valueformatters/capitalize-first-letter.js";
import vf_currency from "components/Shared/valueformatters/vf_currency";
import ticksToDateString from "components/Shared/valueformatters/ticks-to-string.js";
import convert_date from "components/Shared/valueformatters/convert_date.js";
import get_file_icon from "components/Shared/functions/get_file_icon.js";

import RightDialog from "components/ContactDetailCard/components/RightDialog";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES, ROUTES } from "components/Shared/FeatureFlag/common";

import CustomFieldText from "components/Shared/M1nTable/components/SubComponents/CustomFieldText";
// import CustomFieldSelectV2 from "./SubComponents/CustomFieldSelectV2";
// import CustomFieldMultiSelect from "components/Shared/M1nTable/components/SubComponents/CustomFieldMultiSelect";

// queries
import { OWNERSLATSLONS } from "graphQL/useQueryOwnerLatsLonsArray";
import { OPERATORSLATSLONS } from "graphQL/useQueryOperatorLatsLonsArray";
import { LEASELATSLONS } from "graphQL/useQueryLeaseLatsLonsArray";
import { Typography } from "@material-ui/core";
import { VIEWFILEQUERY } from "graphQL/useQueryViewFile";

//icons
import GetAppIcon from "@material-ui/icons/GetApp";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
// import LocationOnIcon from '@material-ui/icons/LocationOn';
// import { ReactComponent as RequestPageIcon } from 'components/Shared/svgIcons/request_page_icon.svg';
import RequestPageIcon from "components/Shared/svgIcons/request_page";
// import RequestPageIcon from 'components/Shared/svgIcons/request_page_icon';
import PageviewIcon from "@material-ui/icons/Pageview";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import PostAddIcon from "@material-ui/icons/PostAdd";
import FilterIcon from "../../svgIcons/filter";
import ViewColumnIcon from "../../svgIcons/view_column";
import CheckIcon from "@material-ui/icons/Check";
import AddUnitOwnerDialogContent from "./SubComponents/AddUnitOwnerDialogContent";
import { contactStatusOptions } from "components/ContactDetailedInfo/helper";
// import Link from "@material-ui/core/Link";
import AddActivityDialog from "components/ContactDetailCard/components/AddActivityDialog";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { CONTACT } from "graphQL/useQueryContact";
import ReactSelectField from "./SubComponents/ReactSelectField";
import TableBody from "./MUIDataTable/TableBody";
import { AUTO_CALCULATE_OFFER_PRICE } from "graphQL/useMutationAutoCalculateOfferPrice";

import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import ColumnWithLink from "components/Shared/M1nTable/components/SubComponents/ColumnWithLink";
import { GET_VIEW_TOKEN_URI } from "graphQL/useQueryGetViewTokenUri";
import { popupController } from "hookstate/popupStateController";
import { navController } from "hookstate/navStateController";
import { mapControlsController } from "hookstate/mapControlsController";
import { layerController } from "hookstate/layerStateController";


// suppress debug console logs
DndProvider.whyDidYouRender = false;

const removeDuplicatesIds = (selectedRowsIds) => [...new Set(selectedRowsIds)];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  table: {
    "& .MuiTableBody-root": {
      height: "50px",
      "& .MuiTableCell-paddingCheckbox": {
        zIndex: (props) => (typeof props.headerZIndex !== 'undefined' ? props.headerZIndex : 100),
        paddingRight: (props) => props.dense ? '7px !important' : 'inherit',
        // paddingRight: (props) => props.dense ? '0px !important' : '0px !important',

      },
    },
    "& .MuiPaper-root > .MuiToolbar-gutters": {
      padding: "5px 11px 5px 20px !important",
    },
    "& .MUIDataTableToolbar": {
      zIndex: "999999 !important",
    },
    "& .MuiTableRow-head": {
      backgroundColor: "#F2F2F2"
    },
    "& .MuiTableRow-root.MuiTableRow-hover:hover": {
      backgroundColor: "rgb(223 223 223)"
    },
    "& .MuiPaper-elevation1": {
      flexDirection: "row !important",
      height: "65px !important",
      width: "100% !important",
      display: "flex !important",
      flex: "auto",
      alignItems: "center !important",
    },
    "& .MuiButton-text": {
      // padding: "5px 12px",
    },
    "& .Mui-disabled": {
      backgroundColor: "transparent",
    },
    "& .MuiToolbar-root": {
      backgroundColor: "#F2F2F2",
      borderBottom: "1px solid rgba(224, 224, 224, 1)",
    },
    "& .MuiToolbar-regular > div:nth-child(2) .MuiIconButton-root": {
      backgroundColor: "#D4E8F1",
    },
    "& .MuiToolbar-regular > div:nth-child(2)": {
      marginRight: (props) => props.toolbarActionMarginRight ?? "inherit",
      flex: "0 1 auto",
    },
    // "& .MuiInput-root": props => ({
    //   left: props.header !== "Tax Roll Ownership" ? "100px !important" : "0px !important",
    // }),
    "& .MuiTableCell-body": {
      padding: (props) => (props.dense ? "0px 0px 0px 25px !important" : "0px 0px 0px 16px"),
      backgroundColor: "#fff",
    },
    // "& .MuiTableCell-paddingCheckbox": {
    //   position: "relative",
    // },
    "& .MuiToolbar-regular > div:nth-child(2) .MuiIconButton-root": {
      backgroundColor: "#D4E8F1",
      margin: "0 2px",
    },
    "& .MuiTableHead-root:nth-child(1) .MuiButton-label": { minWidth: '103px' },
    "& .MuiTableHead-root": {
      backgroundColor: '#F2F2F2',
      "& th": {
        backgroundColor: "#F2F2F2",
        zIndex: "auto",
        padding: (props) => (props.dense ? "10px 10px 10px 25px" : null),
        "& button": {
          minWidth: 'max-content',
          "& .MuiButton-label": {
            textAlign: "left",
            display: 'block'
          },
        },
      },
      "& .MuiTableCell-paddingCheckbox": {
        padding: (props) => (props.dense ? "0px 0px 0px 25px !important" : "16px"),
        left: "0px",
        position: "sticky",
        zIndex: 1800,
      },
    },
    "& tr": {
      paddingRight: (props) => (props.dense ? "12px" : null),
      "& td": {
      },
    },
    "& thead": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
      zIndex: (props) => (typeof props.headerZIndex !== 'undefined' ? props.headerZIndex : 999),
      position: "sticky",
    },
    "& tbody": {
      opacity: "1",
      transition: "opacity 1s ease-out",
      webkitTransition: "opacity 1s ease-out",
      height: "50px",
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
  menuIcons: {
    marginRight: "8px",

  },
  colorIcon: {
    backgroundColor: (props) => (props.dense ? "transparent" : "#efefef"),
    marginLeft: "auto",
    color: `${theme.palette.secondary.main} !important`,
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
    minWidth: "120px",
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
    zIndex: "10000 !important",
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
    border: "1px solid #B3B3B3",
    "&:hover": {
      backgroundColor: "#263451",
      color: "#fff",
    },
  },
  monetizationIcon: {
    margin: "10px",
    color: "gray",
  },
  blue: { color: theme.palette.secondary.main, fontWeight: "bold" },
  customDropDown: props => ({
    height: "31px",
    display: "inline",
    position: "absolute",
    top: "19px",
    zIndex: "88889 !important",
    left: props.parent === "OwnersPerWell" ? "205px !important" : "325px !important",
  }),
  selectPopover: {
    zIndex: "88890 !important",
  },
  selectMenu: {
    zIndex: "88891 !important",
  },
  tapsLabelsButtons: {
    boxShadow: "none",
    backgroundColor: "#fff",
    color: "#757575",
    "&:hover": { boxShadow: "none !important" },
  },
  tapsLabelsButtonsSelected: {
    boxShadow: "none",
    color: "#fff",
    backgroundColor: theme.palette.secondary.main,
    "&:hover": { color: "#757575", boxShadow: "none !important" },
  },
  clickableCell: {
    cursor: "pointer",
    padding: "10px 10px 10px 10px",
    position: "relative",
    minWidth: "120px",
    borderRadius: "7px",
    color: "#17aadd",
    wordBreak: "break-word",
    "&:hover": {
      textDecoration: "underline",
    },
    fontWeight: "bold",
  },
  propertyName: {
    padding: "10px 10px 10px 10px",
    minWidth: "150px",
  },
  companyName: {
    fontSize: "12px",
    color: "#000000",
    fontWeight: "normal",
  },
  fileName: {
    minWidth: "400px !important",
  },
  docDateText: {
    // cursor: "pointer",
    padding: "0px 30px 10px 10px",
    marginTop: "-20px",
    position: "relative",
    justifyContent: "flex-end",
  },
  tooltip: {
    position: "absolute",
    top: 15,
    display: "none",
    color: "rgb(255, 0, 0)",
    width: 200,
    left: -150,
  },
  activeBadge: {
    background: "#17c10d",
    height: 12,
    width: 12,
    marginRight: 8,
    borderRadius: "50%",
  },
  pendingBadge: {
    background: "#ffa800",
    height: 12,
    width: 12,
    marginRight: 8,
    borderRadius: "50%",
  },
  declinedBadge: {
    background: "#cb0f29",
    height: 12,
    width: 12,
    marginRight: 8,
    borderRadius: "50%",
  },
  statusBtnDiv: {
    display: "flex",
    alignItems: "center",
  },
  approveBtn: {
    border: "1px solid grey",
    color: "#17c10d",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    maxHeight: "30px",
    cursor: "pointer",
    fontSize: "smaller",
    fontWeight: "bold",
  },
  declineBtn: {
    border: "1px solid grey",
    color: "#cb0f29",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    maxHeight: "30px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "smaller",
  },
  agreementNumber: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    // position: 'absolute',
    alignItems: 'center',
    // justifyContent: 'space-between',

    "&:hover": {
      "& $actionButtons": {
        display: "flex",
      },
    },
  },
  textEllipsis: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: "300px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    overflow: "hidden",
    width: "100%"
  },
  actionButtons: {
    display: "none",
    justifyContent: "flex-start",
    alignItems: "center",
    "&:hover": {
      display: "flex",
    },
  },
  customWarning: {
    "& .MuiSvgIcon-root": {
      fill: "#ffa800"
    }
  },
  actionMenuItem: {
    padding: 5,
    paddingLeft: 10,
    width: "260px",
    color: "#5a5a5a",
    "&  .MuiSvgIcon-root": {
      fill: "#5a5a5a"
    }
  },
  gridElementStyling: {
    width: '250px',
    padding: '0px 25px 0px 0px'
  },
  gridElementEmptyStyling: {
    color: "#959595"
  }
}));

function SubTable(props) {
  const classes = useStyles({
    ...props,
    toolbarActionMarginRight: props?.options?.toolbarActionMarginRight,
  });
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
  const [year, setYear] = React.useState(2023);
  const [total, Total] = useState(false);
  const [rows, Rows] = useState([]);
  const [_selectedRows, setSelectedRows] = useState([]);
  const [isSearchOpen, openSearch] = useState(false);
  const [handleSearch, setHandleSearch] = useState(() => () => { });
  const [dataWell, setDataWell] = useState();
  const [defaultActivityType, setDefaultAcitivityType] = useState("call");
  const [contact, setContact] = useState(null);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  // deep state
  const setFirstMount = (newState) => {
    setStateIfDeepEqual(FirstMount, newState);
  };
  const setRowsPerPage = (newState) => {
    setStateIfDeepEqual(RowsPerPage, newState);
  };
  const setTrueTargetLabel = (newState) => {
    setStateIfDeepEqual(TrueTargetLabel, newState);
  };

  const setM1nSelectedRowsTracks = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsTracks, newState);
  };
  const setM1nSelectedRowsIds = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsIds, newState);
  };
  const setM1nSelectedRowsIndexes = (newState) => {
    setStateIfDeepEqual(M1nSelectedRowsIndexes, newState);
  };
  if (props.setM1nSelectedRowsIndexesRef) {
    props.setM1nSelectedRowsIndexesRef.current = setM1nSelectedRowsIndexes;
  }
  const setSubTitle = (newState) => {
    setStateIfDeepEqual(SubTitle, newState);
  };
  const setTitle = (newState) => {
    setStateIfDeepEqual(Title, newState);
  };
  const setTargetLabelToExpand = (newState) => {
    setStateIfDeepEqual(TargetLabelToExpand, newState);
  };
  const setSubComponent = (newState) => {
    setStateIfDeepEqual(SubComponent, newState);
  };
  const setSelectedRow = (newState) => {
    setStateIfDeepEqual(SelectedRow, newState);
  };
  const setMultipleExpandableCard = (newState) => {
    setStateIfDeepEqual(MultipleExpandableCard, newState);
  };
  const setShowExpandableCard = (newState) => {
    setStateIfDeepEqual(ShowExpandableCard, newState);
  };
  const setColInd = (newState) => {
    setStateIfDeepEqual(ColInd, newState);
  };
  const setRowInd = (newState) => {
    setStateIfDeepEqual(RowInd, newState);
  };
  const setPageInd = (newState) => {
    setStateIfDeepEqual(PageInd, newState);
  };
  const setExpandedObject = (newState) => {
    setStateIfDeepEqual(ExpandedObject, newState);
  };
  const setOpenDialog = (newState) => {
    setStateIfDeepEqual(OpenDialog, newState);
  };
  const setTotal = (newState) => {
    setStateIfDeepEqual(Total, newState);
  };
  const setCumulative = (newState) => {
    setStateIfDeepEqual(Cumulative, newState);
  };
  const setViewColumns = (newState) => {
    setStateIfDeepEqual(ViewColumns, newState);
  };
  const setRows = (newState) => {
    setStateIfDeepEqual(Rows, newState);
  };
  const [searchedRows, setSearchedRows] = useState([]);

  const [gridColWidth, setGridColWidth] = useState('250px');


  // queries
  const [getWell] = useLazyQuery(WELLQUERY, {
    onCompleted: (dataWell) => {
      setDataWell((state, props) => {
        return { ...dataWell };
      });
    },
  });
  const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(OWNERSLATSLONS);
  const [getOperatorWells, { data: dataOperatorWells }] = useLazyQuery(OPERATORSLATSLONS);
  const [getLeaseWells, { data: dataLeaseWells }] = useLazyQuery(LEASELATSLONS);
  const [getContact, { data: contactData }] = useLazyQuery(CONTACT);
  const [getViewTokenUri, { data: viewTokenUri }] = useLazyQuery(GET_VIEW_TOKEN_URI, {
    fetchPolicy: "no-cache",
  });
  const [autoCalculateOfferPrice, { data: autoCalculateOfferPriceData, }] = useMutation(
    AUTO_CALCULATE_OFFER_PRICE,
    {
      refetchQueries: [
        "getESSimpleSearch",
      ],
    }
  );
  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });
  const handleViewFile = async (id) => {
    viewFile({ variables: { fileId: id } });
  };

  useEffect(() => {
    if (props.selectedRowsValues === null && Array.isArray(props.selectedRows) && props.selectedRows.length === 0) {
      M1nSelectedRowsIndexes([]);
    }
  }, [props.selectedRowsValues, props.selectedRows]);

  useEffect(() => {
    if (viewFileResult?.viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;
      // selectors
      // const { searchloading } = useSelector(({ MapGridCard }) => MapGridCard);

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  }, [viewFileResult]);

  // handlers
  const handleWellFlyTo = (value) => {
    const shapeId = history.location.pathname.split("/");
    const selectedShape = popupController.getValue('selectedShape');
    const shapeType = selectedShape?.type;
    history.push(
      `/map/wells/${value?.wellId}`,
      shapeType ? {
        fromShapeDetail: true,
        shapeName: selectedShape?.shapeLabel,
        shapeId: shapeId[shapeId.length - 1],
        shapeType: shapeType === "agreement" ? "Agreements" : "Units",
        link: shapeType === "agreement" ? `/land/agreement/details/${selectedShape?.id}` : `/map/units/${shapeId[shapeId.length - 1]}`
      } : null
    );
    mapControlsController.updateState({
      mapGridCardActivated: false,
    });
    popupController.setState({
      selectedWellId: value.wellId ? value.wellId.toLowerCase() : null,
      wellSelectedCoordinates: [value.center[0], value.center[1]],
    });
  };

  const handleLocationFlyTo = (newValue) => {
    if (newValue && newValue.center) {
      let minLong, maxLong, minLat, maxLat;
      if (newValue.bbox) [minLong, minLat, maxLong, maxLat] = newValue.bbox;

      setStateApp((stateApp) => ({
        ...stateApp,
        wellListFromSearch: [
          {
            id: newValue.Id,
            longitude: newValue.center[0],
            latitude: newValue.center[1],
          },
        ],
        fitBounds: newValue.bbox ? { maxLat, minLat, maxLong, minLong } : null,
      }));
      layerController.updateState({
        wellListFromSearch: [
          {
            id: newValue.Id,
            longitude: newValue.center[0],
            latitude: newValue.center[1],
          },
        ]
      })
      popupController.updateState({
        selectedWell: null,
        selectedWellId: null,
        wellSelectedCoordinates: null,
        wellListFromSearch: [
          {
            id: newValue.Id,
            longitude: newValue.center[0],
            latitude: newValue.center[1],
          },
        ],
      })
      popupController.reset();
      stateApp.toggleLayersActivity("Search", true);
    }
  };

  const handleUnitFlyTo = (newValue) => {
    const data = props.rows.find(row => row.Id === newValue.objToPopulateSearchLayer.objectId)
    history.push(`/map/units/${data._id}`)
  };

  const handleOperatorFlyTo = (value) => {
    getOperatorWells({
      variables: {
        operatorName: value.objToPopulateSearchLayer.objectName,
      },
    });
  };

  const handleLeaseFlyTo = (value) => {
    if (value.objToPopulateSearchLayer.objectName && value.objToPopulateSearchLayer.objectName !== "") {
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

  const handleOwnerFlyTo = (value) => {
    getOwnerWells({
      variables: {
        ownerId: value.objToPopulateSearchLayer.objectId,
      },
    });
  };

  const handleAutoCalculateClick = (shapeOwnerId) => {
    autoCalculateOfferPrice({
      variables: {
        shapeOwnerId,
      },
    });
  }

  const handleClickFlyToIcon = (entityType, searchTarget, unmount = false) => {
    if (!searchTarget) return;

    if (entityType === "well") {
      handleWellFlyTo(searchTarget);
    }
    if (entityType === "owner") {
      unmount = false
      handleOwnerFlyTo(searchTarget);
    }
    if (entityType === "operator") {
      unmount = false
      handleOperatorFlyTo(searchTarget);
    }
    if (entityType === "lease") {
      handleLeaseFlyTo(searchTarget);
    }
    if (entityType === "location") {
      handleLocationFlyTo(searchTarget);
    }
    if (entityType === "unit") {
      handleUnitFlyTo(searchTarget);
    }

    if (unmount)
      mapControlsController.updateState({
        mapGridCardActivated: false,
      });
  };

  const registerSearchHandler = (handleSearch) => {
    setHandleSearch(() => handleSearch);
  };


  // functions
  const gridElement = value => {
    // wraps standard grid elements w/ consistent styling
    return (
      <>
        <Typography
          noWrap
          variant='body2'
          className={classes.gridElementStyling}
        >
          {value ? (value) : (<span className={classes.gridElementEmptyStyling}>--</span>)}
        </Typography>
      </>
    )
  }

  // Shows comments
  const GridComments = ({ value, targetSourceId, tableMeta }) => {
    const id = props.targetLabel + tableMeta.columnIndex;
    return (
      <>
        <Tooltip
          title={!value || value === 0 ? "Add Comments" : "View Comments"}
          placement="top"
        // style={{ marginRight: "10px" }}
        >
          <Button
            id={id + targetSourceId + tableMeta.rowIndex}
            size='small'
            startIcon={<ChatIcon />}
            onClick={(e) => {
              e.stopPropagation();
              handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, targetSourceId, "comment");
            }}
            aria-label="show comments"
            onMouseOver={() => {
              if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                multiSelectMouseHoverColor(id, "#dadbde");
            }}
            onMouseOut={() => {
              if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                multiSelectMouseHoverColor(id, "#efefef");
            }}
            data-testid={`comment-icon-button-${tableMeta.rowIndex}`}
          >
            {value}
          </Button>
        </Tooltip>

      </>
    )
  }
  //// save contact data chosen by action menu
  useEffect(() => {
    if (contactData && contactData.contact) {
      setContact(contactData.contact);
    }
  }, [contactData, contact]);

  useEffect(() => {
    setM1nSelectedRowsIndexes([]);
    setM1nSelectedRowsIds([]);
  }, [props.resetSelectedRow])
  //// opening the well detail card after fetch the extra well data needed
  useEffect(() => {
    if (
      props.parent &&
      (props.parent === "search" ||
        props.parent === "owner_WellInterests" ||
        props.parent === "assocTaxRollInterests" ||
        props.parent === "wells") &&
      props.targetLabel === "well" &&
      dataWell &&
      dataWell.well
    ) {
      let selectedWell = props.rows.find((row) => {
        if (row.id) return row.id === dataWell.well.id;
        return row.Id === dataWell.well;
      });

      selectedWell = { ...selectedWell, ...dataWell.well };
      //// temporary to fix the ticks dates fields comming from the rest api
      if (selectedWell.permitApprovedDate && selectedWell.permitApprovedDate !== "null")
        selectedWell.permitApprovedDate = ticksToDateString(selectedWell.permitApprovedDate);
      if (selectedWell.spudDate && selectedWell.spudDate !== "null") selectedWell.spudDate = ticksToDateString(selectedWell.spudDate);
      if (selectedWell.completionDate && selectedWell.completionDate !== "null")
        selectedWell.completionDate = ticksToDateString(selectedWell.completionDate);
      if (selectedWell.firstProductionDate && selectedWell.firstProductionDate !== "null")
        selectedWell.firstProductionDate = ticksToDateString(selectedWell.firstProductionDate);
      //// temporary end
      if (selectedWell) {
        setSelectedRow(selectedWell);
        popupController.setState({
          selectedWellId: dataWell.well.id,
          selectedWell,
        });
        setSubComponent(<WellCardProvider />);
        setTitle(selectedWell.wellName ? selectedWell.wellName : selectedWell.WellName);
        setSubTitle(selectedWell.api ? selectedWell.api : selectedWell.api);
        handleOpenExpandableCard();
      }
    }
  }, [dataWell]);

  useEffect(() => {
    if (dataOwnerWells && dataOwnerWells.ownerLatsLonsArray) {
      if (dataOwnerWells.ownerLatsLonsArray.length !== 0) {
        if (dataOwnerWells.ownerLatsLonsArray.length === 1)
          popupController.setState({
            selectedWellId: dataOwnerWells.ownerLatsLonsArray[0].id.toLowerCase(),
            wellSelectedCoordinates: [
              dataOwnerWells.ownerLatsLonsArray[0].longitude,
              dataOwnerWells.ownerLatsLonsArray[0].latitude,
            ],
          });
        setStateApp(stateApp => ({
          ...stateApp,
          fitBounds: null,
          wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray],
        }));
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
      }
      // unmount
      mapControlsController.updateState({
        mapGridCardActivated: false,
      });
    }
  }, [dataOwnerWells]);

  useEffect(() => {
    // effect to fly to the operator wells
    // i duplicated this code to get things moving
    // will probably need to be combined w/ code in search.js

    if (dataOperatorWells && dataOperatorWells.operatorLatsLonsArray) {
      if (dataOperatorWells.operatorLatsLonsArray.length !== 0) {
        if (dataOperatorWells.operatorLatsLonsArray.length === 1)
          popupController.setState({
            selectedWellId: dataOperatorWells.operatorLatsLonsArray[0].id.toLowerCase(),
            wellSelectedCoordinates: [
              dataOperatorWells.operatorLatsLonsArray[0].longitude,
              dataOperatorWells.operatorLatsLonsArray[0].latitude,
            ],
          });
        setStateApp(stateApp => ({
          ...stateApp,
          fitBounds: null,
          wellListFromSearch: [...dataOperatorWells.operatorLatsLonsArray],
        }));
        layerController.updateState({ wellListFromSearch: [...dataOperatorWells.operatorLatsLonsArray] })

        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        setStateApp((stateApp) => ({
          ...stateApp,
          wellListFromSearch: [],
        }));
        layerController.updateState({ wellListFromSearch: [] })

      }
      // unmount
      mapControlsController.updateState({
        mapGridCardActivated: false,
      });
    }
  }, [dataOperatorWells]);

  useEffect(() => {
    // effect to fly to the lease wells
    // i duplicated this code to get things moving
    // will probably need to be combined w/ code in search.js

    if (dataLeaseWells && dataLeaseWells.leaseLatsLonsArray) {
      if (dataLeaseWells.leaseLatsLonsArray.length !== 0) {
        if (dataLeaseWells.leaseLatsLonsArray.length === 1)
          popupController.setState({
            selectedWellId: dataLeaseWells.leaseLatsLonsArray[0].id.toLowerCase(),
            wellSelectedCoordinates: [
              dataLeaseWells.leaseLatsLonsArray[0].longitude,
              dataLeaseWells.leaseLatsLonsArray[0].latitude,
            ],
          });
        setStateApp(stateApp => ({
          ...stateApp,
          fitBounds: null,
        }));
        layerController.updateState({ wellListFromSearch: [...dataLeaseWells.leaseLatsLonsArray] })
        stateApp.toggleLayersActivity("Search", true);
      } else {
        stateApp.toggleLayersActivity("Search", false);
        layerController.updateState({ wellListFromSearch: [] })
      }
    }
  }, [dataLeaseWells]);

  useEffect(() => {
    if (props.targetLabel === "Parcel Interest") setTrueTargetLabel("Parcel Ownership");
  }, [props.targetLabel]);

  useEffect(() => {
    if (props.rows) {
      const updInSameOrder = (commingRows) => {
        if (!rows || rows.length == 0) return commingRows;

        let updatedRows = [];
        let newRows = [];

        commingRows.forEach((updRow) => {
          const position = rows.findIndex(
            (row) => (row.id && row.id === updRow.id) || (row.Id && row.Id === updRow.Id) || (row._id && row._id === updRow._id)
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

      if (props.total === true) {
        let temp = {};
        let calc_keys = ["oil", "gas", "water", "allocatedOil", "allocatedWater", "allocatedGas"];
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
    data.forEach((row) => {
      keys.forEach((key) => {
        if (ret_val[key]) {
          ret_val[key] = ret_val[key] + parseFloat(row[key]);
        } else {
          ret_val[key] = row[key] ? parseFloat(row[key]) : 0; // Parse as float if value, otherwise 0
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
      if (document.getElementById(id + m1nSelectedRowsIds[i] + m1nSelectedRowsIndexes[i]))
        document.getElementById(id + m1nSelectedRowsIds[i] + m1nSelectedRowsIndexes[i]).style.backgroundColor = color;
    }
  };

  const handleExpandClick = async (cIndex, rIndex, idOrValues, type) => {
    setColInd(cIndex);
    setRowInd(rIndex);
    setExpandedObject(idOrValues);
    setOpenDialog(type);
  };

  const openPdf = (type, docInfo) => {
    const addAbleTypesToGetViewToken = ["parcelRunsheet"];
    if (addAbleTypesToGetViewToken.includes(type) && docInfo.fileId) {
      getViewTokenUri({
        variables: { fileId: docInfo?.fileId }
      }).then((result) => {
        docInfo.viewToken = result.data.getViewTokenUri

        setStateApp((state) => ({
          ...state,
          pdfView: docInfo,
          viewDoc: {
            uri: result.data.getViewTokenUri,
            name: docInfo.fileName,
          },
        }));
      })
    }
    else {
      setStateApp((state) => ({
        ...state,
        pdfView: docInfo,
        viewDoc: {
          uri: docInfo.viewToken,
          name: docInfo.fileName,
        },
      }));
    }
  }

  // handleActivity if type is 'deleteContact' open delete confirmation dialog otherwise open activiy modal for other types
  const handleActivity = async (contactId, activityType, type) => {
    if (type) {
      setM1nSelectedRowsIds([contactId]);
      setOpenDialog(type);
    }
    else {
      getContact({
        variables: {
          contactId: contactId,
        },
      });

      setDefaultAcitivityType(activityType)
      setActivityModalOpen(true);
    }
    setUsermanagementSettings([]);
  };

  ////setting all icons columns/////
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [isUMSettings, setUsermanagementSettings] = useState([]);

  const closeMenu = () => {
    setUsermanagementSettings([]);
    setSelectedUser(null);
    setSelectedUserIndex(null);
    setM1nSelectedRowsIds([]);
  };

  const openMenu = (event, rowIndex, user) => {
    event.stopPropagation();
    setSelectedUser(user);
    setSelectedUserIndex(rowIndex);
    setM1nSelectedRowsIds([user.id]);
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
        <MenuItem className={classes.userMenuItem} onClick={(e) => handleExpandClick(null, null, null, "reinviteUser")}>
          Resend Invite
        </MenuItem>
        <Divider />
        <MenuItem className={classes.userMenuItem} onClick={(e) => handleExpandClick(null, null, null, "deleteUser")}>
          Inactivate User
        </MenuItem>
      </Menu>
    );
  };

  const openActionMenu = (event, rowIndex, user, tableMeta) => {
    const contactId = user.columnData.parent === "Tract detail" || user.columnData.parent === "Unit detail" ? user.rowData[1] : user.rowData[0]
    event.stopPropagation();
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
        <MenuItem className={classes.actionMenuItem} onClick={(e) => handleActivity(contactId, "call", null)}>
          <CallOutlinedIcon className={classes.menuIcons} />
          Add call log
        </MenuItem>
        <Divider />
        <MenuItem className={classes.actionMenuItem} onClick={(e) => handleActivity(contactId, "text_message", null)}>
          <TextSMS className={classes.menuIcons} />
          Add text exchange
        </MenuItem>
        <MenuItem className={classes.actionMenuItem} onClick={(e) => handleActivity(contactId, "email", null)}>
          <EmailIcon className={classes.menuIcons} />
          Add email exchange
        </MenuItem>
        <Divider />
        <MenuItem className={classes.actionMenuItem} onClick={(e) => handleActivity(contactId, "meeting", null)}>
          <EventOutlinedIcon className={classes.menuIcons} />
          Add meeting notes
        </MenuItem>
        <Divider />
        <MenuItem className={classes.actionMenuItem} onClick={(e) => handleActivity(contactId, "task", null)}>
          <AssignmentTurnedInOutlinedIcon className={classes.menuIcons} />
          Add new task
        </MenuItem>
        <Divider />
        <MenuItem className={classes.actionMenuItem} onClick={(e) => handleActivity(contactId, null, "deleteContact")}>
          <DeleteOutlinedIcon className={classes.menuIcons} />
          Delete contact
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

  const valueFormatter = (column, v) => {
    if (
      (column.name === "status" && props.targetLabel === "deal") ||
      (column.name === "type" && props.targetLabel === "activity")
    )
      return capitalizeFirstLetter(v);
    if (column.name === "deals") return v.map(item => item.name).join(',');
    if (column.name === "appraisedValue") return vf_currency(v);

    if (column.name === "taxValue") return vf_currency(v);

    if (column.name === "offerPrice" && !!v && !isNaN(v)) return vf_currency(v);
    if (column.name === "closedPrice" && !!v && !isNaN(v)) return vf_currency(v);
    if (
      (column.name === "seller_asking_price" ||
        column.name === "competitor_offer_price" ||
        column.name === "offer_price") &&
      !!v &&
      !isNaN(v)
    )
      return vf_currency(v);

    if (column.name === "lastUpdateAt")
      return anyToDate(v).toLocaleString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "numeric",
      });

    if (column.name === "createAt")
      return anyToDate(v).toLocaleString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "numeric",
      });

    if (column.name === "receivedDate" && !!v) return moment.parseZone(v).format("MM/DD/yyyy");
    if (column.name === "bidDate" && !!v) return moment.parseZone(v).format("MM/DD/yyyy");
    if (column.name === "closeDate" && !!v) return moment.parseZone(v).format("MM/DD/yyyy");

    if ((column.name === "end" || column.name === "start") && !!v)
      return anyToDate(v).toLocaleString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "numeric",
        minute: "2-digit",
        hour: "2-digit",
      });

    return v;
  };

  useEffect(() => {
    if (props.columns) {
      props.columns.forEach((column) => {
        // WARNING! this can break components that depend on updated component state in callbacks
        // without using refs we HAVE to re-create customBodyRender callback functions every render
        // or component state is stale

        // if (column.name === "_id" && column.options.isFiniteScroll) {
        //   column.options = {
        //     ...column.options,

        //     setCellProps: () => ({
        //       style: {
        //         minWidth: "90px",
        //         maxWidth: "90px",
        //         position: "sticky",
        //         left: "77px",
        //         zIndex: 201,
        //       }
        //     }),

        //     setCellHeaderProps: () => ({
        //       style: {
        //         minWidth: "90px",
        //         maxWidth: "90px",
        //         position: "sticky",
        //         paddingLeft: '70px',
        //         zIndex: 201,
        //         left: "77px",
        //       },
        //     }),

        //     customRender: (value, tableMeta) => {
        //       const rowIndex = tableMeta.rowIndex;
        //       return (
        //         <>
        //           {rowIndex === props.rows.length - 5 && (<Waypoint
        //             onEnter={() => {
        //               if (props.onInfiniteScroll) props.onInfiniteScroll()
        //             }}
        //           />)}

        //           <div
        //             id={`${rowIndex === props.rows.length - 5 ? `waypoint-${rowIndex}` : ''}`} z>
        //             {<span
        //               style={{ color: GlobalStyles.colors.mutedGrey }}
        //             >{tableMeta.rowIndex + 1}</span>}
        //           </div>
        //         </>
        //       );
        //     },
        //   }
        // }

        if (column?.options?.customRender) {
          column.options = {
            ...column.options,
            customBodyRender: column.options.customRender,
          };
          return;
        }

        switch (column.name) {



          case "name":
            {
              column.options = {
                ...column.options,
                customRender: (value, tableMeta) => {
                  if (props.targetLabel === "unit" || props.targetLabel === 'campaignUnit') {
                    const targetSourceId = tableMeta.rowData[0];
                    const commentValue = props.targetLabel === "unit" ? tableMeta.rowData[tableMeta.rowData.length - 2] : tableMeta.rowData[22];

                    const path = `/${column.label === 'Contact Name' ? 'contact/details' : 'map/units'}/${tableMeta.rowData[0]}`

                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Grid container spacing={0} direction="row"
                          style={{
                            justifyContent: "space-between",
                            position: 'absolute'
                          }}
                        >
                          <Grid item
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <ColumnWithLink
                              value={tableMeta?.rowData[column.label === 'Contact Name' ? 1 : 2]}
                              link={`${path}`}
                            />
                          </Grid>
                          {column.label !== 'Contact Name' &&
                            <Grid style={{ marginRight: "20px" }} item>
                              <GridComments value={commentValue} targetSourceId={targetSourceId} tableMeta={tableMeta} />
                            </Grid>
                          }
                        </Grid>
                      </div>
                    );
                  } else if (props.targetLabel === "contact") {
                    const nameIndex = props.columns.findIndex((val) => val.name === "name")
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          color={Avatar.getRandomColor(value, ["#b5d2f6", "#ade2e9", "#eaeaea", "#f2c1e2", "#d7d6fb"])}
                          fgColor="#000"
                          name={(tableMeta.rowData[nameIndex])
                            .split(" ")
                            .splice(0, 2)
                            .join(" ")}
                          size="35"
                          round
                        />
                        <p
                          className="contactDetailsLink"
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            minWidth: "300px",
                            marginLeft: "10px"
                          }}
                        >
                          <ColumnWithLink
                            value={tableMeta.rowData[nameIndex]}
                            link={`/contact/details/${tableMeta.rowData[0]}/?tenant=${window.sessionStorage.getItem("tenantName")}`}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                          {!!(tableMeta.rowData[props.columns.findIndex((val) => val.name === "isPurchased")]) && (
                            <FeatureFlag feature={FEATURES.IDICORE}>
                              <MonetizationOnIcon className={classes.monetizationIcon} />
                            </FeatureFlag>
                          )}
                        </p>
                        {/* <Link
                          to={`/contact/details/${tableMeta.rowData[0]}/?tenant=${window.sessionStorage.getItem("tenantName")}`}
                          className={classes.clickableCell}
                        >
                          <p

                            style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              minWidth: "300px",
                            }}
                          >
                            {tableMeta.rowData[nameIndex]}
                            {!!(tableMeta.rowData[props.columns.findIndex((val) => val.name === "isPurchased")]) && (
                              <FeatureFlag feature={FEATURES.IDICORE}>
                                <MonetizationOnIcon className={classes.monetizationIcon} />
                              </FeatureFlag>
                            )}
                          </p>
                        </Link> */}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          minWidth: "300px",
                        }}
                      >
                        <Grid container spacing={0} direction="row"
                          // style={{ position: 'absolute' }}
                          className={classes.agreementNumber}
                        >
                          <Grid item
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              width: "100%"
                            }}
                          >
                            <p
                              className={classes.textEllipsis}
                            >
                              {value}

                              {!!(tableMeta.rowData[props.columns.findIndex((val) => val.name === "isPurchased")]) && (
                                <FeatureFlag feature={FEATURES.IDICORE}>
                                  <MonetizationOnIcon className={classes.monetizationIcon} />
                                </FeatureFlag>
                              )}
                            </p>
                          </Grid>
                        </Grid>
                      </div>
                    );
                  }
                },
              }
              break;
            }

          case "detailCard":
            column.options = {
              ...column.options,
              customBodyRender: (value, tableMeta, updateValue) => {
                let id = props.targetLabel + tableMeta.columnIndex;
                if (props.parent !== "search" && props.targetLabel !== "well") {
                  return (
                    <Tooltip title={"Detail Card"} placement="top">
                      <IconButton
                        id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons} ${colInd === tableMeta.columnIndex && rowInd === tableMeta.rowIndex ? classes.iconSelected : ""
                          }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (value) {
                            popupController.reset();
                            getWell({
                              variables: { wellId: value },
                            });
                          } else if (props.parent === "assocTaxRollInterests" && (props.targetLabel === "unit" || props.targetLabel === 'campaignUnit' || props.targetLabel === 'contactUnits')) {
                            let selectedUnit = props.rows.find((row) => {
                              return row.shape._id === tableMeta.rowData[2];
                            })?.shape;
                            props.showUnitDetails(selectedUnit);
                          } else if (props.parent === "assocTaxRollInterests" && props.targetLabel === "parcel") {
                            let selectedParcel = props.rows.find((row) => {
                              return row._id === tableMeta.rowData[0];
                            });
                            props.showParcelDetails(selectedParcel);
                          } else {
                            let selectedWell = props.rows.find((row) => {
                              if (row.id) return row.id === tableMeta.rowData[0];
                              return row.Id === tableMeta.rowData[0];
                            });

                            if (selectedWell) {
                              if (props.targetLabel === "well") {
                                if (props.parent === "owner_WellInterests") {
                                  selectedWell.id = selectedWell.wellId;
                                  delete selectedWell.wellId;
                                }
                                setSelectedRow(selectedWell);
                                popupController.setState({
                                  selectedWellId:
                                    props.parent === 'owner_WellInterests'
                                      ? tableMeta.rowData[1]
                                      : tableMeta.rowData[0],
                                  selectedWell,
                                });
                                setSubComponent(<WellCardProvider />);
                                setTitle(selectedWell.wellName ? selectedWell.wellName : selectedWell.WellName);
                                setSubTitle(selectedWell.api ? selectedWell.api : selectedWell.api);
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
                } else {
                  return null;
                }
              },
            };
            break;
          case "dateTime": {
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  const row_line = Object.assign(
                    {},
                    ...tableMeta.rowData.map((item, index) => ({
                      [props.columns[index]?.name]: item,
                    }))
                  );
                  var dateTime = null;
                  if (row_line && row_line.dateTime) {
                    dateTime = row_line.dateTime;
                  }
                  return (gridElement(convert_date(dateTime))
                  );
                },
              };
            }
            break;
          }
          case "actionMenu": {
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let id = props.targetLabel + tableMeta.columnIndex;
                  return (
                    <>
                      <Tooltip title="Actions" placement="top" style={{ marginRight: "10px" }}>
                        <IconButton
                          id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                          size={props.dense ? "small" : "medium"}
                          onClick={(e) => {
                            openActionMenu(
                              e,
                              tableMeta.rowIndex,
                              tableMeta

                            );
                          }}
                        >
                          <MoreVertOutlinedIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  );
                },
              };
            }
            break;
          }
          // case "property": {
          //   {
          //     column.options = {
          //       ...column.options,
          //       customBodyRender: (value, tableMeta, updateValue) => {
          //         const {
          //           columnData: { label },
          //           rowData,
          //         } = tableMeta;
          //         return (
          //           <>
          //             {label === "property #" && <span style={{ padding: 10 }}>{rowData[1]}</span>}

          //             {label === "Property Name" && <span style={{ padding: 10 }}>{rowData[1].name}</span>}

          //             {label === "State" && <span style={{ padding: 10 }}>{rowData[1].state}</span>}

          //             {(label === "Country" || label === "County") && <span style={{ padding: 10 }}>{rowData[1].county}</span>}
          //           </>
          //         );
          //       },
          //     };
          //   }
          //   break;
          // }
          case "date": {
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return <span style={{ padding: 10 }}>{moment(value).format("MM/DD/YYYY")}</span>;
                },
              };
            }
            break;
          }
          case "lastLogin": {
            {
              column.options = {
                ...column.options,
                customBodyRender: (value) => {
                  return <span style={{ padding: 10 }}>{value ? moment(value).format("lll") : ""}</span>;
                },
              };
            }
            break;
          }
          case "partyName1": {
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return <>{tableMeta.rowData[6] && tableMeta.rowData[6].entityDetail ? tableMeta.rowData[6].entityDetail?.name : null}</>;
                },
              };
            }
            break;
          }
          case "partyName2": {
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  return <>{tableMeta.rowData[7] && tableMeta.rowData[7].entityDetail ? tableMeta.rowData[7].entityDetail?.name : null}</>;
                },
              };
            }
            break;
          }
          case "actions":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let id = props.targetLabel + tableMeta.columnIndex;
                  return (
                    <>
                      <Tooltip title="settings" placement="top" style={{ marginRight: "10px" }}>
                        <IconButton
                          id={id + tableMeta.rowData[0] + tableMeta.rowIndex}
                          size={props.dense ? "small" : "medium"}
                          onClick={(e) => {
                            const unsortedIndex = rows.findIndex((row) => row.id === tableMeta.rowData[0]);
                            openMenu(
                              e,
                              tableMeta.rowIndex,
                              typeof rows[unsortedIndex] !== "undefined" ? rows[unsortedIndex] : props.rows[unsortedIndex]
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
                  return <div style={{ textAlign: "center" }}>{value ? "Yes" : "No"}</div>;
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
                    <Tooltip title={"See Parcel Details"} placement="top" style={{ marginRight: "10px" }}>
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

                            setSubComponent(<ParcelsDetailCard id={tableMeta.rowData[2]} />);
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

          // Used for snapgrid tables
          case 'ApiNumber':
          case 'Well':
          case 'Operator':
          case 'OwnerName':
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  let disabled = false;
                  let type = 'well'
                  if (column.name === 'Well' && !props.rows[tableMeta.rowIndex]?.well.globalWell) disabled = true;
                  if (column.name === 'ApiNumber' && !props.rows[tableMeta.rowIndex]?.globalWell) disabled = true;
                  if (column.name === 'OwnerName' && !props.rows[tableMeta.rowIndex]?.wellCount > 0) disabled = true;
                  if (column.name === 'Operator' && !props.rows[tableMeta.rowIndex]?.totalWellCount > 0) disabled = true;

                  const coordinates = props.rows[tableMeta.rowIndex]?.coordinates;
                  const data = props.rows.find(row => row.Id === coordinates?.objToPopulateSearchLayer?.objectId);
                  return (
                    <ColumnWithLink
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) {
                          type = coordinates?.objToPopulateSearchLayer?.objectType || type;
                          if (column.name === "Well") coordinates.wellId = props.rows[tableMeta.rowIndex]?.well.globalWell;
                          handleClickFlyToIcon(type, coordinates, true);
                        }
                      }}
                      value={value}
                      link={type === "well" ? (coordinates.wellId ? `/map/wells/${coordinates.wellId}` : "") : `/map/units/${data?._id}`}
                      disabled={disabled}
                    />
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

                  let disabled = false;
                  if (props.targetLabel === "well" && !props.rows[tableMeta.rowIndex]?.globalWell)
                    disabled = true;
                  if (props.targetLabel === "owner" && !props.rows[tableMeta.rowIndex]?.wellCount > 0)
                    disabled = true;
                  if (props.targetLabel === "operator" && !props.rows[tableMeta.rowIndex]?.totalWellCount > 0)
                    disabled = true;

                  return (
                    // this whole implementation is a mesteban patch
                    // it is all kinds of fucked up

                    <Tooltip title="Fly To Map" placement="top" style={{ marginRight: "10px" }}>
                      <IconButton
                        id={`map-fly-to-${tableMeta.rowData[0]}`}
                        size={props.dense ? "small" : "medium"}
                        color="secondary"
                        className={`${classes.icons}`}
                        disabled={disabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          // for unit wells we need to use globalWell instead of wellId
                          if (props.targetLabel === 'owner' || props.targetLabel === 'operator' || props.rows[tableMeta.rowIndex]?.globalWell) {
                            if (props.targetLabel === "well")
                              value.wellId = props.rows[tableMeta.rowIndex]?.globalWell;
                            handleClickFlyToIcon(props.targetLabel, value);
                          } else if (props.parent === "UnitsTable" || props.parent === "search") {
                            const row_line = Object.assign({}, ...tableMeta.rowData.map((item, index) => ({ [props.columns[index]?.name]: item })));
                            openUnitDetailCard(row_line._id);
                          } else if (props.targetLabel === "well") {
                            value.wellId = props.rows[tableMeta.rowIndex]?.globalWell;
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
                  let id = (trueTargetLabel ? trueTargetLabel : props.targetLabel) + tableMeta.columnIndex;

                  let targetSourceId =
                    props.parent === "OwnersPerWell"
                      ? tableMeta.rowData[2]
                      : props.parent === "owner_WellInterests"
                        ? tableMeta.rowData[1]
                        : props.parent === "ownersPerParcel"
                          ? tableMeta.rowData[1]
                          : tableMeta.rowData[0];

                  if (props.parent === "assocTaxRollInterests" && props.targetLabel === "parcel") {
                    targetSourceId = tableMeta.rowData[15];
                  }
                  return (
                    <TrackToggleButton
                      id={id + targetSourceId + tableMeta.rowIndex}
                      target={{ isTracked: value }}
                      targetLabel={trueTargetLabel ? trueTargetLabel : props.targetLabel}
                      targetSourceId={targetSourceId}
                      dark
                      multipleIds={
                        m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1
                          ? m1nSelectedRowsIds
                          : null
                      }
                      multipleTracks={
                        m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1
                          ? m1nSelectedRowsTracks
                          : null
                      }
                      multiSelectMouseHoverColor={
                        m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1
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
          case "agreementNumber":
            {
              column.options = {
                ...column.options,
                customRender: (value, tableMeta) => {
                  value = value?.toString();
                  const splitNumber = value?.split("_");

                  const isSnapGrid = column.options.isSnapGrid || false
                  const row_line = Object.assign({}, ...tableMeta.rowData.map((item, index) => ({ [props.columns[index]?.name]: item })));
                  return (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: '500px',
                        maxWidth: '500px'
                      }}
                    >
                      <Grid container spacing={0} direction="row"
                        style={{
                          position: 'absolute',
                        }}
                        className={classes.agreementNumber}
                      >
                        <Grid item
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <ColumnWithLink
                            value={splitNumber?.[0]
                              ? `${splitNumber?.[0].trim()} - ${row_line.agreementName}`
                              : row_line.agreementName}
                            link={isSnapGrid && tableMeta.rowData[3] ? `/map/${tableMeta.rowData[3].toLowerCase()}s/${row_line.agreementId || tableMeta.rowData[0]}` : `/land/agreement/details/${row_line.agreementId || tableMeta.rowData[0]}`}
                          />
                          {/* <Box
                            onClick={(e) => {
                              e.stopPropagation();

                              if (isSnapGrid && tableMeta.rowData[3])
                                history.push(`/map/${tableMeta.rowData[3].toLowerCase()}s/${tableMeta.rowData[0]}`,
                                  { showAgreementBreadcrumb: false }
                                );
                              else if (!isSnapGrid)
                                history.push(`/land/agreement/details/${tableMeta.rowData[0]}`,
                                  { showAgreementBreadcrumb: true }
                                );
                            }}
                            sx={{
                              color: GlobalStyles.colors.lightBlue,
                              cursor: 'pointer',
                              maxWidth: '300px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              p: 2,
                              "&:hover": {
                                textDecoration: "underline",
                                fontWeight: GlobalStyles.font.boldFontWeight,
                              },
                            }}
                          >
                            {splitNumber?.[0]
                              ? `${splitNumber?.[0].trim()} - ${tableMeta?.rowData[2]}`
                              : tableMeta?.rowData[2]}
                          </Box> */}
                        </Grid>
                      </Grid>
                    </div>

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
                  let targetSourceId =
                    props.parent === "OwnersPerWell"
                      ? tableMeta.rowData[2]
                      : props.parent === "owner_WellInterests"
                        ? tableMeta.rowData[1]
                        : props.parent === "ownersPerParcel"
                          ? tableMeta.rowData[1]
                          : props.parent === "RevenueStatementTable"
                            ? tableMeta.rowData[0]
                            : tableMeta.rowData[0];
                  if (props.parent === "assocTaxRollInterests" && props.targetLabel === "parcel") {
                    targetSourceId = tableMeta.rowData[15];
                  }
                  if (props.parent === "assocTaxRollInterests" && (props.targetLabel === "unit" || props.targetLabel === 'campaignUnit')) {
                    targetSourceId = tableMeta.rowData[2];
                  }
                  if (props.parent === "assocTaxRollInterests" && (props.targetLabel === 'contactUnits')) {
                    targetSourceId = tableMeta.rowData[1];
                  }
                  if (props.parent === "TractInterestsTable" && props.targetLabel === "tractInterest") {
                    targetSourceId = tableMeta.rowData[1];
                  }
                  if (props.parent === "ownersPerUnit" && props.targetLabel === "Unit Ownership") {
                    targetSourceId = tableMeta.rowData[1];
                  }
                  return (
                    //add download and search icons here
                    <GridComments value={value} targetSourceId={targetSourceId} tableMeta={tableMeta} />
                  );
                },
              };
            }
            break;
          case "address":
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
                  if (props.parent === "assocTaxRollInterests" && props.targetLabel === "parcel") {
                    targetSourceId = tableMeta.rowData[15];
                  }

                  return (
                    //add download and search icons here
                    <Tooltip title="Show Address" placement="top" style={{ marginRight: "10px" }}>
                      <IconButton
                        id={id + targetSourceId + tableMeta.rowIndex}
                        color="primary"
                        className={classes.colorIcon}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(value, "_blank", "noopener,noreferrer");
                        }}
                        aria-label="show address"
                        onMouseOver={() => {
                          if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                            multiSelectMouseHoverColor(id, "#dadbde");
                        }}
                        onMouseOut={() => {
                          if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                            multiSelectMouseHoverColor(id, "#efefef");
                        }}
                      >
                        <HomeOutlinedIcon size="large" />
                      </IconButton>
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
                    <Tooltip title={value.length > 0 ? "Wells" : "Not Available"} placement="top" style={{ marginRight: "10px" }}>
                      <Badge badgeContent={value.length > 0 ? value.length : null} color="secondary">
                        <IconButton
                          size={props.dense ? "small" : "medium"}
                          color="primary"
                          className={`${classes.icons} ${!value || value.length === 0 ? classes.noOwnersIcon : ""} ${colInd === tableMeta.columnIndex && rowInd === tableMeta.rowIndex ? classes.iconSelected : ""
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (value && value.length > 0) {
                              handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, value, "wellsPerOwner");
                            }
                          }}
                          aria-label="show owners"
                        >
                          <WellIcon color={value && value.length > 0 ? "#000" : "darkgrey"} opacity="1.0" small />
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
                  if ((props.targetLabel === "deal" || props.targetLabel === "activity") && value === null) {
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
                  }

                  return (
                    <Tooltip title={!value || value === "false" ? "Convert To Contact" : "Contact Details"} placement="top">
                      <IconButton
                        size={props.dense ? "small" : "medium"}
                        color="primary"
                        className={`${classes.icons} ${!value || value === "false" ? classes.noCommentsIcon : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open same model for single contact as we have in multi contact
                          const origIndex = tableMeta.currentTableData[tableMeta.rowIndex].index;
                          const isSelectedRow = m1nSelectedRowsIndexes.find((index) => index === origIndex);
                          if (isSelectedRow === undefined) {
                            m1nSelectedRowsIndexes.push(origIndex);
                          }

                          if (m1nSelectedRowsIndexes?.length > 0) {
                            let selectedRows = m1nSelectedRowsIndexes.map((index) => rows[index]);
                            selectedRows = selectedRows.filter((row) => !row.isContact);
                            if (selectedRows.length > 0) {
                              return handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, selectedRows, "multipleOwnerToContact");
                            }
                          }

                          if (value && value !== "false") {
                            setStateApp((stateApp) => ({
                              ...stateApp,
                              selectedContact: value,
                            }));
                            window.setStateNav((stateNav) => ({
                              ...stateNav,
                              defaultOn: false,
                              contactFromMap: true,
                            }));

                            navController.updateState({
                              selectedModule: ROUTES.CONTACT.module
                            });

                            routeChange(`/contact/details/${value}`);
                            setTitle("Contact Details");
                            setSubTitle(" ");
                          } else {
                            // Code is not used as we are opening different model from above
                            if (props.targetLabel === "owner") {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                {
                                  globalOwner: props.parent === "OwnersPerWell" ? tableMeta.rowData[2] : tableMeta.rowData[0],
                                  entity: tableMeta.rowData[1],
                                },
                                "makeOwnerAContact"
                              );
                            } else if (props.targetLabel === "Parcel Ownership") {
                              handleExpandClick(
                                tableMeta.columnIndex,
                                tableMeta.rowIndex,
                                {
                                  globalOwner: props.parent === "ownersPerParcel" ? tableMeta.rowData[9] : tableMeta.rowData[0],
                                  entity: tableMeta.rowData[1],
                                },
                                "makeOwnerAContact"
                              );
                            } else {
                              handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, tableMeta.rowData[0], "makeOwnerAContact");
                            }
                            // Code is not used as we are opening different model from above
                          }
                        }}
                        aria-label="show contact"
                      >
                        {!value || value === "false" ? (
                          <Convert_contact style={{ margin: "4px" }} />
                        ) : (
                          <Link
                            to={
                              `/contact/details/${value}/?tenant=${window.sessionStorage.getItem("tenantName")}`
                            }
                            onClick={(e) => e.preventDefault()}>
                            <Contact_card style={{ margin: "4px" }} />
                          </Link>
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
                    <Tooltip title={value ? "Owners" : "Not Available"} placement="top" style={{ marginRight: "10px" }}>
                      <Badge badgeContent={value ? value : null} color="secondary">
                        <IconButton
                          size={props.dense ? "small" : "medium"}
                          color="primary"
                          className={`${classes.icons} ${!value ? classes.noOwnersIcon : ""} ${colInd === tableMeta.columnIndex && rowInd === tableMeta.rowIndex ? classes.iconSelected : ""
                            }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (value && value > 0) {
                              handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, tableMeta.rowData[0], "owner");
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
                    <Tooltip title={value.length > 0 ? "Owners" : "Not Available"} placement="top" style={{ marginRight: "10px" }}>
                      <Badge badgeContent={value.length > 0 ? value.length : null} color="secondary">
                        <IconButton
                          size={props.dense ? "small" : "medium"}
                          color="primary"
                          className={`${classes.icons} ${!value || value.length === 0 ? classes.noOwnersIcon : ""}  ${colInd === tableMeta.columnIndex && rowInd === tableMeta.rowIndex ? classes.iconSelected : ""
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
                  if (value && value[0]?.tag) {
                    const length = value.length
                    value[0] = value.map((tag) => tag.tag)
                    value[1] = length
                  }
                  let targetSourceId =
                    props.parent === "OwnersPerWell"
                      ? tableMeta.rowData[2]
                      : props.parent === "owner_WellInterests"
                        ? tableMeta.rowData[1]
                        : props.parent === "ownersPerParcel"
                          ? tableMeta.rowData[1]
                          : tableMeta.rowData[0];

                  if (props.parent === "assocTaxRollInterests" && props.targetLabel === "parcel") {
                    targetSourceId = tableMeta.rowData[15];
                  }
                  if (props.parent === "assocTaxRollInterests" && (props.targetLabel === "unit" || props.targetLabel === 'campaignUnit')) {
                    targetSourceId = tableMeta.rowData[2];
                  }
                  if (props.parent === "TractInterestsTable" && props.targetLabel === "tractInterest") {
                    targetSourceId = tableMeta.rowData[1];
                  }
                  if (props.parent === "ownersPerUnit" && props.targetLabel === "Unit Ownership") {
                    targetSourceId = tableMeta.rowData[1];
                  }
                  return (
                    <div style={{ marginRight: "10px" }}>
                      <Tooltip title={value && value[1] === 0 ? "Add Tags" : "Tags"} placement="top">
                        <Badge
                          id={id + targetSourceId + tableMeta.rowIndex}
                          className={`${classes.TagSample} ${colInd === tableMeta.columnIndex && rowInd === tableMeta.rowIndex ? classes.iconSelected : ""
                            }`}
                          badgeContent={value && value[0] && value[0].length > 0 ? value[1] : 0}
                          color="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleExpandClick(tableMeta.columnIndex, tableMeta.rowIndex, targetSourceId, "tag");
                          }}
                          onMouseOver={() => {
                            if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
                              multiSelectMouseHoverColor(id, "#dadbde");
                          }}
                          onMouseOut={() => {
                            if (m1nSelectedRowsIndexes.indexOf(tableMeta.rowIndex) !== -1 && m1nSelectedRowsIndexes.length > 1)
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
          case " ":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  const row_line = Object.assign({}, ...tableMeta.rowData.map((item, index) => ({ [props.columns[index]?.name]: item })));
                  const docInfo = row_line;
                  const splittedStrings = row_line?.fileName?.split(".");
                  let docExtention = splittedStrings?.[splittedStrings.length - 1]?.toLowerCase();

                  return (
                    <div
                      style={{
                        marginRight: "10px",
                        display: "flex",
                        justifyContent: "left",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFile(
                            props.addAble?.type === "parcelRunsheet" ||
                              props.addAble?.type === "parcelDocument" ||
                              props.addAble?.type === "wellDocument" ||
                              props.addAble?.type === "AgreementDocument" ||
                              props.addAble?.type === "relatedDocument" ||
                              props.addAble?.type === "UnitDocument"
                              ? row_line.fileId
                              : row_line?._id
                          );
                        }}
                      >
                        {props.addAble?.type === "parcelRunsheet" ? (
                          docExtention === "pdf" && <GetAppIcon />
                        ) : (
                          <GetAppIcon />
                        )}

                      </IconButton>

                      {docExtention === "pdf" && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            if (props.addAble?.type === "document") {
                              window.history.pushState("", "", `/documents/${row_line._id}/view`);
                            }
                            openPdf(props.addAble?.type, docInfo)
                          }}
                        >
                          {/* // this is the search icon in the grid on documents */}

                          <PageviewIcon />
                        </IconButton>
                      )}
                    </div>
                  );
                },
              };
            }
            break;
          case "fileName":
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  const row_line = Object.assign(
                    {},
                    ...tableMeta.rowData.map((item, index) => ({
                      [props.columns[index]?.name]: item,
                    }))
                  );
                  var dateTime = null;
                  if (row_line && row_line.uploadedDate) {
                    dateTime = row_line.uploadedDate;
                  }
                  const fileExtension = row_line?.fileName?.split(".")[row_line?.fileName?.split(".").length - 1]?.toLowerCase();
                  const file = row_line?.fileName;
                  const uri = row_line?.fileUrl;

                  return (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      // boxShadow: 'inset -1px 0px 0px 0px lightgrey',
                      // paddingRight: '200px'
                    }}>

                      <div style={{
                        minWidth: 400,
                        maxWidth: 400,
                        boxShadow: 'inset -1px 0px 0px 0px lightgrey',
                        // paddingRight: '200px'
                      }}>
                        <Grid container spacing={0} direction="row" >
                          {/* {
                            props.parent === 'Documents' && <div style={{ position: 'relative', zIndex: 100 }}>
                              <div style={{ position: 'absolute', left: '-30px', top: '15px', fontWeight: 'bold' }}>
                                {tableMeta.rowIndex + 1}
                              </div>
                            </div>
                          } */}
                          <Grid
                            item
                            xs={1}
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                // boxShadow: 'inset -1px 0px 0px 0px lightgrey',
                                cursor: 'pointer'
                              }}

                              onClick={(e) => {
                                e.stopPropagation();
                                const type = row_line?.fileName?.split(".")[row_line?.fileName?.split(".").length - 1]?.toLowerCase();
                                if (type === "pdf") {
                                  if (props.addAble?.type === "document") {
                                    window.history.pushState("", "", `/documents/${row_line._id}/view`);
                                  }
                                  // const selectedRow = rows.find((row) => row._id === row_line._id);
                                  setStateApp((state) => ({
                                    ...state,
                                    pdfView: row_line,
                                    viewDoc: {
                                      uri: row_line.viewToken,
                                      name: row_line.fileName,
                                    },
                                  }));
                                } else {
                                  handleViewFile(row_line._id);
                                }
                              }}
                            >
                              {get_file_icon(fileExtension)}
                            </div>
                            {/* )
                        } */}
                            {/* </div> */}
                          </Grid>

                          <Grid xs={11} item
                          >
                            {/**
                           * This is the document title showing in each row
                           */}
                            <div
                              style={{
                                display: "flex",
                                // alignItems: "center",
                                justifyContent: "flex-start",

                              }}
                            >
                              <p
                                style={{
                                  display: "flex",
                                  cursor: "pointer",
                                  minWidth: "120px",
                                  borderRadius: "7px",
                                  color: "#17aadd",
                                  wordBreak: "break-word",
                                  "&:hover": {
                                    textDecoration: "underline",
                                  },
                                  fontWeight: "bold",
                                  justifyContent: "flex-start",
                                }}

                                onClick={(e) => {
                                  e.stopPropagation();
                                  const type = row_line?.fileName?.split(".")[row_line?.fileName?.split(".").length - 1]?.toLowerCase();
                                  if (type === "pdf") {
                                    if (props.addAble?.type === "document") {
                                      window.history.pushState("", "", `/documents/${row_line._id}/view`);
                                    }
                                    // const selectedRow = rows.find((row) => row._id === row_line._id);
                                    setStateApp((state) => ({
                                      ...state,
                                      pdfView: row_line,
                                      viewDoc: {
                                        uri: row_line.viewToken,
                                        name: row_line.fileName,
                                      },
                                    }));
                                  } else {
                                    handleViewFile(row_line._id);
                                  }
                                }}>

                                <Typography
                                  noWrap
                                  color="inherit"
                                >
                                  {value}
                                </Typography>

                              </p>

                            </div>
                          </Grid>
                        </Grid>
                      </div>
                      <div
                        style={{
                          paddingRight: '40px'
                        }}
                      ></div>
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

                    <div
                      style={{
                        width: '350px',
                      }}>
                      <CellContentEdition
                        id={tableMeta.rowData[0]}
                        entityId={tableMeta.rowData[1]}
                        content={{
                          address1: tableMeta.rowData[props.columns.findIndex((val) => val.name === "address1")],
                          address2: tableMeta.rowData[props.columns.findIndex((val) => val.name === "address2")],
                          city: tableMeta.rowData[props.columns.findIndex((val) => val.name === "city")],
                          state: tableMeta.rowData[props.columns.findIndex((val) => val.name === "state")],
                          zip: tableMeta.rowData[props.columns.findIndex((val) => val.name === "zip")],
                          country: tableMeta.rowData[props.columns.findIndex((val) => val.name === "country")],
                        }}
                        targetLabel={props.targetLabel}
                        nonEditable={!column.editable}
                        isLinked
                        toLink={value}
                      />
                    </div>
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
                    <span style={{ paddingLeft: 10, paddingRight: 10 }}>{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                  );
                } else {
                  return <span style={{ paddingLeft: 10, paddingRight: 10 }}>0</span>;
                }
              },
            };
            break;
          case "isAmountValidated":
            column.options = {
              ...column.options,
              customBodyRender: (value, tableMeta) => {
                return (
                  <>
                    {value && (
                      <div className="flex justifyCenter alignCenter success w-100">
                        <CheckCircle size={20} />
                      </div>
                    )}

                    {!value && (
                      <div
                        className="flex justifyCenter alignCenter warning w-100"
                        onMouseOver={() => (document.getElementById(`alertTootip${tableMeta.rowIndex}`).style.display = "block")}
                        onMouseOut={() => (document.getElementById(`alertTootip${tableMeta.rowIndex}`).style.display = "none")}
                        style={{ marginRight: 6, position: "relative", zIndex: 100 }}
                      >
                        <WarningIcon />

                        <div id={`alertTootip${tableMeta.rowIndex}`} className={classes.tooltip}>
                          <p style={{ fontSize: 14, lineHeight: "120%", textAlign: "left" }}>Sum of check details does not match check amount</p>
                        </div>
                      </div>
                    )}
                  </>
                );
              },
            };
            break;
          case "number":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                const splitNumber = value?.split("_");
                let styles = { ...column.style };
                if (props.parent === "CheckDetailsTable") {
                  styles = { ...styles, fontWeight: 600, color: "#17aadd", cursor: "pointer" };
                }
                return <p style={styles}>{splitNumber?.[0]}</p>;
              },
            };
            break;
          // case "checkNumber":
          //   column.options = {
          //     ...column.options,
          //     customBodyRender: (value) => {
          //       let styles = { ...column.style };
          //       styles = { ...styles, fontWeight: 600, color: "#17aadd", cursor: "pointer" };
          //       return value ? <p style={styles}>{value}</p> : <span style={{ color: "#959595" }}>N/A</span>;
          //     },
          //   };
          //   break;
          case "offer_price":
            if (props.targetLabel === "Unit Ownership" || props.parent === "ownersPerUnit") {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta) => {
                  const { columnIndex, rowData, rowIndex } = tableMeta;
                  const row = props?.rows?.[rowIndex];
                  const isManual = !!row?.maualOverrides?.offer_price;
                  return (
                    <>
                      <span style={{ padding: 10 }}>{vf_currency(value)}</span>
                      {isManual && (
                        <IconButton
                          aria-label="cached"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAutoCalculateClick(row._id);
                          }}
                        >
                          <CachedIcon />
                        </IconButton>
                      )}
                    </>
                  );
                },
              };
            }
            break;
          case "checkAmount":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return value ? <p style={{ fontWeight: 600 }}>{value}</p> : <span style={{ color: "#959595" }}>N/A</span>;
              },
            };
            break;

          case "status" && props.parent !== "Documents":
            column.options = {
              ...column.options,
              customBodyRender: (value, tableMeta) => {
                const status = contactStatusOptions.find(s => s.value === value)
                return (
                  <>
                    {props.parent === 'Contacts' && (
                      value ? <p>{status ? status.label : value}</p> : <span style={{ color: "#959595" }}>N/A</span>
                    )}
                    {props.parent === "RevenueStatementTable" && (
                      <div className="flex justifyStart alignCenter">
                        {value?.toLowerCase() === "approved" && (
                          <div style={{ background: "#17c10d", height: 12, width: 12, marginRight: 8, borderRadius: "50%" }} />
                        )}
                        {value?.toLowerCase() === "imported" && (
                          <div style={{ background: "#ffa800", height: 12, width: 12, marginRight: 8, borderRadius: "50%" }} />
                        )}
                        {value}
                      </div>
                    )}
                    {props.parent === "RevenuePropertiesTable" && (
                      <>
                        {value?.toLowerCase() === 'notinpay' && (
                          'Not in Pay'
                        )}
                        {value?.toLowerCase() === 'inpay' && (
                          'In Pay'
                        )}
                        {/* {value?.toLowerCase() === 'approved' && (
                          <div className="flex justifyCenter alignCenter success w-100">
                            <CheckCircle size={20} />
                          </div>
                        )}
                        {value?.toLowerCase() === 'unapproved' && (
                          <div className={`flex justifyCenter alignCenter w-100 ${classes.customWarning}`}>
                            <WarningIcon size={20} />
                          </div>
                        )} */}
                      </>
                    )}
                    {props.parent === "AgreementsTable" && (
                      <div style={{ display: "flex", "align-items": "center" }}>
                        {value?.toLowerCase() === "approved" ? (
                          <div style={{ background: "#17c10d", height: 12, "min-width": 12, marginRight: 8, borderRadius: "50%" }} />
                        ) : (
                          <div style={{ background: "#ffa800", height: 12, "min-width": 12, marginRight: 8, borderRadius: "50%" }} />
                        )}
                        {value}
                      </div>
                    )}
                  </>
                );
              },
            };
            break;
          case "tractName":
            column.options = {
              ...column.options,
              customBodyRender: (value, tableMeta, updateValue) => {
                return (
                  <>
                    {/* {props.parent === "TractsTable" && (
                      <p
                        onClick={(e) => {
                          e.stopPropagation();
                          if (tableMeta.rowData[0]) {
                            history.push(`/tract/details/${tableMeta.rowData[0]}`);
                          }
                        }}
                        style={{ fontWeight: 600, color: "#17aadd", cursor: "pointer" }}
                      >
                        {value}
                      </p>
                    )} */}
                    {(props.parent === "RevenueStatementTable" || props.parent === "RevenuePropertiesTable") ? (
                      <div className={classes.flexAlign}>
                        {value?.toLowerCase() === "approved" ? (
                          <div className={classes.activeBadge} />
                        ) : value?.toLowerCase() === "pending" ? (
                          <div className={classes.pendingBadge} />
                        ) : value?.toLowerCase() === "declined" ? (
                          <div className={classes.declinedBadge} />
                        ) : (
                          <div className={classes.statusBtnDiv}>
                            <div className={classes.approveBtn}>Approve</div>
                            <div className={classes.declineBtn}>Decline</div>
                          </div>
                        )}
                        <div>{value}</div>
                      </div>
                    ) : <div>{value}</div>}
                  </>
                );
              },
            };
            break;
          case "propertyCode":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <>
                    <p className={classes.clickableCell}>{value}</p>
                  </>
                );
              },
            };
            break;
          case "propertyName":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <>
                    <p className={classes.propertyName}>{value}</p>
                  </>
                );
              },
            };
            break;
          case "ownersCount":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <>
                    <p>{value}</p>
                  </>
                );
              },
            };
            break;
          case "unitStatus":
            column.options = {
              ...column.options,
              customBodyRender: (value) => {
                return (
                  <div style={{ width: 250 }}>
                    {value ? (
                      <StackedBarChart data={value} hideLegends eachBarHeight={5} />
                    ) : (
                      <p>N/A</p>
                    )}
                  </div>
                );
              },
            };
            break;
          default:
            //// this is where the column names get mapped
            {
              column.options = {
                ...column.options,
                customBodyRender: (value, tableMeta, updateValue) => {
                  if (column.isCustom && (column.type === "multiselect" || column.type === "dropdown")) {
                    let value = null;
                    if (props?.rows?.length > 0 && props.rows[tableMeta.rowIndex]?.custom_data) {
                      value = props.rows[tableMeta.rowIndex].custom_data[`${column.name}`];
                    }
                    return (
                      <div className={classes.gridElementStyling}>
                        <ReactSelectField
                          tooltipView={true}
                          isSingleSelect={column.type !== "multiselect"}
                          dropdownOptions={column.dropdownOptions}
                          index={tableMeta.rowIndex}
                          column={column}
                          value={value}
                          id={column.label}
                          onCustomKeyChange={(value) => props.onCustomKeyChange(value, tableMeta.rowIndex, column.name)}
                        />
                      </div>
                    );
                  }

                  if (column.isCustom && column.type === "text") {
                    let value = null;
                    if (props?.rows?.length > 0 && props.rows[tableMeta.rowIndex]?.custom_data) {
                      value = props.rows[tableMeta.rowIndex].custom_data[`${column.name}`];
                    }
                    return (
                      <CustomFieldText
                        value={value}
                        onCustomKeyChange={(value) => props.onCustomKeyChange(value, tableMeta.rowIndex, column.name)}
                      />
                    );
                  }

                  if (column.name === "isClosed" && (props.targetLabel === "activity" || props.targetLabel === "activitiesDashboard") && value === true)
                    return (
                      <div style={{ textAlign: "center" }}>
                        <CheckIcon id="checkIcon" />
                      </div>
                    );

                  if (column.name === "isClosed" && (props.targetLabel === "activity" || props.targetLabel === "activitiesDashboard") && value === false)
                    return <div style={{ textAlign: "center" }}>--</div>;

                  ////// if non editable column
                  if (
                    (!column.editable &&
                      props.targetLabel === "Parcel Ownershipship" &&
                      column.name === "name" &&
                      tableMeta.rowData[11] !== "false") ||
                    ((column.name === "end" || column.name === "start") && props.targetLabel === "activity")
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
                        style={props.targetLabel === "activity" ? { minWidth: "175px" } : {}}
                        className={classes.cellDataDiv}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        {valueFormatter(column, value)}
                      </div>
                    );
                  }

                  if (props.targetLabel === 'Revenue Properties') {
                    return value ? <p>{value}</p> : null
                  }

                  return (
                    <div
                      style={{
                        // display: "flex",
                        // alignItems: "center",
                        // justifyContent: "left",
                        ...column.style
                      }}
                      className={`${props.parent === "assocTaxRollInterests" &&
                        props.addAble?.type === "wellInterest" &&
                        (!tableMeta.rowData[15] || tableMeta.rowData[20])
                        ? [classes.blue]
                        : []
                        }`}
                    >
                      {props.targetLabel === "contact" && column.name !== "name" && (
                        <CellContentEdition
                          id={tableMeta.rowData[0]}
                          content={{ [column.name]: valueFormatter(column, value) }}
                          targetLabel={props.targetLabel}
                          dropDownOptions={column.dropDownOptions ? column.dropDownOptions : null}
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
                      {/*
                      // this is for the UNIT name section.
                      // it is not in the case statement b/c multipe datapoints have the name: called "name"
                      // we will need to somehow eventually refactor this as it is annoying
                      */}

                      {/* {(props.targetLabel === "unit" || props.targetLabel === 'campaignUnit') && column.name === "name" && (

                          <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Grid container spacing={0} direction="row"
                              style={{
                                position: 'absolute',
                              }}
                              className={classes.agreementNumber}
                            >
                              <Grid item
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-start",
                                }}
                              >

                                <Box sx={{
                                    color: GlobalStyles.colors.lightBlue,
                                    cursor: 'pointer',
                                    maxWidth: '300px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    p: 2,
                                    "&:hover": {
                                      textDecoration: "underline",
                                      fontWeight: GlobalStyles.font.boldFontWeight,
                                    },

                                  }}
                                  >
                                    {tableMeta?.rowData[2]}
                                </Box>
                              </Grid>

                            </Grid>
                          </div>
                          </div>
                      )} */}



                      {/* // standard document grid elements */}
                      {props.targetLabel === "documents" && (gridElement(value))}



                      {props.targetLabel !== "contact" && props.targetLabel !== "documents" && (
                        <CellContentEdition
                          id={tableMeta.rowData[0]}
                          content={{ [column.name]: valueFormatter(column, value) }}
                          targetLabel={props.targetLabel}
                          dropDownOptions={column.dropDownOptions ? column.dropDownOptions : null}
                          entityId={
                            props.targetLabel === "Parcel Interest" ||
                              props.targetLabel === "Parcel Ownershipship" ||
                              props.targetLabel === "Unit Ownershipship" ||
                              props.targetLabel === "contact"
                              ? tableMeta.rowData[1]
                              : null
                          }
                          nonEditable={!column.editable}
                        />
                      )}


                      {props.targetLabel === "Unit Ownership" && column.name === "name" && (
                        <FeatureFlag feature={FEATURES.IDICORE}>
                          <span> {tableMeta.rowData[18] && <RequestPageIcon color="grey" fontSize="8px" />}</span>
                        </FeatureFlag>
                      )}

                      {props.parent === "ownersPerParcel" && column.name === "name" && (
                        <FeatureFlag feature={FEATURES.IDICORE}>
                          <span> {tableMeta.rowData[props.columns.findIndex(
                            (val) => val.name === "isPurchased"
                          )] && <RequestPageIcon color="grey" fontSize="8px" />}</span>
                        </FeatureFlag>
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
  }, [props.columns, props.rows, rows, colInd, rowInd, m1nSelectedRowsTracks, m1nSelectedRowsIndexes, m1nSelectedRowsIds]);

  const openUnitDetailCard = (unitId) => {
    mapControlsController.updateState({
      mapGridCardActivated: false,
    });
    history.push(`/map/units/${unitId}`);
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setColInd(null);
    setRowInd(null);
    setExpandedObject(null);
    // setStateApp({ ...stateApp, isEditSelectedProfileName: null });
    setStateApp((stateApp) => ({
      ...stateApp,
      isEditSelectedProfileName: null,
    }));
    setM1nSelectedRowsIndexes([]);
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
      popupController.reset();
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
      <ContactDetailCard selectRowOpenContact={selectRowOpenContact} handleCloseExpandableCard={handleCloseExpandableCard} />
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
        case "owner":
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

  useEffect(() => {
    setSearchedRows(rows);
  }, [rows]);

  useEffect(() => {
    if (!props.selectedRowsValues || !m1nSelectedRowsIds) return
    if (props.selectedRowsValues.length < m1nSelectedRowsIds.length) return

    let selectedRowsIds = props.selectedRowsValues.map((row) => {
      if (props.parent === "OwnersPerWell") return row.globalOwnerId;
      if (props.parent === "owner_WellInterests") return row.wellId;
      if (props.parent === "TractsTable") return row.contact._id;
      if (row.id) return row.id;
      if (row.Id) return row.Id;
      if (row._id) return row._id;
    });

    setM1nSelectedRowsIds(selectedRowsIds);
  }, [props.selectedRowsValues]);

  const searchData = (tableState) => {
    let rows = [];
    if (tableState.searchText) {
      for (let i = 0; i < props.rows.length; i++) {
        for (const key of Object.keys(props.rows[i])) {
          const col = columns.find((column) => column.name === key);
          if (col && (!col.options || col.options.searchable !== false)) {
            if (typeof props.rows[i][key] === "string") {
              const value = props.rows[i][key].toLowerCase();
              if (value.includes(tableState.searchText.toLowerCase())) {
                rows.push(props.rows[i]);
                break;
              }
            }
          }
        }
      }
    } else {
      rows = JSON.parse(JSON.stringify(props.rows));
    }
    const filteredRows = JSON.parse(JSON.stringify(rows));
    for (let j = 0; j < tableState.filterList.length; j++) {
      if (tableState.filterList[j].length > 0) {
        for (let i = 0; i < filteredRows.length; i++) {
          const isFiltered = filteredRows[i].isFiltered !== false;
          const rowdata = filteredRows[i][columns[j].name];
          const filter = tableState.filterList[j][0];
          if (isFiltered && rowdata !== filter) {
            filteredRows[i].isFiltered = false;
          }
        }
      }
    }
    setSearchedRows(filteredRows.filter((row) => row.isFiltered !== false));
  };
  const options = {
    filterType: "dropdown",
    rowsPerPage: rowsPerPage ? rowsPerPage : 25,
    rowsPerPageOptions: props.rows && props.rows.length > 25 ? [10, 25, 50, 100] : props.rows && props.rows.length > 10 ? [10, 25] : [],
    selectableRows: props.targetLabel === "production_detail" ? false : "multiple",
    print: false,
    download:
      props.parent === "assocTaxRollInterests" ||
        props.parent === "OwnersPerWell" ||
        props.parent === "RevenueStatementTable" ||
        props.parent === "CheckDetailsTable"
        ? true
        : false,
    viewColumns: props.targetLabel !== "usermanagement",

    onColumnViewChange: (changedColumn, action) => {
      if (props.parent === "Contactss" && columns && (action === "add" || action === "remove") && changedColumn)
        props.setColumnsBase([
          ...columns.map((column) => {
            if (column.name === changedColumn)
              if (action === "add")
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
        let indexArray = rowsSelected.map((d) => d.dataIndex).sort((a, b) => a - b);
        if (rows && indexArray) {
          if (rows.length > 0 && indexArray.length > 0) {
            let selectedRows = rows.filter((row, index) => indexArray.indexOf(index) !== -1);
            let selectedRowsIds = selectedRows.map((row) => {
              if (props.parent === "OwnersPerWell") return row.globalOwnerId;
              if (props.parent === "owner_WellInterests") return row.wellId;
              if (props.parent === "TractsTable") return row.contact._id;
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

      if (props.onRowSelectionChange) {
        props.onRowSelectionChange(currentRowsSelected, rowsSelected);
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

          // if (props.addAble?.type === "suggestedOwnerToParcel") {
          //   return (
          //     <div style={{ height: "48px", display: "flex" }}>
          //       <div
          //         style={{
          //           marginTop: "6px",
          //           height: "35px",
          //           display: "flex",
          //           marginRight: "20px",
          //         }}
          //       >
          //         <Button
          //           color="secondary"
          //           className={classes.multiSelectionTopBarButtons}
          //           disabled={props.addAble?.type === "suggestedOwnerToParcel" && m1nSelectedRowsIndexes.length === 0}
          //           onClick={() => {
          //             const parcelInterests = m1nSelectedRowsIndexes.map((index) => rows[index])
          //             return handleExpandClick(null, null, parcelInterests, "multipleOwnerToContact");
          //             // props.suggestedOwnerToParcel(m1nSelectedRowsIndexes, setSelectedRow);
          //           }}
          //         >
          //           + ADD TO PARCEL
          //         </Button>
          //       </div>
          //     </div>
          //   );
          // }
          if (props.addAble?.type === "parcelDocument") {
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
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteParcelDocument");
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
          if (props.addAble?.type === "wellDocument") {
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
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteWellDocument");
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
          if (props.addAble?.type === "parcelRunsheet") {
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
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteParcelRunsheet");
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
          if (props.addAble?.type === "TractInterests" && (props.parent === "assocTaxRollInterests" || props.parent === "contactAssocTaxRollInterests")) {
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
                    marginRight: "5px",
                    height: "35px",
                    display: "flex",
                  }}
                >
                  <Button
                    color="secondary"
                    className={classes.multiSelectionTopBarButtons}
                    style={{ width: "200px" }}
                    disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length < 1}
                    onClick={() => {
                      setStateApp((stateApp) => ({
                        ...stateApp,
                        dealDialog: true,
                        addExistingDeal: true,
                        addType: props.parent === "contactAssocTaxRollInterests" ? "tractInterests" : "interests",
                        interestsIds: m1nSelectedRowsIds,
                        activeDeal: { cardId: null, laneId: null },
                      }));
                    }}
                  >
                    + ADD TO DEAL
                  </Button>
                </div>
              </div>
            );
          }
          if (props.addAble?.type === "wellInterest" && props.parent === "ownersPerUnit") {

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

                  <FeatureFlag feature={FEATURES.IDICORE}>
                    <Button
                      color="secondary"
                      startIcon={<RequestPageIcon color="white" />}
                      className={classes.multiSelectionTopBarButtons}
                      disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length < 1}
                      onClick={() => handleExpandClick(null, null, getSelectedRows(), "buyContactsInfoData")}
                    >
                      Contact Data
                    </Button>
                  </FeatureFlag>

                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteWellInterest");
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
          if (props.addAble?.type === "wellInterest") {
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
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteWellInterest");
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon id="deleteWellInterest" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            );
          }


          if (
            props.header === "Owner's Contacts" ||
            props.header === "Contacts" ||
            props.header === "Active Users" ||
            props.header === "Documents"
          ) {
            const getSelectedRows = () => {
              const selectedRows = [];
              if (_selectedRows.length > 0)
                return _selectedRows;

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
                  {props.header !== "Active Users" && props.header !== "Documents" && (
                    <>
                      {/* {m1nSelectedRowsIndexes?.length > 1 && ( */}
                      <FeatureFlag feature={FEATURES.IDICORE}>
                        <Button
                          color="secondary"
                          startIcon={<RequestPageIcon color="white" />}
                          className={classes.multiSelectionTopBarButtons}
                          disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length < 1}
                          onClick={() => {
                            // const rows = getSelectedRows();
                            // const contacts = [];
                            // for (let i = 0; i < rows.length; i++) {
                            //   if (!rows[i].firstName || !rows[i].lastName || !rows[i].address1) {
                            //     contacts.push(rows[i]);
                            //   }
                            // }
                            // setContactDataMissing(contacts);
                            // if (contacts.length > 0) {
                            //   handleExpandClick(null, null, getSelectedRows(), "contactDataMissing");
                            // } else {
                            handleExpandClick(null, null, getSelectedRows(), "buyContactsInfoData");
                            // }
                          }}
                        >
                          Contact Data
                        </Button>
                      </FeatureFlag>
                      <Button
                        color="secondary"
                        startIcon={<EditIcon />}
                        className={classes.multiSelectionTopBarButtons}
                        disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length < 1}
                        onClick={() => {
                          handleExpandClick(null, null, getSelectedRows(), "asign");
                        }}
                      >
                        Bulk Update
                      </Button>

                      <Button
                        color="secondary"
                        startIcon={<MergeTypeIcon />}
                        className={classes.multiSelectionTopBarButtons}
                        disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length <= 1}
                        onClick={() => {
                          handleExpandClick(null, null, getSelectedRows(), "merge");
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
                          handleExpandClick(null, null, getSelectedRows(), "sendMailers");
                        }}
                      >
                        Mailers
                      </Button>
                      <FeatureFlag feature={FEATURES.CONTACTGRIDEXPORT}>
                        <Button
                          color="secondary"
                          startIcon={<CloudDownloadIcon color="white" />}
                          className={classes.multiSelectionTopBarButtons}
                          onClick={() => {
                            let owners = [];
                            const rows = _selectedRows?.length > 0 ? _selectedRows : props.rows
                            for (let i in props.selectedRows) {
                              owners.push(rows[props.selectedRows[i].dataIndex]);
                            }
                            props.setSelectedRows && props.setSelectedRows(owners);
                            // props.setOpenCustomDialog("exportContacts");
                            handleExpandClick(null, null, getSelectedRows(), "exportContacts");
                          }}
                        >
                          Export
                        </Button>
                      </FeatureFlag>

                      <Divider orientation="vertical" flexItem />
                    </>
                  )}
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        if (props.header === "Documents") {
                          handleExpandClick(null, null, null, "deleteDocument");
                        } else if (props.header !== "Active Users") {
                          handleExpandClick(null, null, null, "deleteContact");
                        } else {
                          handleExpandClick(null, null, null, "deleteUser");
                        }
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
            const getSelectedRows = () => {
              const selectedRows = [];
              for (let i = 0; i < m1nSelectedRowsIndexes.length; i++) {
                rows[m1nSelectedRowsIndexes[i]]._id = rows[m1nSelectedRowsIndexes[i]].isContact;
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

                  <FeatureFlag feature={FEATURES.IDICORE}>
                    <Button
                      color="secondary"
                      startIcon={<RequestPageIcon color="white" />}
                      className={classes.multiSelectionTopBarButtons}
                      disabled={!m1nSelectedRowsIndexes || m1nSelectedRowsIndexes.length < 1}
                      onClick={() => handleExpandClick(null, null, getSelectedRows(), "buyContactsInfoData")}
                    >
                      Contact Data
                    </Button>
                  </FeatureFlag>
                  <Tooltip title={"Delete"}>
                    <IconButton
                      size="medium"
                      style={{ margin: "0 5px" }}
                      onClick={(e) => {
                        handleExpandClick(null, null, null, "deleteParcelOwnership");
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

          //// if Parcel Interest set the multi selection top bar: ////
          if (props.targetLabel === "Parcel Interest") {
            return (
              <Tooltip title={"Delete"}>
                <IconButton
                  size="medium"
                  style={{ margin: "0 5px" }}
                  onClick={(e) => {
                    handleExpandClick(null, null, null, "deleteParcelInterest");
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
      let buttonLabel = "+ ADD",
        menuOptions = {};
      if (props.addAble?.type === "contact") {
        buttonLabel = "+ ADD CONTACT";
        menuOptions = {
          text: "Import Contacts",
          isShow: true,
          action: () => routeChange("/bulkupload"),
        };
      }
      if (props.addAble?.type === "wellInterest" || props.addAble?.type === "parcelInterest") {
        buttonLabel = "+ ADD INTEREST";
      }
      if (props.addAble?.type === "deals") {
        buttonLabel = "ADD NEW DEAL";

        menuOptions = {
          text: "Add to Existing Deal",
          isShow: true,
          action: () => {
            setStateApp((stateApp) => ({
              ...stateApp,
              dealDialog: true,
              addExistingDeal: true,
              activeDeal: { cardId: null, laneId: null },
            }));

          },
        };
      }
      if (props.addAble?.type === "ownerToParcel" || props.addAble?.type === "ownerToUnit") {
        buttonLabel = "+ ADD INTEREST OWNER";
        menuOptions = {
          text: "Import Interest Owners",
          isShow: true,
          action: () => {
            window.setStateNav((stateNav) => ({
              ...stateNav,
              bulkUploadFromMap: true,
              bulkUploadParcel: popupController.getValue('selectedParcel')
            }));
            navController.updateState({
              bulkUploadFromMap: true,
              bulkUploadParcel: popupController.getValue('selectedParcel'),
            })
            routeChange("/bulkupload");
          },
        };
      }

      if (props.addAble?.type === "suggestedOwnerToParcel") {
        buttonLabel = "+ ADD TO PARCEL";
      }
      if (props.addAble?.type === "parcelDocument" || props.addAble?.type === "wellDocument") {
        buttonLabel = "ADD DOCUMENT";
      }
      if (props.addAble?.type === "parcelRunsheet") {
        buttonLabel = "+ ADD INSTRUMENT";
      }
      if (props.addAble?.type === "document") {
        buttonLabel = "ADD DOCUMENT";
      }
      if (props.addAble?.type === "revenueStatementDetails") {
        buttonLabel = "INPUT MODE";
      }

      const addAction = (e) => {
        e.stopPropagation();
        if (props.addAble?.type && props.addAble?.type === "contact") handleExpandClick(null, null, null, "addContact");
        if (props.addAble?.type && props.addAble?.type === "ownerToParcel") {
          handleExpandClick(null, null, null, "addOwnerToParcel");
        }
        if (props.addAble?.type && props.addAble?.type === "ownerToUnit") {
          handleExpandClick(null, null, null, "addOwnerToUnit");
        }

        if (props.addAble?.type && props.addAble?.type === "deals")
          setStateApp((stateApp) => ({
            ...stateApp,
            dealDialog: true,
            activeDeal: { cardId: null, laneId: null },
          }));

        if (props.addAble?.type && props.addAble?.type === "wellInterest") {
          setStateApp((stateApp) => ({
            ...stateApp,
            wellInterestDialog: true,
            //activeDeal: { cardId: null, laneId: null },
          }));
        }

        if (props.addAble?.type && props.addAble?.type === "parcelInterestsToEntity")
          // handleExpandClick(null, null, null, "addOwnerToParcel");
          handleExpandClick(null, null, null, "addParcelInterestsToEntity");
        if (props.addAble?.type === "revenueStatementDetails") {
          const checkId = window.location.pathname.split("/")[window.location.pathname.split("/").length - 1];
          routeChange(`/revenue/statement/${checkId}/line-item`);
        }

      };

      const options = [
        {
          text: buttonLabel,
          isShow: false,
          action: addAction,
        },
        menuOptions,
      ];

      return (
        <>
          <div
            style={
              props.addAble?.type === "contact" ? {
                marginRight: "105px",
                marginTop: "5px",
              } : {
                display: "inline",
                float: "left",
                marginRight: "15px",
                marginTop: "5px",
              }}
          >
            {props.addAble?.type === "parcelInterest" && (
              <Button color="secondary" className={classes.multiSelectionTopBarButtons} disabled={true} onClick={() => { }}>
                {buttonLabel}
              </Button>
            )}
            {props.addAble?.type === "parcelRunsheet" && (
              <Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={() => props.onClickAdd()}>
                {buttonLabel}
              </Button>
            )}
            {(props.addAble?.type === "parcelDocument" || props.addAble?.type === "wellDocument") && (
              <Button
                color="secondary"
                className={classes.multiSelectionTopBarButtons}
                onClick={() => {
                  setStateApp((stateApp) => ({
                    ...stateApp,
                    selectedDocument: {},
                  }));
                  props.onClickAdd();
                }}
              >
                <PostAddIcon />
                {buttonLabel}
              </Button>
            )}
            {(props.addAble?.type === "wellInterest" ||
              props.addAble?.type === "suggestedOwnerToParcel" ||
              props.addAble?.type === "revenueStatementDetails") && (
                <Button
                  color="secondary"
                  className={classes.multiSelectionTopBarButtons}
                  disabled={props.addAble?.type === "suggestedOwnerToParcel" && m1nSelectedRowsIndexes.length === 0}
                  onClick={addAction}
                >
                  {buttonLabel}
                </Button>
              )}
            {(
              props.addAble?.type === "deals" ||
              props.addAble?.type === "contact" ||
              props.addAble?.type === "ownerToParcel" ||
              props.addAble?.type === "ownerToUnit") && (
                <ButtonDropDown options={options} />
              )}

            {props.header === "Documents" && (
              <ButtonGroup variant="contained" style={{ height: "40px" }} color="primary" aria-label="split button">
                <Button
                  id="addDocument"
                  color="primary"
                  size="small"
                  aria-label="select merge strategy"
                  aria-haspopup="menu"
                  onClick={() => {
                    setStateApp({
                      ...stateApp,
                      DocumentDrawer: true,
                      selectedDocument: {},
                    });
                  }}
                >
                  <PostAddIcon></PostAddIcon>
                  Add Document
                </Button>
              </ButtonGroup>
            )}

            {props.addAble?.type === "contact" && (
              <div style={{ display: "inline", position: "absolute", right: "120px", top: "5px" }}>
                <IconButton onClick={props.onDownload} disabled={props.isExporting}>
                  <Tooltip title="Download CSV" aria-label="add">
                    <CloudDownloadIcon />
                  </Tooltip>
                </IconButton>
              </div>
            )}
            {props.addAble?.type === "contact" && (
              <>
                <FeatureFlag feature={FEATURES.IDICORE}>
                  <Button
                    color="secondary"
                    startIcon={<RequestPageIcon color="#B3B3B3" />}
                    className={classes.multiSelectionTopBarButtons}
                    disabled
                  >
                    Contact Data
                  </Button>
                </FeatureFlag>
                <Button
                  color="secondary"
                  startIcon={<EditIcon />}
                  className={classes.multiSelectionTopBarButtons}
                  disabled
                >
                  Bulk Update
                </Button>
                <Button color="secondary" startIcon={<MergeTypeIcon />} className={classes.multiSelectionTopBarButtons} disabled>
                  Merge
                </Button>
                <Button color="secondary" startIcon={<EmailRoundedIcon />} className={classes.multiSelectionTopBarButtons} disabled>
                  Mailers
                </Button>
              </>
            )}
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

      if (props.parent === "assocTaxRollInterests" && props.targetLabel === "well" && props.addAble?.type !== "taxrollInterest") {
        let card = { ...rows[dataIndex] };
        setStateApp((stateApp) => ({
          ...stateApp,
          wellInterestDialog: true,
          activeWellInterest: card,
        }));
      }

      if (props.targetLabel === "activity") {
        if (rows[dataIndex]?._id) {
          window.history.pushState("", "", `/calendar/activities/${rows[dataIndex]._id}`);
          setStateApp((stateApp) => ({
            ...stateApp,
            selectedActivityId: rows[dataIndex]._id,
            activityDialog: true,
          }));
        }
      }

      if ((props.parent === "assocTaxRollInterests" && props.targetLabel === "parcel") || props.targetLabel === "Parcel Ownership") {
        if (rows[dataIndex]?._id) {
          setOpenDialog("addOwnerToParcel");
          setSelectedRow(rows[dataIndex]);
        }
      }

      if (props.targetLabel === "Unit Ownership") {
        if (rows[dataIndex]?._id) {
          setOpenDialog("addOwnerToUnit");
          setSelectedRow(rows[dataIndex]);
        }
      }

      // if (props.targetLabel === "contact") {
      //   setStateApp((stateApp) => ({
      //     ...stateApp,
      //     selectedContact: rows[dataIndex]._id,
      //   }));
      //   routeChange(`/contact/details/${rows[dataIndex]._id}`);
      //   setTitle("Contact Details");
      //   setSubTitle(" ");
      //   handleOpenExpandableCard();
      // }

      if (props.targetLabel === "documents") {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedDocument: rows[dataIndex],
        }));
      }
      if (props.targetLabel === "parcelDocument" || props.targetLabel === "wellDocument") {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedDocument: rows[dataIndex],
        }));
        props.onClickAdd();
      }
      if (props.targetLabel === "parcelRunsheet") {
        setStateApp((stateApp) => ({
          ...stateApp,
          selectedAgreement: rows[dataIndex],
        }));
        props.onClickAdd();
      }

      // if (props.targetLabel === "Revenue Properties") {
      //   // need stopPropagation
      //   history.push(`/revenue/property/details/${rows[dataIndex]?._id}`);
      // }
      // if (props.parent === "RevenueStatementTable") {
      //   if (rows[dataIndex]?._id) {
      //     history.push(`/revenue/statement/details/${rows[dataIndex]?._id}`);
      //   }
      // }
    },

    onChangePage: (pageState) => {
      setPageInd(pageState);
    },
    customSort: (data, colIndex, order) => {
      let temp_rows = [];
      let temp_rows_per_page = rowsPerPage ? rowsPerPage : 25;
      let temp = data.filter((item) => item.data[1] !== "Cumulative");
      let insertInBetween = temp_rows_per_page - 1;
      let cumulative_array = Object.values(cumulative);
      let temp_cumulative_array = [];
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
            return (a.data[colIndex] < b.data[colIndex] ? -1 : 1) * (order === "desc" ? 1 : -1);
          });
        }

        temp_rows.splice(insertInBetween, 0, { data: cumulative_array });

        return temp_rows;
      } else {
        const result_data = data.sort((a, b) => {
          const aTest = typeof a.data[colIndex] === 'string' ? a.data[colIndex].toLowerCase() : a.data[colIndex];
          const bTest = typeof b.data[colIndex] === 'string' ? b.data[colIndex].toLowerCase() : b.data[colIndex];

          return (aTest == null) - (bTest == null) || (aTest < bTest ? -1 : 1) * (order === "desc" ? 1 : -1);
        });

        return result_data;
      }
    },
    onChangeRowsPerPage: (numberOfRows) => {
      if (props.total === true) {
        switch (props.parent) {
          case "production_WellDetails":
            let trimmed = rows.filter((item) => item.ReportDate !== "Cumulative");
            setRowsPerPage(numberOfRows);
            setRows(displayCumulative(trimmed, props.total, cumulative, numberOfRows));
            break;
          default:
            break;
        }
      }
    },

    onTableChange: (action, tableState) => {
      // reset selected rows
      if (["changeRowsPerPage", "changePage", "sort", "search", "onSearchClose", "filterChange", "resetFilters"].includes(action)) {
        setM1nSelectedRowsIndexes([]);
        setM1nSelectedRowsIds([]);
      }

      if (props.header === "Contactss") {
        let filters = [];
        const leadSourceIndex = tableState.columns.findIndex((i) => i.name === "leadSource");
        const lastUpdateByIndex = tableState.columns.findIndex((i) => i.name === "lastUpdateBy.name");
        const contactOwnerIndex = tableState.columns.findIndex((i) => i.name === "contactOwner");
        const tagsIndex = tableState.columns.findIndex((i) => i.name === "tags");

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
            ...(!isEmpty(tableState.sortOrder) && {
              sort: {
                field:
                  tableState.sortOrder?.name === "fullContactAddress"
                    ? "address1"
                    : tableState.columns.find((el) => el.name === tableState.sortOrder?.name)?.dbName ||
                    tableState.columns.find((el) => el.name === tableState.sortOrder?.name)?.name,
                order: tableState.sortOrder?.direction === "asc" ? 1 : -1,
              },
            }),

            filters: filters,
            search: tableState.searchText,
            userId: stateApp.user.mongoId,
          },
        };
        if (stateApp.isContactSearching) {
          action = "search";
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
                  before: props.rows && tableState.page < pageInd ? props.rows[0]?.cursor : null,
                  after: props.rows && tableState.page > pageInd ? props.rows[props.rows.length - 1]?.cursor : null,
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
              getPaginatedContacts: props.contactsPageProps.getPaginatedContacts,
              getContactsFilterOptions: props.contactsPageProps.getContactsFilterOptions,
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

      if (props.header === "Well Interests" && props.parent === "owner_WellInterests") {
        const pageVariables = {
          variables: {
            pagination: {
              first: tableState.rowsPerPage,
              after: null,
            },
            ...(!isEmpty(tableState.sortOrder) && {
              sort: {
                field:
                  tableState.columns.find((el) => el.name === tableState.sortOrder?.name)?.dbName ||
                  tableState.columns.find((el) => el.name === tableState.sortOrder?.name)?.name,
                order: tableState.sortOrder?.direction === "asc" ? 1 : -1,
              },
            }),

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
                  before: props.rows && tableState.page < pageInd ? props.rows[0]?.cursor : null,
                  after: props.rows && tableState.page > pageInd ? props.rows[props.rows.length - 1]?.cursor : null,
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

      if (props.parent === "ownersPerParcel") {
        switch (action) {
          case "search":
            searchData(tableState);
            break;
          case "onSearchClose":
            break;
          case "filterChange":
            searchData(tableState);
            break;
          default:
        }
      }

      if (props.onTableChange) {
        props.onTableChange(action, tableState, props.rows, {
          pageInd,
          setPageInd,
          setRowsPerPage,
          m1nSelectedRowsIds,
          m1nSelectedRowsIndexes,
          setSelectedRow,
          searchData,
          setM1nSelectedRowsIndexes,
          _selectedRows,
          setSelectedRows
        });
      }
    },
    onDownload: (buildHead, buildBody, columns, data) => {
      const formattedData = data.map((row) => {
        return {
          index: row.index,
          data: row.data.map((el, ind) => {
            return valueFormatter(columns?.[ind], el)
          })
        }
      })
      return "\uFEFF" + buildHead(columns) + buildBody(formattedData);
    }
  };

  if (props.header === "Well Interests" && props.parent === "owner_WellInterests") {
    options.rowsPerPageOptions =
      props.wellInterestsPageProps.wellInterestsCount > 25
        ? [10, 25, 50, 100]
        : props.wellInterestsPageProps.wellInterestsCount > 10
          ? [10, 25]
          : [];
    options.count = props.wellInterestsPageProps.wellInterestsCount;
    options.serverSide = true;
  }

  if (props.header === "Deals"
    || props.header === "Activities"
    || props.header === "Agreements"
    || props.header === "Tracts"
    || props.header === "Campaigns"
    || props.header === "Exhibit A"
    || props.parent === "UnitsTable"
    || props.parent === "TractTable"
    || props.parent === "WellsTable"
    || props.parent === "Contacts"
    || props.parent === "TractInterestsTable"
    || props.parent === "RevenuePropertiesTable"
  ) {
    // adds the print and export options in the Flow grid and the Activities grid
    if (props.targetLabel !== 'activitiesDashboard') {
      // options.print = true;
      options.download = true;
    }
  }


  const displayCumulative = (data, total, cumulative, rowsPerPage = 25) => {
    let rows = data;
    if (total === true && rows.length !== 0) {
      let insertInBetween = rowsPerPage - 1;
      if (Object.entries(cumulative).length !== 0) {
        let multiplier = rows.length / insertInBetween;
        for (let temp = 1; temp <= multiplier; temp++) {
          let insert_index = 0;
          if (temp !== 1) {
            insert_index = temp * rowsPerPage;
            rows.splice(insert_index - 1, 0, cumulative);
          } else {
            rows.splice(insertInBetween, 0, cumulative);
          }
        }
        rows.push(cumulative);
      }
      if (rows[rows.length - 1] !== cumulative) {
        rows.push(cumulative);
      }
    }
    return rows;
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
    props.getWellOwnersByYear(event.target.value);
  };

  const TableFilterList = (props) => {
    return (
      <Box className={classes.customDropDown}>
        <Select
          MenuProps={{
            className: classes.selectPopover,
            classes: { paper: classes.selectMenu },
          }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={year}
          onChange={handleYearChange}
        >
          <MenuItem selected={year === 2019} value={2019}>
            2019
          </MenuItem>
          <MenuItem selected={year === 2020} value={2020}>
            2020
          </MenuItem>
          <MenuItem selected={year === 2021} value={2021}>
            2021
          </MenuItem>
          <MenuItem selected={year === 2022} value={2022}>
            2022
          </MenuItem>
          <MenuItem selected={year === 2023} value={2023}>
            2023
          </MenuItem>
        </Select>
      </Box>
    );
  };

  const getHeaders = () => {
    if ((props.header === "Contacts" && props.addAble?.type === "contact") || props.header === "Documents" || props.header === "Agreements") {
      const HeaderComponent = props.headerComponent;
      return <HeaderComponent {...props.headerProps} />;
    }
    if (props.header === "Documentss") {
      return (
        <div style={{ display: "flex", justifyContent: "left" }}>
          <DescriptionOutlinedIcon />
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography
              style={{
                marginLeft: "10px",
                fontSize: "16px",
              }}
              color="inherit"
            >
              {props.header}
            </Typography>
            <Typography style={{ color: "#18AADD", fontSize: "16px" }}>All {props.header}</Typography>
          </Breadcrumbs>
        </div>
      );
    } else if (typeof props.header === 'string') {
      return <div style={{ fontSize: 16, marginLeft: 10 }}>{props.header}</div>
    } else {
      return props.header;
    }
  };

  // const checkStatementValidation = (checkId) => {
  //   const response = props.potentialIssues.filter((issue) => {
  //     if (issue.key === checkId) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  //   if (response.length > 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // };

  // //  revenue data set
  // const getRevenueStatementRows = () => {
  //   let dataSet = rows?.map((item) => ({
  //     checkNumber: `${item?.checkNumber}_${item?._id}`,
  //     purchaserName: item?.payor?.name || "",
  //     checkAmount: item?.checkAmount || "",
  //     checkDate: moment.parseZone(item?.checkDate).format("MM/DD/yyyy") || "",
  //     depositDate: moment.parseZone(item?.depositDate).format("MM/DD/yyyy") || "",
  //     lines: item?.checkDetail?.lines || 0,
  //     checkId: item?.sourceId,
  //     source: item?.source || "",
  //     status: item?.status || "Imported",
  //     validation: checkStatementValidation(item._id) || null,
  //   }));
  //   return dataSet;
  // };



  const CustomCheckbox = (props) => {
    let newProps = Object.assign({}, props);
    newProps.color = props['data-description'] === 'row-select' ? 'secondary' : 'primary';

    if (props['data-description'] === 'row-select') {
      return (<Checkbox {...newProps} />);
    } else {
      return (<Checkbox {...newProps} />);
    }
  };


  const CustomTableViewCol = (columnsProps) => {
    if (props.viewColumn) {
      const ViewColumn = props.viewColumn;
      return <ViewColumn {...columnsProps} {...props.viewColumnProps} tableColumns={props.columns} />;
    } else {
      return <TableViewCol {...columnsProps} />;
    }
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        className={`${classes.table} ${rows && !props.loading ? "" : classes.loadingTable} ${columns && columns.length > 0 ? "" : classes.emptyTable
          }`}
      >
        <MUIDataTable
          id={props.parent}
          innerRef={props.tableRef}
          className={tableStyle}
          title={getHeaders()}

          data={
            props.parent === "ownersPerParcel" || props.parent === 'boundary_grid_owners'
              ? searchedRows
              : rows.length
                ? rows
                : []
          }
          // columns={
          //   props.parent === "ownersPerParcel" ? false :
          //   (columns ? columns : [])}

          columns={columns ? columns : []}
          components={{
            showRowNumber: !!props.onInfiniteScroll,
            onInfiniteScroll: props.onInfiniteScroll,
            TableBody: TableBody,
            Checkbox: CustomCheckbox,
            TableViewCol: CustomTableViewCol,


            TableFilterList: props?.component?.TableFilterList || ((props.header === "Tax Roll Ownership" || props.parent === "potentialOwnersPerUnit") && !isSearchOpen ? TableFilterList : null),
            icons: {
              FilterIcon,
              ViewColumnIcon,
            },
          }}
          options={{
            ...options,
            onSearchOpen: () => openSearch(true),
            onSearchClose: () => openSearch(false),

            // selectableRows: "multiple",
            // selectableRowsHideCheckboxes: true,
            // selectableRowsOnClick: true,
            // resizableColumns: true,

            filter:
              //  props.parent === 'ownersPerParcel'               /// will need to build a backend for this search
              props.parent === 'potentialOwnersPerParcel'       /// will need to build a backend for this search
                || props.parent === 'associatedWellsPerParcel'       /// will need to build a backend for this search
                || props.parent === 'boundary_grid_wells'       /// will need to build a backend for this search
                // || props.parent === 'boundary_grid_owners'       /// will need to build a backend for this search

                ? false : null,

            viewColumns:
              // props.parent === 'ownersPerParcel'                 /// will need to build a backend for this search
              props.parent === 'potentialOwnersPerParcel'       /// will need to build a backend for this search
                || props.parent === 'associatedWellsPerParcel'       /// will need to build a backend for this search
                || props.parent === 'boundary_grid_wells'       /// will need to build a backend for this search
                // || props.parent === 'boundary_grid_owners'       /// will need to build a backend for this search

                ? false : null,

            search:
              (
                // props.header === 'Contacts'
                // ||
                props.header === 'Deals'
                || props.parent === 'WellsTable'
                || (props.parent === 'Activities' && props.header === 'Activities')
                || props.header === 'Monthly Production'
                // || props.parent === 'ownersPerParcel'               /// will need to build a backend for this search
                || props.parent === 'potentialOwnersPerParcel'       /// will need to build a backend for this search
                || props.parent === 'associatedWellsPerParcel'       /// will need to build a backend for this search
                || props.parent === 'boundary_grid_wells'       /// will need to build a backend for this search
                || props.parent === 'boundary_grid_owners'       /// will need to build a backend for this search
                || props.parent === 'search'       /// will need to build a backend for this search

              )

                ? false : props.parent !== "search",
            // have to use props.parent here for initial value
            searchOpen: props.parent === "Contacts" ? true : null,
            //download: false,
            // search: props.parent != "search",
            //print: false,
            ...(props.header === "Contacts" && {
              customSearchRender: (searchText, handleSearch, hideSearch, options) => {
                registerSearchHandler(handleSearch);
                return getHeaders();
              },
            }),
            ...props.options
          }}
        />
        {openDialog && openDialog === "sendMailers" && (
          <RightDialog open={openDialog ? true : false} handleClickDialogClose={handleCloseDialog} width={"700px"}>
            <SendMailersDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
              campaign={props.campaign}
            />
          </RightDialog>
        )}

        <RightDialog open={activityModalOpen} handleClickDialogClose={() => setActivityModalOpen(false)} width={"700px"}>
          <AddActivityDialog
            onClose={() => setActivityModalOpen(false)}
            id={contact?._id}
            contactData={contact}
            defaultActivityType={defaultActivityType}
          />
        </RightDialog>

        {openDialog && openDialog === "buyContactsInfo" && (
          <RightDialog open={openDialog ? true : false} handleClickDialogClose={handleCloseDialog} width={"700px"}>
            <BuyContactsInfoDialogContent
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          </RightDialog>
        )}
        {openDialog && openDialog === "buyContactsInfoData" && (
          <RightDialog open={openDialog ? true : false} handleClickDialogClose={handleCloseDialog} width={"700px"}>
            <BuyContactsInfoDialogContent
              header="Contact Data Integration"
              onClose={handleCloseDialog}
              rows={expandedObject}
              setRows={setExpandedObject}
              setSelectedRow={setSelectedRow}
            />
          </RightDialog>
        )}
        {openDialog && openDialog === "addOwnerToParcel" && (
          <AddParcelOwnerDialogContent
            onClose={() => {
              setSelectedRow(null);
              handleCloseDialog();
            }}
            handleExpandClick={handleExpandClick}
            setM1nSelectedRowsIds={setM1nSelectedRowsIds}
            customLayerId={props.addAble?.customLayerId}
            customLayer={props.addAble?.customLayer}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
        {openDialog && openDialog === "addOwnerToUnit" && (
          <AddUnitOwnerDialogContent
            onClose={() => {
              setSelectedRow(null);
              handleCloseDialog();
            }}
            handleExpandClick={handleExpandClick}
            setM1nSelectedRowsIds={setM1nSelectedRowsIds}
            customLayerId={props.addAble?.customLayerId}
            customLayer={props.addAble?.customLayer}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
          />
        )}
        {/*
        // the dialog box listed below controls
        // popups that overlay the screen due to actions from the grid
        // examples would be grid tags or grid comments  */}

        {openDialog === "addContact" && props.targetLabel === "contact" && (
          <AddContactDialogContent onClose={handleCloseDialog} parent={props.addAble?.parent} />
        )}
        {openDialog === "multipleOwnerToContact" && (
          <MultipleOwnerToContactDrawerContainer
            onClose={handleCloseDialog}
            rows={expandedObject}
            setRows={setExpandedObject}
          />
        )}
        {openDialog === "asign" && (
          <AssignOwnerToContactDrawerContainer
            header={props.header}
            onClose={handleCloseDialog}
            rows={expandedObject}
            setRows={setExpandedObject}
          />
        )}
        {openDialog === "merge" && (
          <MergeContactDrawer
            onClose={handleCloseDialog}
            rows={expandedObject}
            setRows={setExpandedObject}
          />
        )}
        {openDialog === "exportContacts" && (
          <ExportContacts
            {...props.exportContactsProps}
            onClose={handleCloseDialog}
          // onClose={() => {}}
          // search={props.activeSearchRef.current}
          // filters={[...props.initialFilters, ...uniqBy(props.customAppliedFilters, "field") || []]}
          // total={props.options.count}
          // isSelectAll={isSelectAll}
          // rows={selectedRows}
          // esIndex={esIndex}
          // open={true}
          />
        )}
        {openDialog &&
          openDialog !== "asign" &&
          openDialog !== "merge" &&
          openDialog !== "addContact" &&
          openDialog !== "contactDataMissing" &&
          openDialog !== "multipleOwnerToContact" &&
          openDialog !== "addDeals" &&
          openDialog !== "sendMailers" &&
          openDialog !== "buyContactsInfo" &&
          openDialog !== "buyContactsInfoData" &&
          openDialog !== "addOwnerToParcel" &&
          openDialog !== "addOwnerToUnit" && (
            <Dialog
              // style={{zIndex: 99998}}
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
                  openDialog === "deleteWellInterest" ||
                  openDialog === "deleteParcelDocument" ||
                  openDialog === "deleteWellDocument" ||
                  openDialog === "deleteParcelRunsheet" ||
                  openDialog === "addParcelInterestsToEntity"
                  ? true
                  : false
              }
              maxWidth={
                openDialog === "owner" || openDialog === "wellsPerOwner" || openDialog === "ownerContacts"
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
                      openDialog === "addOwnerToUnit" ||
                      openDialog === "deleteOwnersFromContact" ||
                      openDialog === "deleteContact" ||
                      openDialog === "deleteDocument" ||
                      openDialog === "deleteUser"
                      ? "xs"
                      : "sm"
              }
            >
              {openDialog === "comment" && (
                <Comments
                  focus
                  targetSourceId={expandedObject}
                  targetLabel={trueTargetLabel ? trueTargetLabel : props.targetLabel}
                  commentType={props.commentType}
                  multipleIds={
                    m1nSelectedRowsIndexes.indexOf(rowInd) !== -1 && m1nSelectedRowsIndexes.length > 1
                      ? removeDuplicatesIds(m1nSelectedRowsIds)
                      : null
                  }
                />
              )}
              {openDialog === "tag" && (
                <div className={classes.tagsDiv}>
                  <Tags
                    targetSourceId={expandedObject}
                    targetLabel={trueTargetLabel ?? props.targetLabel}
                    multipleIds={
                      m1nSelectedRowsIndexes.indexOf(rowInd) !== -1 && m1nSelectedRowsIndexes.length > 1
                        ? removeDuplicatesIds(m1nSelectedRowsIds)
                        : null
                    }
                  />
                </div>
              )}
              {openDialog === "owner" && <M1nTable selectedWell={{ id: expandedObject }} parent="OwnersPerWell" />}
              {openDialog === "wellsPerOwner" && <M1nTable wellsIdsArray={expandedObject} parent="WellsPerOwner" />}
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
              {openDialog === "addParcelInterestsToEntity" && (
                <AddParcelToEntityDialogContent onClose={handleCloseDialog} entityId={props.addAble?.entityId} />
              )}

              {openDialog === "deleteOwnersFromContact" && (
                <DeleteConfirmationDialogContent
                  header="Delete Owner(s)"
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to permanently delete the owner${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    } from  this contact?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteWellInterest" && (
                <DeleteConfirmationDialogContent
                  header="Delete Well(s)"
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to permanently delete the well${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    } from  this unit?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteParcelDocument" && (
                <DeleteConfirmationDialogContent
                  header="Delete Parcel Document(s)"
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to permanently delete the document${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    } from  this parcel?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteWellDocument" && (
                <DeleteConfirmationDialogContent
                  header="Delete Well Document(s)"
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to permanently delete the document${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    } from  this well?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteParcelRunsheet" && (
                <DeleteConfirmationDialogContent
                  header="Delete Parcel Runsheet(s)"
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to permanently delete the instrument${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    } from  this parcel?`}
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
                    `Do you want to remove the contact${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    } from this owner?`}

                  {props.header === 'Contacts' &&
                    `Do you want to delete the selected ${['campaignContact'].includes(props.addAble?.type)
                      ? 'record'
                      : 'contact'
                    }${m1nSelectedRowsIds &&
                      m1nSelectedRowsIds.length > 1 &&
                      removeDuplicatesIds(m1nSelectedRowsIds).length > 1
                      ? 's'
                      : ''
                    }?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteDocument" && (
                <DeleteConfirmationDialogContent
                  header="Delete Document(s)"
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {props.header === "Documents" &&
                    `Do you want to delete the selected document${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    }?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteParcelOwnership" && (
                <DeleteConfirmationDialogContent
                  header={`Delete Owner${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    }`}
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to delete the owner${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 && removeDuplicatesIds(m1nSelectedRowsIds).length > 1 ? "s" : ""
                    }?`}
                </DeleteConfirmationDialogContent>
              )}
              {openDialog === "deleteParcelInterest" && (
                <DeleteConfirmationDialogContent
                  header={`Delete Parcel Interest${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""}`}
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to delete the Parcel Interest${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""}?`}
                </DeleteConfirmationDialogContent>
              )}

              {openDialog === "deleteDeal" && (
                <DeleteConfirmationDialogContent
                  header={`Delete Deal${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""}`}
                  onClose={handleCloseDialog}
                  deleteFunc={props.deleteFunc}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {`Do you want to delete the selected deal${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""}?`}
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
                  campaign={props.campaign}
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
                  header={`Inactivate User${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""}`}
                  onClose={handleCloseDialog}
                  deleteFunc={() => {
                    props.deleteFunc(m1nSelectedRowsIds);
                    closeMenu();
                  }}
                  m1nSelectedRowsIds={removeDuplicatesIds(m1nSelectedRowsIds)}
                  setM1nSelectedRowsIndexes={setM1nSelectedRowsIndexes}
                >
                  {selectedUser !== null
                    ? `Remove system access for '${selectedUser.displayName}' ?`
                    : `Are you sure you want to delete selected user${m1nSelectedRowsIds && m1nSelectedRowsIds.length > 1 ? "s" : ""}?`}
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
              targetLabel={targetLabelToExpand ? targetLabelToExpand : props.targetLabel}
              noTrackAvailable={
                targetLabelToExpand === "contact" || (!targetLabelToExpand && props.targetLabel === "contact") ? true : false
              }
            />
          </Dialog>
        )}
        {showExpandableCard && targetLabelToExpand !== "well" && targetLabelToExpand !== "contact" && multipleExpandableCard == false && (
          <Dialog className={classes.dialogExpCard} fullWidth maxWidth="xl" open={showExpandableCard} onClose={handleCloseExpandableCard}>
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
                  (!targetLabelToExpand && (props.targetLabel === "owner" || props.targetLabel === "well"))
                  ? selectedRow.id
                  : selectedRow._id
              }
              targetLabel={targetLabelToExpand ? targetLabelToExpand : props.targetLabel}
              noTrackAvailable={
                targetLabelToExpand === "contact" || (!targetLabelToExpand && props.targetLabel === "contact") ? true : false
              }
            />
          </Dialog>
        )}
        {showExpandableCard && targetLabelToExpand !== "well" && targetLabelToExpand !== "contact" && multipleExpandableCard === false && (
          <Dialog className={classes.dialogExpCard} fullWidth maxWidth="xl" open={showExpandableCard} onClose={handleCloseExpandableCard}>
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
                  (!targetLabelToExpand && (props.targetLabel === "owner" || props.targetLabel === "well"))
                  ? selectedRow.id
                  : selectedRow._id
              }
              targetLabel={targetLabelToExpand ? targetLabelToExpand : props.targetLabel}
              noTrackAvailable={
                targetLabelToExpand === "contact" || (!targetLabelToExpand && props.targetLabel === "contact") ? true : false
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
            height: "fit-content"
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
