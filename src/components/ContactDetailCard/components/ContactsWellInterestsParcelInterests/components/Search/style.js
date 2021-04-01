import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  accordian: {
    background: "#e3eefc",
    "& .MuiAccordionSummary-content .MuiTypography-body1": { fontWeight: 600 },
    "& .MuiCollapse-container": { background: 'white' }
  },
  multiSelectionTopBarButtons: {
    margin: "6px 12px",
    fontWeight: "600",
    color: "#082768",
  },
  groupsHeadersText: {
    margin: "0",
    marginTop: "3px",
    padding: "0",
    fontFamily: "Poppins",
    color: "#0f2046",
    paddingLeft: "5px",
  },
  groupsHeaders: {
    position: "-webkit-sticky",
    position: "sticky",
    top: "-9px",
    backgroundColor: "#d4e7fce0",
    zIndex: "4000",
  },
  groupsButton: {
    margin: "3px",
    zIndex: "2000",
    color: "#5f5f5f",
  },
  /*root: {
    height: "42px",
    width: "100%",
    "& .MuiAutocomplete-inputRoot": { maxHeight: "42px" },
  },*/
  root: {
    flexGrow: 1,
    "& .MuiInput-root": {
      height: "50px",
      paddingRight: "8px",
    },
    "& > div": {
      width: "100%",
    },
  },
  score: {
    position: "absolute",
    top: "-8px",
    width: "17px",
    height: "16px",
    borderRadius: "50%",
    marginLeft: "10px",
  },
  headerButtons: {
    margin: "0 4px",
    minWidth: "max-content",
    "float": "left",
  },
  floatRight: {
    "float": "right",
  },
  historyPopover: {
    "& .MuiPopover-paper": {
      width: "calc(100% - 42px) !important",
      maxWidth: "none !important",
      minWidth: "unset !important",
      maxHeight: "55vh !important",
    },
  },
  historyRow: {
    "&:hover": {
      backgroundColor: "#EFEFEF",
      cursor: "pointer",
    },
  },
  startAdornmentIcon: {
    cursor: "pointer",
    height: "23px",
  },
  viewSwitcher: {
    height: 30,
    marginRight: 8,
  },
}));


export default useStyles