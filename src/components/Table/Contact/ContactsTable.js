import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";
import Loader from "components/Loaders";
// Header Schemas
import TableHeader from "components/Table/constants/contacts-header-schema.js";
import { GET_ES_DOCUMENTS_FILTER } from "graphQL/useQueryESDocumentsFilter";
import { REMOVE_CONTACTS } from "graphQL/useMutationRemoveContact";
import { GET_ES_CONTACTS } from "graphQL/useQueryESContacts";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
}));

function ContactsTable(props) {
  const classes = useStyles();

  // function states
  const [columns, Columns] = useState([]);
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  // queries
  const [getESContacts, { data: ContactsData, loading }] = useLazyQuery(
    GET_ES_CONTACTS,
    { fetchPolicy: "no-cache" }
  );
  const [removeContact] = useMutation(REMOVE_CONTACTS);

  const tableData = ContactsData?.getESContacts;

  const addAble = { parent: false, type: "contact" };
  const targetLabel = "contact";
  const uploadIcon = true;
  const header = "Contacts";
  const dense = true;
  const total = false;
  const orderByTracks = false;
  const startPaginationAt = 25;

  useEffect(() => {
    getESContacts({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: props.contactSearchQuery
          ? `name:${props.contactSearchQuery}`
          : "",
      },
    });
  }, [getESContacts, props.parent, props.contactSearchQuery]);

  useEffect(() => {
    if (tableData?.hits?.length) {
      let objectsIdsArray = tableData.hits.map((el) => el._id);
      props.initializeGenericData(objectsIdsArray, ["comments", "tags"]);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData?.hits?.length) {
      const hits = tableData.hits.map((hit) => {
        hit = props.setGenricData(hit, hit._id, ["comments", "tracks", "tags"]);
        return hit;
      });
      props.setRows(JSON.parse(JSON.stringify(hits)));
      TableHeader.forEach((column) => {
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: "custom",
            filterOptions: {
              display: (filterList, onChange, index, column) => {
                column.filterKey = TableHeader.find(
                  (el) => el.name === column.name
                )?.esKey;
                return (
                  <AutoCompleteFilter
                    filterList={filterList}
                    column={column}
                    index={index}
                    onChange={onChange}
                    query={GET_ES_DOCUMENTS_FILTER}
                  />
                );
              },
            },
          };
        }
      });

      setColumns(TableHeader);
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [tableData, props.dependencyUpdate]);

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    search: false,
    filter: true,
    searchText: props.contactSearchQuery,
  };
  ////////////-----Add your code section here-----///////////////////////
  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(
      tableState,
      meta,
      tableData,
      columns,
      getESContacts
    );
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "changePage":
        tableActions.changeESPage();
        break;
      default:
    }
  };

  const deleteFunc = (contactsIdsToDelete) => {
    if (contactsIdsToDelete) {
      Loader.createToast("contact-deletion", "Contact Deletion in Progress");
      removeContact({
        variables: {
          contactIds: contactsIdsToDelete,
          userId: props.userId,
        },
        refetchQueries: [
          "getESContacts",
          "getContact",
          "checkIfOwnersAreContacts",
        ],
        awaitRefetchQueries: true,
      }).then(
        (res) => {
          if (res.data && res.data.removeContact) {
            const { success, message } = res.data.removeContact;
            if (success) Loader.successToast("contact-deletion", message);
            else Loader.errorToast("contact-deletion", message);
          } else
            Loader.errorToast(
              "contact-deletion",
              "Failed to convert to contact"
            );
        },
        (err) => {
          console.log(err);
          Loader.errorToast("contact-deletion", "Failed to convert to contact");
        }
      );
    }
  };

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

export default React.memo(TableHOC(ContactsTable), deepEqualObjects);
