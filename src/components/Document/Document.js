import React, { useContext, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import { Document, Page } from "react-pdf";

import { AppContext } from "AppContext";
import M1nTable from "../Shared/M1nTable/M1nTable";
import Drawer from "./components/Drawer";

const useStyles = makeStyles((theme) => ({
  dialogExpCard: {
    "& .MuiDialog-paperScrollPaper": {
      height: "100%",
    },
    "& *": {
      margin: 0,
    },
  },
  fileTitle: {
    padding: '12px',
    fontWeight: 'bold'
  },
}));

export default function DocumentComponent() {
  const classes = useStyles();
  const [stateApp, setStateApp] = useContext(AppContext);
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <M1nTable dense parent="Documents"></M1nTable>
      <Drawer data={true}></Drawer>
      <Dialog
        className={classes.dialogExpCard}
        fullWidth
        maxWidth="xl"
        open={stateApp.pdfView ? true : false}
        onClose={() => {
          setStateApp((state) => ({
            ...state,
            pdfView: null,
          }));
        }}
      >
        <Toolbar>
          <Grid
            justify="space-between" // Add it here :)
            container
            spacing={24}
          >
            <Grid item>
              <Typography className={classes.fileTitle} type="title" color="inherit">
                {stateApp.pdfView?.fileName}
              </Typography>
            </Grid>

            <Grid item>
              <IconButton
                className="float-right"
                color="inherit"
                onClick={() => {
                  setStateApp((state) => ({
                    ...state,
                    pdfView: null,
                  }));
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>

        <Document
          file={stateApp.pdfView?.viewToken}
          options={{ workerSrc: "/pdf.worker.js" }}
          onLoadSuccess={onDocumentLoadSuccess}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      </Dialog>
    </div>
  );
}
