import React, { memo, useEffect, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import { useLazyQuery } from "@apollo/client";
import { VIEWFILEQUERY } from "graphQL/useQueryViewFile";
import get_file_icon from "components/Shared/functions/get_file_icon.js";
import PdfViewer from 'components/MRTTable/TablesOverride/DocumentTable/TableCell/PDFView';
import { useHistory } from "react-router-dom";

function FileName({ docInfo }) {
  const splittedStrings = docInfo?.fileName?.split(".");
  const docExtention = splittedStrings?.[splittedStrings.length - 1]?.toLowerCase();
  const [openPdfView, setOpenPdfView] = useState(false)
  let history = useHistory();

  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });

  const handleViewFile = async (id) => {
    viewFile({ variables: { fileId: id } });
  };

  useEffect(() => {
    if (viewFileResult?.viewFile?.uri && docExtention !== 'pdf') {
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;
      a.click();
    } else {
      setOpenPdfView(true)
    }
  }, [viewFileResult]);

  const onCloseHandler = () => {
    history.goBack()
    setOpenPdfView(false)
  };

  return (
    <>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}>

        <div style={{
          minWidth: 400,
          maxWidth: 400,
          boxShadow: 'inset -1px 0px 0px 0px lightgrey',
        }}>
          <Grid container spacing={0} direction="row" >
            <Grid
              item
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '0.75rem',
                  minWidth: "120px",
                  borderRadius: "7px",
                  color: "#17aadd",
                  wordBreak: "break-word",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  fontWeight: "bold",
                  justifyContent: "flex-start",
                }}

                onClick={(e) => {
                  e.stopPropagation();
                  window.history.pushState("", "", `/documents/${docInfo._id}/view`);
                  handleViewFile(docInfo._id)
                }}
              >
                {get_file_icon(docExtention)}{' '}{docInfo?.fileName}
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      {openPdfView && <PdfViewer viewDoc={viewFileResult?.viewFile} width="calc(100vw)" onCloseHandler={onCloseHandler} />}
    </>
  );
}

export default memo(FileName);
