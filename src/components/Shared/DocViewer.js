import React, { useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { AppContext } from 'AppContext';
import { Document, Page } from 'react-pdf';
import pdfile  from './ResumeHumayounShah2.pdf'
import testpdf from './testpdf.pdf'
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import { CircularProgress } from "@material-ui/core";
import { pdfjs } from 'react-pdf';
import GetAppIcon from "@material-ui/icons/GetApp";
import './ViewDocStyle.css'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${56}%`,
    left: `${40}%`,
    transform: `translate(-${53}%, -${56}%)`,
 
  
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    height: "950px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflow: 'scroll',
    border: "0px"
  },
}));

const SimpleModal = () => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [numPages, setNumPages] = useState(null);
  let [pageNumber, setPageNumber] = useState(1);
  const [stateApp, setStateApp] = React.useContext(AppContext);


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  const NextPdf = () => {
      if(pageNumber < numPages)
      {
        setPageNumber(++pageNumber)
      }
  };

  const PrePdf = () => {
    if(pageNumber > 1)
    {
      setPageNumber(--pageNumber)
    }
  };
  

 
  return (
    <div >
      <Modal
        open={!!stateApp.viewDoc}
        aria-labelledby="simple-modal-title Facebook"
        aria-describedby="simple-modal-description"
        
        style={{zIndex:'9999', border:"0px"}}
      >
        
       <div style={modalStyle} className={classes.paper}>
       <Grid item xs={12} style={{ minHeight: "35px" }}>
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
                            onClick={() =>
                            {
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
                  onClick={()=>{setStateApp({...stateApp, viewDoc:null})}}
									size="small"
								>
									<CloseIcon className={classes.closeIcon} fontSize="small" />
								</IconButton>
							</div>
						</Grid>
       <div >
      <Document
        file={stateApp?.viewDoc?.uri}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div style={{width:'500px', display:"flex", justifyContent:'center'}}><CircularProgress /></div>}
      >
        <Page pageNumber={pageNumber} />
    <div className="page-controls" ><button type="button"  className='page-controls-button' onClick={PrePdf}>‹</button><span>{pageNumber} of {numPages}</span><button className="page-controls-button" type="button" onClick={NextPdf} >›</button></div>
       
      </Document>
    </div>
    </div>
      </Modal>
    </div>
  );

}


export default SimpleModal