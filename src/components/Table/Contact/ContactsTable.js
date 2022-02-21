import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container } from "@material-ui/core";
import { useSelector } from "react-redux";
import get from "lodash/get";
import moment from "moment";

import TableHeader from "components/Table/constants/contacts-header-schema.js";
import Contact from "components/Shared/svgIcons/contact";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "../TableESHOC";

import Loader from "components/Loaders";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from 'components/Table/helpers'

import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { REMOVE_CONTACTS } from "graphQL/useMutationRemoveContact";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import { getContactsAddress } from 'utils/helper';

import { copy, deepEqualObjects } from "components/Shared/functions";


const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
    "& .MuiToolbar-regular > div:nth-child(2)": {
      overflow: "auto",
      display: "flex",
      flexDirection: "row-reverse"
    },
    "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(1)": {
      marginRight: '52px'
    },
    "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(2)": {
      marginRight: '-104px'
    },
    "& .MuiToolbar-regular > div:nth-child(1)": {
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
  const tableRef = useRef();
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState(defaultView);
  const { activeModule } = useSelector(({ contact }) => contact);

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
  const [getCheckPurchaseData, { data: ContactPurchaseData }] = useLazyQuery(
    GET_CHECK_PURCHASE_DATA
  );
  const [updateGridView, { data: updatedGridView }] =
    useMutation(UPDATE_GRID_VIEW);
  const [removeContact] = useMutation(REMOVE_CONTACTS);

  const genericDataActions = ['tracks']

  const addAble = { parent: false, type: "contact" };
  const targetLabel = "contact";
  const uploadIcon = true;
  const header = "Contacts";
  const dense = true;
  const total = false;
  const orderByTracks = false;
  const startPaginationAt = 25;

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = getContactsAddress(props.setGenricData(hit, hit._id, ["tracks"]));
      hit.tags = hit?.tags?.length > 0
        ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
        : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
    return hits
  }

  const getFilters = () => {
    let newFilters = []
    if (selectedGridView?.filters) {
      newFilters = selectedGridView.filters
    }
    if (props.customAppliedFilters) {
      newFilters = [...newFilters, ...props.customAppliedFilters]
    }
    return newFilters;
  }

  useEffect(() => {
    props.setTableMeta({ ...props.tableMeta, selectedGridView, filters: getFilters() });
    // eslint-disable-next-line,
  }, [selectedGridView]);


  useEffect(() => {
    props.setTableMeta({
      addableName: "Contact",
      extendSearchQuery: esSearch,
      searchFields: ["_all"],
      TableHeader: copy(TableHeader),
      esIndex: "contacts_flat",
      // filters: getFilters(),
      startPaginationAt: 25,
      defaultSort: { field: 'lastUpdateAt', order: 'desc' },
      formatHits,
      initializeGenericData: { key: 'id', actions: genericDataActions }
    });
    // eslint-disable-next-line
  }, [props.contactSearchQuery, props.customAppliedFilters]);



  useEffect(() => {
    if (props?.rows?.length > 0) {
      const objectsIdsArray = props.rows.map((contact) => contact._id);
      getCheckPurchaseData({
        variables: {
          contactIds: objectsIdsArray,
        },
      });
    }
    // eslint-disable-next-line
  }, [props.rows]);

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
      view.filters[0] = {
        field: view.filters[0].field,
        type: 'range',
        value: {
          gte: moment().subtract(30, "days").toISOString(),
          lte: moment().toISOString()
        }
      }
    }
    return view;
  }

  const getSelectedView = () => {
    const view = copy(selectedGridView);
    if (selectedGridView.type === 'Default') {
      if (get(activeModule, 'title', '').includes('All')) {
        view.name = view.name.replace('Contacts', get(activeModule, 'title', '').replace('All ', ''))
      } else {
        view.name = view.name.replace('Contacts', get(activeModule, 'title', ''))
      }

    }
    return view;
  }

  const headerProps = {
    columns: props.columns,
    Icon: Contact,
    label: props.headerLabel,
    showViewModal,
    setShowSaveAsNew,
    setShowViewModal,
    selectedGridView: getSelectedView(),
    updateGridView,
    selectedFilters: props.activeFiltersRef.current,
  };

  delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = false

  console.log(props.columns)

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
            columns={props.columns}
            handleDefaultView={handleDefaultView}
            handleClose={() => setShowViewModal(false)}
            setSelectedGridView={setSelectedGridView}
            selectedGridView={selectedGridView}
            setShowViewModal={setShowViewModal}
            setShowSaveAsNew={setShowSaveAsNew}
            showSaveAsNew={showSaveAsNew}
            selectedFilters={props.activeFiltersRef.current}
          />
        )}
        <Table
          tableRef={tableRef}
          style={{ backgroundColor: "#fff" }}
          header={header}
          headerComponent={HeaderComponent}
          headerProps={headerProps}
          columns={props.columns}
          rows={props.rows}
          total={total}
          loading={props.loading}
          addAble={addAble}
          targetLabel={targetLabel}
          uploadIcon={uploadIcon}
          dense={dense}
          orderByTracks={orderByTracks}
          startPaginationAt={startPaginationAt}
          contactId={props.contactId}
          options={{
            ...props.options,
            ...props.customOptions,
          }}
          parent={props.parent}
          setColumnsBase={[]}
          deleteFunc={deleteFunc}
          onTableChange={props.onTableChange}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(ContactsTable), deepEqualObjects);
