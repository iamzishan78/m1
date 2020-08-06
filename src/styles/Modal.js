import { makeStyles } from "@material-ui/core/styles";

const Modals = makeStyles((theme) => ({
    divBorders: {
        padding: "15px",
        border: "1px solid #C4C4C4",
        borderRadius: "4px",
        "&:hover": {
          border: "1px solid black",
        },
        alignItems: "center",
        marginBottom: "10px",
        textAlign: "center",
      },
      title: {
          backgroundColor: "#011133",
          color: "#fff",
      },
      titleClose: {
        cursor:'pointer', float:'right'
      },
      inputContainer: {
        backgroundColor: '#BEEEFF',
        padding: '1px',
        margin: '5px',
        height: '100%'
      },
      inputContent: {
        float: "right",
        padding: '1%'
      },
      inputLabel: {
        float: "left",
        textAlign: "center",
        padding: '1.5%'
      },
      actionButtons: {
        marginTop: '10px',
        marginBottom: '5px'
      }
}));

export { Modals }