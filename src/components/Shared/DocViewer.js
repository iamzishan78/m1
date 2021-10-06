import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { AppContext } from "AppContext";
import { Document, Page } from "react-pdf";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import { CircularProgress } from "@material-ui/core";
import { pdfjs } from "react-pdf";
import GetAppIcon from "@material-ui/icons/GetApp";
import "./ViewDocStyle.css";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    height: "100vh !important",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
    border: "0px",
    inset: "unset",
    width: "calc(100vw - 650px)",
  },
  paperTwo: {
    backgroundColor: theme.palette.background.paper,
    height: "950px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: "scroll",
    "&::-webkit-scrollbar": {
      width: "0.75em",
      height: "0.75em",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#929292",
      borderRadius: 10,
    },
    border: "0px",
    inset: "unset",
  },
  ZoomIcons: {
    zIndex: "1",
    display: "flex",
    flexDirection: "column",
    position: "sticky   !important",
    top: "85% !important",
    bottom: "0 !important",
    left: "0",
    width: "3.875rem",
  },
}));

const DocViewer = ({ DocStyle = { transform: `translate(0%, -100%)` }, divCondition = false }) => {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  let [pageNumber, setPageNumber] = useState(1);
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [pdfState, setpdfState] = useState([]);
  let [zoom, setzoom] = useState(2.0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    setPageNumber(1);
    PageView(numPages);
  }, [numPages]);

  const PageView = (num) => {
    let Page = [];
    for (let i = 1; i <= num; i++) {
      console.log(i, numPages, "value of I");
      Page.push(i);
    }
    setpdfState(Page);
  };

  const downloadFile = (viewFile) => {
    if (viewFile?.uri) {
      let a = document.createElement("a");
      a.href = viewFile.uri;
      a.download = viewFile.name;

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  };

  return (
    <div>
      {divCondition === false ? (
        <Modal
          open={!!stateApp.viewDoc}
          aria-labelledby="simple-modal-title Facebook"
          aria-describedby="simple-modal-description"
          style={{ zIndex: "99999", border: "0px", inset: "unset" }}
          disableAutoFocus={true}
          hideBackdrop={true}
          isablePortal={true}
          disableEnforceFocus={true}
          keepMounted={true}
          disableBackdropClick={true}
        >
          <div style={DocStyle} className={classes.paper}>
            <div className={classes.ZoomIcons}>
              {" "}
              <IconButton
                onClick={() => {
                  setzoom(zoom + 0.25);
                }}
              >
                <ZoomInIcon fontSize={"large"} />
              </IconButton>
              <IconButton
                onClick={() => {
                  setzoom(zoom - 0.25);
                }}
              >
                <ZoomOutIcon fontSize={"large"} />
              </IconButton>
            </div>
            <Grid item xs={12} style={{ minHeight: "35px", width: "100%", display: "block", marginTop: "-123px" }}>
              <h4
                style={{
                  margin: "0 0 15px 0",
                  float: "left",
                  fontSize: "1.1rem",
                }}
              >
                {stateApp?.viewDoc?.name}
              </h4>

              <div style={{ float: "right" }}>
                <>
                  <IconButton size="small" style={{ margin: "0 8px" }}>
                    {stateApp?.viewDoc?.uri ? (
                      <IconButton size="small" onClick={() => downloadFile(stateApp?.viewDoc)}>
                        <GetAppIcon />
                      </IconButton>
                    ) : (
                      <CircularProgress size={20} color="secondary" />
                    )}
                  </IconButton>
                </>

                <IconButton
                  onClick={() => {
                    setStateApp({ ...stateApp, viewDoc: null });
                  }}
                  size="small"
                >
                  <CloseIcon className={classes.closeIcon} fontSize="small" />
                </IconButton>
              </div>
            </Grid>

            <div>
              <Document
                style={{ display: "grid", justifyContent: "center" }}
                file={stateApp?.viewDoc?.uri}
                scale={3.0}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                  <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </div>
                }
              >
                {pdfState?.map((value, key) => {
                  return (
                    <Page key={key} pageNumber={value} scale={zoom} style={{ display: "grid", justifyContent: "center", margin: "auto" }} />
                  );
                })}
              </Document>
            </div>
          </div>
        </Modal>
      ) : (
        <div style={DocStyle} className={classes.paperTwo}>
          <Grid item xs={12} style={{ minHeight: "35px", width: "100%" }}>
            <h4
              style={{
                margin: "0 0 15px 0",
                float: "left",
                fontSize: "1.1rem",
              }}
            >
              {stateApp?.viewDoc?.name}
            </h4>

            <div style={{ float: "right" }}>
              <>
                <IconButton size="small" style={{ margin: "0 8px" }}>
                  {stateApp?.viewDoc?.uri ? (
                    <IconButton size="small" onClick={() => downloadFile(stateApp?.viewDoc)}>
                      <GetAppIcon />
                    </IconButton>
                  ) : (
                    <CircularProgress size={20} color="secondary" />
                  )}
                </IconButton>
              </>

              <IconButton
                onClick={() => {
                  setStateApp({ ...stateApp, viewDoc: null });
                }}
                size="small"
              >
                <CloseIcon className={classes.closeIcon} fontSize="small" />
              </IconButton>
            </div>
          </Grid>

          <div>
            <Document
              style={{ display: "grid", justifyContent: "center", width: "100%" }}
              file={stateApp?.viewDoc?.uri}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
              }
            >
              {pdfState?.map((value, key) => {
                return (
                  <Page key={key} pageNumber={value} scale={1.5} style={{ display: "grid", justifyContent: "center", width: "100%" }} />
                );
              })}
            </Document>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocViewer;
