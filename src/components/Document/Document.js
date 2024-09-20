import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MRTTable from 'components/MRTTable';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "65px",
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        // height: "calc(100vh - 65px)",
        position: "relative",
        "align-items": "stretch",
        "&>.MuiPaper-root": {
          display: "contents",
        },
        "&>:nth-child(3)": {
          // height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        },
      },
    },

    '& .MuiDrawer-paperAnchorRight': {
      overflow: "hidden",
    }
  },
}));

export default function DocumentComponent() {
  const classes = useStyles();

  useEffect(() => {
    return () => {
      window.setStateApp((state) => ({
        ...state,
        pdfView: null,
        viewDoc: null,
        selectedDocument: {},
        DocumentDrawer: false,
      }));
    };
  }, []);

  return (
    <div className={classes.root}>
      {/* Documents Table*/}
      <MRTTable name="DocumentTable" />
    </div>
  );
}