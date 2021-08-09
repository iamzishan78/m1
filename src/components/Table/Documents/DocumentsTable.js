import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/documents-header-schema.js'
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";
import { UPDATE_DOCUMENT } from "graphQL/useMutationUpdateDocument";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important"
  },
}));

function DocumentsTable(props) {
  const classes = useStyles();

  // function states 
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

  // queries 
  const [getESDocuments, { data: DocumentsData, loading }] = useLazyQuery(GET_ES_DOCUMENTS, { fetchPolicy: "no-cache" });
  const [updateDocument, { loading: updateFileloading }] = useMutation(UPDATE_DOCUMENT);

  const tableData = DocumentsData?.getESFiles

  const addAble = { parent: false, type: "document" }
  const targetLabel = 'documents'
  const uploadIcon = true;
  const header = "Documents";
  const dense = true
  const total = false
  const orderByTracks = false

  useEffect(() => {
    getESDocuments({
      variables: {
        pagination: {}
      },
    });
  }, [getESDocuments]);

  useEffect(() => {
    getESDocuments({
      variables: {
        pagination: {},
        search: props.documentSearchQuery ? props.documentSearchQuery : ""
      }
    })
  }, [getESDocuments, props.parent, props.documentSearchQuery])


  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      props.setRows(tableData?.hits);
      setColumns(TableHeader);
      props.setLoading(false);
    }
    else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const count = tableData?.total || 0
  const options = {
    rowsPerPageOptions: count > 25 ? [10, 25, 50, 100] : count > 10 ? [10, 25] : [],
    count: count,
    serverSide: true
  }
  ////////////-----Add your code section here-----///////////////////////
  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESDocuments)

    switch (action) {
      case "search":
      case "sort":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "changePage":
        tableActions.changeESPage();
        break;
      case "filterChange":
        tableActions.searchData()
        break
      default:
    }
  }

  const deleteFunc = (documentIdsToDelete) => {
    if (documentIdsToDelete) {
      for (let i = 0; i < documentIdsToDelete.length; i++) {
        updateDocument({
          variables: {
            document: {
              fileId: documentIdsToDelete[i],
              isDeleted: true,
            }
          },
          refetchQueries: [
            "getESDocuments",
          ],
          awaitRefetchQueries: true,
        });
      }
    }
  }

  return (
    <>
      <Container
        maxWidth={false}
        className={classes.container}
        id={props.id ? props.id : props.parent}
      >
        <Table
          style={{ backgroundColor: "#fff" }}
          header={header}
          columns={columns}
          rows={props.searchedRows}
          total={total}
          loading={loading}
          addAble={addAble}
          targetLabel={targetLabel}
          uploadIcon={uploadIcon}
          dense={dense}
          orderByTracks={orderByTracks}
          startPaginationAt={null}
          // onClickAdd={onClickAdd}
          contactId={props.contactId}
          options={options}
          parent={props.parent}
          setColumnsBase={[]}
          deleteFunc={deleteFunc}
          onTableChange={onTableChange}
        />
      </Container>
    </>
  );
}

export default React.memo(TableHOC(DocumentsTable), deepEqualObjects);


