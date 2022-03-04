import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";

import NavHeader from "components/Revenue/components/Common/NavHeader";
import PdfViewer from "components/Revenue/components/Statements/DetailComponents/LineItem/PdfViewer";
import CheckDetailsEditableTable from "./CheckDetailsEditableTable";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  inputModeButton: {
    width: "200px",
    fontWeight: 600,
    fontSize: "initial",
    borderRadius: "6px",
    height: "34px",
    color: "#767676",
    textTransform: "none",
    border: "1px solid #938e8e",
  },
  exitButton: {
    color: "white",
    background: "rgb(24, 170, 221)",
    width: "170px",
    fontWeight: 600,
    fontSize: "initial",
    borderRadius: "6px",
    height: "34px",
    textTransform: "none",
  },
  pdfViewerRoot: {
    // height: "500px",
    border: "1px solid #c1c1c1",
    marginTop: "22px",
    borderRadius: "4px",
    alignItems: "center",
  },
}));

export default function LineItem(props) {
  const classes = useStyles();
  const history = useHistory();
  // const [checkId, setCheckId] = useState();
  const [showPdfSection, setSectionState] = useState(true);
  const Revenue = useSelector(({ Revenue }) => Revenue.statements);
  const activeStatement = Revenue?.activeStatement

  const togglePdfViewState = () => {
    setSectionState(!showPdfSection);
  };

  // useEffect(() => {
  //   setCheckId(props.match.params.id)
  // }, [props.match])
  // const checkId = window.location.search.replace("?id=", '')
  const redirectHandler = () => {
    history.push(`/revenue/statement/details/${activeStatement?._id}`);
  }

  return (
    // <NavHeader title={`${activeStatement?.checkNumber} - ${activeStatement?.payor["name"]}`} onClickFunc={redirectHandler}>
    <div className={classes.root}>
      <Grid container display="flex" direction="row" alignItems="center" justify="space-between">
        <Grid item>
          <Button variant="outlined" className={classes.inputModeButton} onClick={togglePdfViewState}>
            Input Mode
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" className={classes.exitButton} onClick={redirectHandler}>
            Exit
          </Button>
        </Grid>
      </Grid>
      {showPdfSection && (
        <div className={classes.pdfViewerRoot}>
          <PdfViewer togglePdfViewState={togglePdfViewState} checkId={props.checkId} />
        </div>
      )}

      <CheckDetailsEditableTable parent="CheckDetailsTable" header="Check Details" checkId={props.checkId} />
    </div>
    // </NavHeader>
  );
}
