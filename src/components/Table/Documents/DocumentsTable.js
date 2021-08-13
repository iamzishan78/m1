import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";

import { deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas 
import TableHeader from 'components/Table/constants/documents-header-schema.js'
import { GET_ES_DOCUMENTS } from "graphQL/useQueryESDocuments";
import { GET_ES_DOCUMENTS_FILTER } from "graphQL/useQueryESDocumentsFilter";
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
  const [updateDocument] = useMutation(UPDATE_DOCUMENT);

  const tableData = DocumentsData?.getESFiles

  const addAble = { parent: false, type: "document" }
  const targetLabel = 'documents'
  const uploadIcon = true;
  const header = "Documents";
  const dense = true
  const total = false
  const orderByTracks = false
  const startPaginationAt = 25

  useEffect(() => {
    getESDocuments({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros"
        },
        search: props.documentSearchQuery ? props.documentSearchQuery : ""
      }
    })
  }, [getESDocuments, props.parent, props.documentSearchQuery])


  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      props.setRows(tableData?.hits);
      TableHeader.forEach((column) => {
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: 'custom',
            filterOptions: {
              display: (filterList, onChange, index, column) => {
                column.filterKey = TableHeader.find(el => el.name === column.name)?.esKey;
                return (
                  <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange} query={GET_ES_DOCUMENTS_FILTER} />
                );
              }
            }
          }
        }
      })

      setColumns(TableHeader);
      props.setLoading(false);
    }
    else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const count = tableData?.total || 0
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    search: false,
    filter: true,
    searchText: props.documentSearchQuery,
  }
  ////////////-----Add your code section here-----///////////////////////
  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESDocuments)
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "changePage":
        tableActions.changeESPage();
        break;
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
          startPaginationAt={startPaginationAt}
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


