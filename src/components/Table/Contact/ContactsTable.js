import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
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
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";
import { REMOVE_CONTACTS } from "graphQL/useMutationRemoveContact";
import { GET_ES_CONTACTS } from "graphQL/useQueryESContacts";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import { getContactsAddress } from 'utils/helper';
import { copy } from 'utils/helper';

import {
  deepEqualObjects,
  setStateIfDeepEqual,
} from "components/Shared/functions";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
    "& .MuiToolbar-regular > div:nth-child(2)":{
      overflow: "auto",
      display: "flex",
      flexDirection: "row-reverse"
    },
    "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(1)":{
      marginRight: '52px'
    },
    "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(2)":{
      marginRight: '-104px'
    },
    "& .MuiToolbar-regular > div:nth-child(1)":{
      minWidth: "400px"
    }
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
  const tableRef = useRef();
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState(defaultView);
  const { activeModule } = useSelector(({ contact }) => contact);

  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  const esSearch = (() => {
    let searchString = ""
    if (props.contactSearchQuery) {
      searchString = props.contactSearchQuery.replace(/([\!\*\+\&\|\(\)\[\]\{\}\^\~\?\:\"])/g, "\\$1").split(/\s+/)
    }

    return searchString
      ? `(name:(${searchString.join('* AND ')}*))^4 OR (name:(${searchString.join('* ')}*))^2 OR (_all:(${searchString.join('* ')}*))`
      : ""
  })();

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

  const getFilters = () => {
    let newFilters = []
    if(selectedGridView?.filters){
      newFilters = selectedGridView.filters
    }
    if(props.customAppliedFilters){
      newFilters = [...newFilters, ...props.customAppliedFilters]
    }
    return newFilters;
  }

  useEffect(() => {
    getESContacts({
      variables: {
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros",
        },
        search: esSearch,
        filters: getFilters(),
      },
    });
  }, [getESContacts, props.parent, props.contactSearchQuery, selectedGridView, props.customAppliedFilters]);

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
      setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(columns)), setColumns, setFilters, GET_ES_FILTER_LIST, 'contacts_flat');
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [ContactsData, tableData, props.dependencyUpdate]);

  useEffect(() => {
    tableRef.current.changePage(0)
    tableRef.current.isFetching = false;
    if (!isEmpty(selectedGridView)) {
      const view = copy(selectedGridView);
      if(view){
        view.filters = getFilters();
      }
      const updatedColumns = handleSelectedGridChange(TableHeader, view, columns, true);
      setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(updatedColumns)), setColumns, setFilters, GET_ES_FILTER_LIST, 'contacts_flat');
    }
  }, [selectedGridView,  props.customAppliedFilters]);

  const count = tableData?.total || 0;
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    search: false,
    filter: true,
    searchText: props.contactSearchQuery,
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
    setColumnsData(TableHeader, filters, JSON.parse(JSON.stringify(columns)), setColumns, setFilters, GET_ES_FILTER_LIST, 'contacts_flat');
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
    if (action === 'filterChange') {
      setFilters(tableState.filterList)
    }
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.genericESAction();
        break;
      case "changePage":
        if (tableRef.current.isFetching === false) {
          tableRef.current.isFetching = true
          return;
        }
        if (tableData) {
          tableActions.changeESPage();
        }
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

  const getSelectedView = () => {
    const view = copy(selectedGridView);
    if(selectedGridView.type === 'Default') {
      if(get(activeModule, 'title','').includes('All')){
        view.name = view.name.replace('Contacts', get(activeModule, 'title','').replace('All ', ''))
      }else{
        view.name = view.name.replace('Contacts', get(activeModule, 'title',''))
      }
      
    }
    return view;
  }

  const headerProps = {
    columns,
    Icon: Contact,
    label: props.headerLabel,
    showViewModal,
    setShowSaveAsNew,
    setShowViewModal,
    selectedGridView : getSelectedView(),
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
          tableRef={tableRef}
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
