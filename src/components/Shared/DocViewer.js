import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { AppContext } from 'AppContext';
import { Document, Page } from 'react-pdf';
import pdfile from './ResumeHumayounShah2.pdf'
import testpdf from './testpdf.pdf'
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import { CircularProgress } from "@material-ui/core";
import { pdfjs } from 'react-pdf';
import GetAppIcon from "@material-ui/icons/GetApp";
import './ViewDocStyle.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;




const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    height: "49.5vw !important",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'scroll',
    border: "0px",
    inset: 'unset',
    backgroundColor: "white !important",
    width: 'calc(100vw - 540px) !important'
  },
  paperTwo: {
    backgroundColor: theme.palette.background.paper,
    height: "950px",

    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'scroll',
    border: "0px",
    inset: 'unset',
    backgroundColor: "white !important"
  },
}));

const SimpleModal = ({ DocStyle = { top: '56% ', left: '40% ',  transform: `translate(1%, -101%)`, }, divCondition = false },) => {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  let [pageNumber, setPageNumber] = useState(1);
  const [stateApp, setStateApp] = React.useContext(AppContext);
  const [pdfState, setpdfState] = useState([])
 
  const preview = file => {
    return setpdfState({ show: true, file: file });
  };
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }


  useEffect(() => {
    setPageNumber(1)
    PageView(numPages)
  }, [numPages])

  const PageView = (num) => {

    let Page = [];
    for (let i = 1; i <= num; i++) {
      console.log(i, numPages, "value of I");

      Page.push(i)



    }
    setpdfState(Page)
  }


  return (
    <div >
      {divCondition === false ? (
        <Modal
          open={!!stateApp.viewDoc}
          aria-labelledby="simple-modal-title Facebook"
          aria-describedby="simple-modal-description"

          style={{ zIndex: '9999', border: "0px", inset: 'unset' }}
          disableAutoFocus={true}
          hideBackdrop={true}
          isablePortal={true}
          disableEnforceFocus={true}
          keepMounted={true}
          disableBackdropClick={true}
        // className="CustomeModal"
        >

          <div style={DocStyle} className={classes.paper}>
            <Grid item xs={12} style={{ minHeight: "35px", width: '100%' }}>
              <h4
                style={{
                  margin: "0 0 15px 0",
                  "float": "left",
                  fontSize: "1.1rem",
                }}
              >
                {stateApp?.viewDoc?.name}
              </h4>

              <div style={{ "float": "right" }}>

                <>

                  <IconButton

                    size="small"
                    style={{ margin: "0 8px" }}
                  >
                    {stateApp?.viewDoc?.uri ? (

                      <IconButton

                        size="small"
                        onClick={() => {
                          stateApp?.viewDoc?.downloadFn(stateApp?.viewDoc?.downloadData)
                        }
                        }
                      >
                        <GetAppIcon />
                      </IconButton>
                    ) : (
                      <CircularProgress size={20} color="secondary" />

                    )}
                  </IconButton>
                </>


                <IconButton
                  onClick={() => { setStateApp({ ...stateApp, viewDoc: null }) }}
                  size="small"
                >
                  <CloseIcon className={classes.closeIcon} fontSize="small" />
                </IconButton>
              </div>
            </Grid>
            <div >
              <Document
                style={{ display: 'grid', justifyContent: 'center', width: '100%' }}
                file={stateApp?.viewDoc?.uri}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div style={{ width: '100%', display: "flex", justifyContent: 'center' }}><CircularProgress /></div>}
              >

                {pdfState?.map((value, key) => {
                  return (
                    <Page key={key} pageNumber={value} style={{ display: 'grid', justifyContent: 'center', width: '100%' }} />
                  )
                })}

              </Document>
            </div>
          </div>
        </Modal>
      ) : (
        <div style={DocStyle} className={classes.paperTwo}>
          <Grid item xs={12} style={{ minHeight: "35px", width: '100%' }}>
            <h4
              style={{
                margin: "0 0 15px 0",
                "float": "left",
                fontSize: "1.1rem",
              }}
            >
              {stateApp?.viewDoc?.name}
            </h4>

            <div style={{ "float": "right" }}>

              <>

                <IconButton

                  size="small"
                  style={{ margin: "0 8px" }}
                >
                  {stateApp?.viewDoc?.uri ? (

                    <IconButton

                      size="small"
                      onClick={() => {
                        stateApp?.viewDoc?.downloadFn(stateApp?.viewDoc?.downloadData)
                      }
                      }
                    >
                      <GetAppIcon />
                    </IconButton>
                  ) : (
                    <CircularProgress size={20} color="secondary" />

                  )}
                </IconButton>
              </>


              <IconButton
                onClick={() => { setStateApp({ ...stateApp, viewDoc: null }) }}
                size="small"
              >
                <CloseIcon className={classes.closeIcon} fontSize="small" />
              </IconButton>
            </div>
          </Grid>
          <div >
            <Document
              style={{ display: 'grid', justifyContent: 'center', width: '100%' }}
              file={stateApp?.viewDoc?.uri}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div style={{ width: '100%', display: "flex", justifyContent: 'center' }}><CircularProgress /></div>}
            >

              {pdfState?.map((value, key) => {
                return (
                  <Page key={key} pageNumber={value} style={{ display: 'grid', justifyContent: 'center', width: '100%' }} />
                )
              })}

            </Document>
          </div>
        </div>
      )}
    </div>
  );



}


export default SimpleModal