import { makeStyles } from "@material-ui/core/styles";

const ParcelOwnershipStyles = makeStyles((theme) => ({
    table: {
      "& .MuiTableCell-body": {
        padding: (props) => (props.dense ? "0 !important" : "0px 16px !important")
      },
      "& .MuiToolbar-root": {
        backgroundColor: "#F2F2F2",
      },
      "& .MUIDataTableToolbar": {
        zIndex: "99999 !important",
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
        // "& td:nth-child(3)": {
        //   "& div": {
        //     width: 300
        //   }
        // },
        // "& td:nth-child(8)": {
        //     "& div": {
        //       width: 150
        //     }
        //   },
        // "& td:nth-child(9)": {
        // "& div": {
        //     width: 150
        // }
        // },
        // "& td:nth-child(6)": {
        // "& div": {
        //     width: 150
        // }
        // },
        // "& td:nth-child(7)": {
        // "& div": {
        //     width: 150
        // }
        // },
        // "& td:nth-child(19)": {
        //   "& div": {
        //     width: 300,
        //     "& span": {
        //       maxWidth: 300
        //     }
        //   }
        // },
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

  export default ParcelOwnershipStyles;