import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    fieldContentP: {
      visibility: ({ loading }) => (loading ? "hidden" : "visible"),
      margin: ({ noMargin }) => (noMargin ? "0" : "5px 10px"),
      width: ({ noMargin }) => {
        if (noMargin) return "fit-content";
      },
      borderRadius: "4px",
      "&:hover": {
        background: ({ noMargin }) => (noMargin ? "whitesmoke" : "#FFFFFF"),
      },
      "& #contPencilIcon, & #mergeTypeIcon": {
        visibility: "hidden",
      },
      "&:hover #contPencilIcon, &:hover #mergeTypeIcon": {
        visibility: "visible",
      },
    },
    pencilIcon: {
      fontSize: "22px",
    },
    mergeIcon: {
        position: "absolute",
        right: "19px"
    },
    editTextField: {
      paddingRight: ({ fieldsCount }) => (fieldsCount > 1 ? null : "0"),
      "& .MuiInputBase-root": {
        fontSize: "0.875rem",
        padding: "9px 10px",
        lineHeight: "1.43",
      },
    },
    editSelectField:{
      width : "100%",
      "& .MuiSelect-select":{
        fontSize: "0.875rem",
        padding: "9px 10px",
        lineHeight: "1",
      }
    },
    notAvailableP: { color: "#bababaab", fontSize: "13px" },
    loader: {
      position: "relative",
      top: "-37px",
      left: "10px",
    },
    popoverButton: {
      margin: "0 0 4px 8px",
      padding: "2px",
      minWidth: "0",
      "& .MuiButton-startIcon.MuiButton-iconSizeSmall": { margin: "0" },
    },
    buttonsRow: { textAlign: "right", top: "-2px", position: "relative" },
    foodText: {
      zIndex: "50",
      position: "absolute",
      right: "5px",
      bottom: "14px",
      fontSize: "10px",
      color: "#6e6e6e",
      margin: "0 !important",
      textAlign: "right",
      height: "0",
      paddingRight: "0",
      "& span": {
        fontWeight: "bold",
      },
    },
    mergeHistoryTitle: {
        color: "#757575",
        fontSize: "small",
        fontWeight: 700,
        "& .primary": {
            color: "rgba(23, 170, 221, 1)",
        }
    }
  }));

export default useStyles