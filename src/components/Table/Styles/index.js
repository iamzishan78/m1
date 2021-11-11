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
}));