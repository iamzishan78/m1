import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { isEmpty } from "lodash";

import { AppContext } from "AppContext";
import Drawer from "./components/Drawer";
import DocumentsTable from "components/Table/Documents/DocumentsTable";
import DocViewer from "components/Shared/DocViewer";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "65px",
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        height: "calc(100vh - 65px)",
        position: "relative",
        "align-items": "stretch",
        "&>.MuiPaper-root": {
          display: "contents",
        },
        "&>:nth-child(3)": {
          height: "inherit !important",
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
  const [stateApp, setStateApp] = useContext(AppContext);
  const [refetch, refetchData] = useState(false);
  let history = useHistory();

  useEffect(() => {
    return () => {
      setStateApp((state) => ({
        ...state,
        pdfView: null,
        viewDoc: null,
        selectedDocument: {},
        DocumentDrawer: false,
      }));
    };
  }, [setStateApp]);

  const onCloseHandler = () => {
    history.push("/documents");
    setStateApp((state) => ({
      ...state,
      pdfView: null,
      viewDoc: null,
    }));
  };

  return (
    <div className={classes.root}>
      <DocumentsTable parent="Documents" documentSearchQuery={stateApp.documentSearchQuery} refetch={refetch} refetchData={refetchData} />
      <Drawer refetchData={refetchData} />
      {stateApp.DocumentDrawer === true || Object.entries(stateApp?.selectedDocument || {}).length > 0 ? (
        <DocViewer width="calc(100vw - 515px)" onCloseHandler={onCloseHandler} />
      ) : (
        !isEmpty(stateApp.viewDoc) && <DocViewer width="calc(100vw)" onCloseHandler={onCloseHandler} />
      )}
    </div>
  );
}
