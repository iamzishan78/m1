import React, { useContext, useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useLazyQuery, useMutation } from "@apollo/client";

// context
import { Container, Dialog, Button, IconButton, Tooltip } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES

import { deepEqualObjects } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas
import TableHeader from "components/Table/constants/parcel-documents-header-schema.js";

// Utilities
import { usetableStyles } from "./style";
import { DELETEDESCRIPTORRELATEDFILE } from "graphQL/useMutationDeleteDescriptorFile";
import { AppContext } from "AppContext";
import { VIEWFILEQUERY } from "graphQL/useQueryViewFile";

function AgreementDocumentsTable(props) {
  const classes = usetableStyles();
  const [isDeletePopup, setDeletePopup] = useState(false);
  const [resetSelectedRow, setResetSelectedRow] = useState(false);
  const { moduleId } = props;

  const [updateParcelDocument] = useMutation(DELETEDESCRIPTORRELATEDFILE, {
    onCompleted: () => {
      props.setLoading(false);
      props.setSelectedRows([]);
      setResetSelectedRow(!resetSelectedRow)
    },
    onError: (err) => { },
  }, { refetchQueries: ["getESSimpleSearch"], awaitRefetchQueries: true });

  const [, setStateApp] = useContext(AppContext)

  const [viewFile, { data: viewFileResult }] = useLazyQuery(VIEWFILEQUERY, {
    fetchPolicy: "no-cache",
  });
  const handleViewFile = async (id) => {    
    viewFile({ variables: { fileId: id } });
  };

  useEffect(() => {    
    if (viewFileResult?.viewFile?.uri) {      
      let a = document.createElement("a");
      a.href = viewFileResult.viewFile.uri;
      a.download = viewFileResult.viewFile.name;
      // selectors
      // const { searchloading } = useSelector(({ MapGridCard }) => MapGridCard);

      // if for some reason we want to download (or open depending on x-ms-blob-content-disposition) in a new tab
      // a.target = "_blank";

      // file download on click is not 100% guranteed if the x-ms-blob-content-disposition is not set to attachment
      a.click();
    }
  }, [viewFileResult]);

  const options = {
    ...props.options,
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
          <Button
            color="secondary"
            className={classes.multiSelectionTopBarButtons}
            onClick={() => {
              if (props.setDrawer) props.setDrawer("dcmnt");
            }}
          >
            + ADD DOCUMENT
          </Button>
        </div>
      );
    },
    customToolbarSelect: ({ data }) => {
      return (
        <div style={{ height: "48px", display: "flex" }}>
          <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
            <Tooltip title={"Delete"}>
              <IconButton
                size="medium"
                style={{ margin: "0 5px" }}
                aria-label="delete"
                onClick={(e) => {
                  setDeletePopup("delete");
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      );
    },
    onRowClick: (_, { rowIndex }) => {
      const row = props.rows[rowIndex]
      
      const type = row.fileName?.split(".")[row.fileName?.split(".").length - 1]?.toLowerCase();
      if (type === "pdf") {
        if (props.addAble?.type === "document") {
          window.history.pushState("", "", `/documents/${row._id}/view`);
        }
        // const selectedRow = rows.find((curRow) => curRow._id === row._id);
        setStateApp((state) => ({
          ...state,
          pdfView: row,
          viewDoc: {
            uri: row.viewToken,
            name: row.fileName,
          },
        }));
      } else {
        handleViewFile(row._id);
      }
    }
  };

  const formatHits = (hits) => {
    return hits;
  };
  const deleteFunc = (ids) => {
    props.setLoading(true);
    for (let i = 0; i < ids.length; i++) {
      updateParcelDocument({
        variables: {
          descriptorObjectId: ids[i],
          relatedObjectId: moduleId
        },
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
      });
    }

    props.setSelectedRows([]);
  };

  useEffect(() => {
    if (moduleId)
      props.setTableMeta({
        shapeType: props.shapeType,
        addableName: "Tract",
        searchFields: ["*"],
        filters: [{ field: "shapeObj._id", value: moduleId }],
        TableHeader: TableHeader,
        esIndex: "documents_flat",
        startPaginationAt: 25,
        formatHits,
      });
  }, [moduleId]);

  useEffect(() => {
    if (props.setCounter) props.setCounter(props.rows.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows]);

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={isDeletePopup} onClose={() => setDeletePopup(false)} fullWidth={true} maxWidth={"sm"}>

        <DeleteConfirmationDialogContent
          header={`Delete Related Document(s)`}
          onClose={() => setDeletePopup(false)}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
          setM1nSelectedRowsIndexes={props.setSelectedRows}
        >
          {`Do you want to delete the selected related document${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
            }?`}
        </DeleteConfirmationDialogContent>
      </Dialog>

      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header ?? "Related Documents"}
        columns={props.columns}
        rows={props.rows}
        total={false}
        loading={props.loading}
        targetLabel={props.targetLabel}
        resetSelectedRow={resetSelectedRow}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(AgreementDocumentsTable), deepEqualObjects);
