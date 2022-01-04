import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton, CircularProgress } from "@material-ui/core";
import { Close as CloseIcon, GetApp as GetAppIcon } from "@material-ui/icons";
import { Document, Page } from "react-pdf";

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
        width: (props) => props.width ?? "calc(100vw - 650px)",
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
        position: "sticky !important",
        top: "85% !important",
        bottom: "0 !important",
        left: "0",
        width: "3.875rem",
    },
}));

export default function PdfViewer(props) {
    const classes = useStyles();
    const [pdfState, setpdfState] = useState([]);
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        PageView(numPages);
    }, [numPages]);

    const PageView = (num) => {
        let Page = [];
        for (let i = 1; i <= num; i++) {
            Page.push(i);
        }
        setpdfState(Page);
    };

    const downloadFile = (viewFile) => {
        if (viewFile?.uri) {
            let a = document.createElement("a");
            a.href = viewFile.uri;
            a.download = viewFile.name;
            a.click();
        }
    };
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    }
    return (
        <>
            {/* <div style={DocStyle} className={classes.paperTwo}>
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
                        <IconButton size="small" style={{ margin: "0 8px" }}>
                            {stateApp?.viewDoc?.uri ? (
                                <IconButton size="small" onClick={() => downloadFile(stateApp?.viewDoc)}>
                                    <GetAppIcon />
                                </IconButton>
                            ) : (
                                <CircularProgress size={20} color="secondary" />
                            )}
                        </IconButton>

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
            </div> */}
        </>
    )
}
