import { makeStyles } from "@material-ui/core/styles";

export const usetableStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
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
  ZoomIcons: {
    zIndex: "1",
    display: "flex",
    flexDirection: "column",
    position: "sticky !important",
    top: "85% !important",
    bottom: "0 !important",
    left: "10px",
    width: "3.875rem",
  },
  warningCol: {
    display: "flex",
    color: "#f1af29",
    cursor: "pointer",
    "& svg": {
      fill: "#f1af29 !important",
    },
    "& div": {
      marginTop: "3px",
      fontSize: "initial",
    },
  },
  flexAlign: {
    display: "flex",
    alignItems: "center",
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
}));
