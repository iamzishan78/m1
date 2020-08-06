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
        backgroundColor: '#f0fbff',
        margin: '5px',
        padding: '0px',
        border: 1,
        borderRadius: 7
      },
      greyedInputContainer: {
        backgroundColor: '#f3f3f3',
        margin: '5px',
        border: 1,
        borderRadius: 7
      },
      inputContent: {
        float: "right",
        padding: '1%',
        fontSize: '15px'
      },
      inputLabel: {
        float: "left",
        textAlign: "center",
        padding: '1.5%',
        fontSize: '15px'
      },
      actionButtons: {
        margin: '15px'
      }
}));

export { Modals }