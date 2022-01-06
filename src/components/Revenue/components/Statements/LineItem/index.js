import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import { Grid, Button } from "@material-ui/core";

import NavHeader from "components/Revenue/components/Common/NavHeader";
import PdfViewer from "components/Revenue/components/Statements/LineItem/PdfViewer";

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
    height: "500px",
    border: "1px solid #c1c1c1",
    marginTop: "22px",
    borderRadius: "4px",
    alignItems: "center",
  },
}));

export default function LineItem(props) {
  const classes = useStyles();
  const history = useHistory();
  const [showPdfSection, setSectionState] = useState(true);
  const { activeStatement } = useSelector(({ Revenue }) => Revenue.statements);

  const togglePdfViewState = () => {
    setSectionState(!showPdfSection);
  };

  return (
    <NavHeader title={`${activeStatement?.checkNumber} - ${activeStatement?.payor["name"]}`}>
      <div className={classes.root}>
        <Grid container display="flex" direction="row" alignItems="center" justify="space-between">
          <Grid item>
            <Button variant="outlined" className={classes.inputModeButton} onClick={togglePdfViewState}>
              Input Mode
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" className={classes.exitButton} onClick={() => history.push(`/revenue/statement/details?id=${activeStatement?._id}`)}>
              Exit
            </Button>
          </Grid>
        </Grid>
        {showPdfSection && (
          <div className={classes.pdfViewerRoot}>
            <PdfViewer togglePdfViewState={togglePdfViewState} />
          </div>
        )}
      </div>
    </NavHeader>
  );
}
