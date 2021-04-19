import { makeStyles } from "@material-ui/core/styles";

const ProductionTableStyle = makeStyles((theme) => ({
    table: {
      "& .MuiTableCell-body": {
        padding: (props) => (props.dense ? "0 !important" : "0px 16px !important")
      },
      "& .MuiToolbar-root": {
        backgroundColor: "#F2F2F2",
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

export default ProductionTableStyle;