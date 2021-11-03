import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";

import moment from "moment";

import TableHeader from "components/Table/constants/contacts-header-schema.js";
import Contact from "components/Shared/svgIcons/contact";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";

import Loader from "components/Loaders";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from 'components/Table/helpers'
import { handleSelectedGridChange, setColumnsData } from 'components/Table/helpers'

import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { GET_ES_CONTACTS_FILTER } from "graphQL/useQueryESContactsFilter";
import { REMOVE_CONTACTS } from "graphQL/useMutationRemoveContact";
import { GET_ES_CONTACTS } from "graphQL/useQueryESContacts";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
  },
  details: {
    display: "block",
    "& div": {
      padding: "5px !important",
    },
  },
  searchField: {
    margin: "0 !important",
    padding: "10px !important",
  },
  summary: {
    backgroundColor: "#F2F2F2",
    height: "40px !important",
    minHeight: "40px !important",
  },
}));

function ContactsTable(props) {
  const classes = useStyles();
  const defaultView = {
    name: "All Contacts",
    type: 'Default'
  }

  // function states
  const selectedFilters = useRef([]);
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState(defaultView);
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  // queries
  const [getESContacts, { data: ContactsData, loading }] = useLazyQuery(
    GET_ES_CONTACTS,
    { fetchPolicy: "no-cache" }
  );
  const [getCheckPurchaseData, { data: ContactPurchaseData }] = useLazyQuery(
    GET_CHECK_PURCHASE_DATA
  );
  const [updateGridView, { data: updatedGridView }] =
    useMutation(UPDATE_GRID_VIEW);
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
        search: props.contactSearchQuery ? `${props.contactSearchQuery}` : "",
        filters: selectedGridView?.filters ? selectedGridView?.filters : [],
      },
    });
  }, [getESContacts, props.parent, props.contactSearchQuery, selectedGridView]);

  useEffect(() => {
    if (tableData?.hits) {
      const objectsIdsArray = tableData.hits.map((contact) => contact._id);
      getCheckPurchaseData({
        variables: {
          contactIds: objectsIdsArray,
        },
      });
    }
  }, [tableData]);

  useEffect(() => {
    if (ContactPurchaseData?.getCheckPurchaseData) {
      const rows = JSON.parse(JSON.stringify(props.rows));
      for (let i = 0; i < ContactPurchaseData?.getCheckPurchaseData.length; i++) {
        const index = rows.findIndex((row) => row._id === ContactPurchaseData.getCheckPurchaseData[i]);
        rows[index].isPurchased = true;
      }
      props.setRows(rows);
    }
  }, [ContactPurchaseData]);

  useEffect(() => {
    if (tableData?.hits) {
      const hits = tableData.hits.map((hit) => {
        hit = getContactsAddress(props.setGenricData(hit, hit._id, ["tracks"]));
        hit.tags = hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
        hit.commentsCounter = hit.comments ? hit.comments.length : 0;
        return hit;
      });
      props.setRows(JSON.parse(JSON.stringify(hits)));
      setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(columns)), setColumns, setFilters, GET_ES_CONTACTS_FILTER);
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [ContactsData, tableData, props.dependencyUpdate]);

  useEffect(() => {
    const updatedColumns = handleSelectedGridChange(TableHeader, selectedGridView, columns)
    setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(updatedColumns)), setColumns, setFilters, GET_ES_CONTACTS_FILTER);
  }, [selectedGridView]);

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    search: false,
    filter: true,
    searchText: props.contactSearchQuery,
  };

  const getContactsAddress = (contact) => {
    let address = "https://www.google.com/maps/search/";
    if (contact.address1)
      address = `${address}${contact.address1.replace(/ /g, "+")}`;
    if (contact.city)
      address = `${address},+${contact.city.replace(/ /g, "+")}`;
    if (contact.state) address = `${address},+${contact.state}`;
    if (contact.zip) address = `${address}+${contact.zip}`;
    return {
      ...contact,
      fullContactAddress: address,
    };
  };

  
  const viewColumnsChange = (tableColumns) => {
    for (let i = 0; i < tableColumns.length; i++) {
      if (tableColumns[i].display === "true") {
        columns[i].options.display = true;
        if (columns[i].esKey && !columns[i].noFilter) {
          columns[i].options.filter = true;
        }
      } else {
        columns[i].options.display = false;
      }
    }
    setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(columns)), setColumns, setFilters, GET_ES_CONTACTS_FILTER);
  };
  ////////////-----Add your code section here-----///////////////////////
  const onTableChange = (action, tableState, rows, meta) => {
    const tableActions = props.initializeTableActions(
      tableState,
      meta,
      tableData,
      columns,
      getESContacts,
      selectedGridView
    );
    selectedFilters.current = tableActions?.pageESVariables?.variables?.filters;
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
      case "viewColumnsChange":
        viewColumnsChange(tableState.columns);
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

  const handleDefaultView = (view, user) => {
    if (view.name === "My Contacts") {
      view.filters[0].value = user.name;
    }
    if (
      view.name === "Recently Modified" ||
      view.name === "Recently Added"
    ) {
      view.filters[0].value.range[view.filters[0].field].gte =
        moment().subtract(30, "days").toISOString();
        view.filters[0].value.range[view.filters[0].field].lte =
        moment().toISOString();
    }
    return view;
  }

  const headerProps = {
    columns,
    Icon: Contact,
    label: 'Contacts',
    showViewModal,
    setShowSaveAsNew,
    setShowViewModal,
    selectedGridView,
    updateGridView,
    selectedFilters: selectedFilters.current,
  };

  return (
    <>
      <Container
        maxWidth={false}
        className={classes.container}
        id={props.id ? props.id : props.parent}
      >
        {showViewModal && (
          <GridView
            module="Contacts"
            defaultView={defaultView}
            columns={columns}
            handleDefaultView={handleDefaultView}
            handleClose={() => setShowViewModal(false)}
            setSelectedGridView={setSelectedGridView}
            selectedGridView={selectedGridView}
            setShowViewModal={setShowViewModal}
            setShowSaveAsNew={setShowSaveAsNew}
            showSaveAsNew={showSaveAsNew}
            selectedFilters={selectedFilters.current}
          />
        )}
        <Table
          style={{ backgroundColor: "#fff" }}
          header={header}
          headerComponent={HeaderComponent}
          headerProps={headerProps}
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
