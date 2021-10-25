import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Breadcrumbs,
  Typography,
  IconButton
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import get from 'lodash/get';
import { Menu, MenuItem } from "@material-ui/core";

import TableHeader from "components/Table/constants/contacts-header-schema.js";
import Contact from "components/Shared/svgIcons/contact";
import Table from "components/Shared/M1nTable/components/Table";
import TableHOC from "components/Table/TableHOC";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import Loader from "components/Loaders";
import GridView from "components/Shared/GridView";

import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { GET_ES_CONTACTS_FILTER } from "graphQL/useQueryESContactsFilter";
import { REMOVE_CONTACTS } from "graphQL/useMutationRemoveContact";
import { GET_ES_CONTACTS } from "graphQL/useQueryESContacts";

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

  // function states
  const selectedFilters = useRef([]);
  const [filters, setFilters] = useState([]);
  const [columns, Columns] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [selectedGridView, setSelectedGridView ] = useState({ name: 'All Contacts' });
  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  // queries
  const [getESContacts, { data: ContactsData, loading }] = useLazyQuery(
    GET_ES_CONTACTS,
    { fetchPolicy: "no-cache" }
  );
  const [updateGridView, { data: updatedGridView }] = useMutation(UPDATE_GRID_VIEW);
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
        filters: selectedGridView?.filters? selectedGridView?.filters : [],
      },
    });
  }, [getESContacts, props.parent, props.contactSearchQuery, selectedGridView]);

  useEffect(() => {
    if (tableData?.hits?.length) {
      let objectsIdsArray = tableData.hits.map((el) => el._id);
      props.initializeGenericData(objectsIdsArray, ["comments", "tags"]);
    }
  }, [tableData]);

  useEffect(() => {
    if (tableData?.hits) {
      const hits = tableData.hits.map((hit) => {
        hit = props.setGenricData(hit, hit._id, ["comments", "tracks", "tags"]);
        return hit;
      });
      props.setRows(JSON.parse(JSON.stringify(hits)));
      TableHeader.forEach((column, index) => {
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: "custom",
            filterList: filters[index],
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
                    query={GET_ES_CONTACTS_FILTER}
                  />
                );
              },
            },
            onFilterChange: (columnChanged, filterList) => {
              setFilters(filterList)
            }
          };
        }
      });

      setColumns(TableHeader);
      props.setLoading(false);
    } else if (tableData?.length === 0) {
      props.setLoading(false);
    }
  }, [ContactsData, tableData, props.dependencyUpdate]);

  useEffect(() => {
    if(selectedGridView?.filters){
      columns.forEach((column, index) => {
        const value = get(selectedGridView?.filters?.find(filter => filter.field === column.esKey), 'value', '')
        let filterList =  []
        if(value){
          filterList = [value]
        }
        if (column?.options?.filter) {
          column.options.filterList = filterList;
        }
      });
  
      setColumns(columns);
    }
  },[selectedGridView])

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
      getESContacts,
      selectedGridView
    );
    selectedFilters.current = tableActions?.pageESVariables?.variables?.filters
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

  const headerProps = {
    showViewModal,
    setShowSaveAsNew,
    setShowViewModal,
    selectedGridView,
    updateGridView,
    selectedFilters: selectedFilters.current
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

const HeaderComponent = ({ selectedGridView, setShowViewModal, showViewModal, setShowSaveAsNew, selectedFilters, updateGridView }) => {
  const [showIcon, setShowIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", justifyContent: "left" }}
    >
      <IconButton onClick={() => setShowViewModal(!showViewModal)}>
        <Contact />
      </IconButton>

      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Typography
          style={{
            marginLeft: "10px",
            fontSize: "16px",
          }}
          color="inherit"
        >
          Contacts
        </Typography>
        <div>
          <div style={{ display: "flex", color: "#18AADD", fontSize: "16px", cursor: "pointer" }}
            onClick={(event) => handleClick(event)}
            onMouseOver={() => setShowIcon(true)}
            onMouseLeave={() => setShowIcon(false)}>
            <Typography>
              <span>{selectedGridView.name}</span>
            </Typography>
            <span style={{ height: "0px", color: "#18AADD", fontSize: "16px", cursor: "pointer" }}>{showIcon && <ExpandMoreIcon />}</span>
          </div>
          <Menu
            style={{ zIndex: '1305'}}
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <MenuItem 
              style={{ width: '250px' }} 
              onClick={() => {
                handleClose();
                updateGridView({ 
                  variables: {
                    gridView: {
                      _id: selectedGridView._id, 
                      filters: selectedFilters
                    }
                  }
                })
              }} 
              disabled={selectedGridView.type === 'Default' || selectedGridView.name === 'All Contacts'}
            >
              Update view
            </MenuItem>
            <MenuItem onClick={() => {
                handleClose();
                setShowViewModal(true);
                setShowSaveAsNew(true);
              }}>
                Save as new view
            </MenuItem>
          </Menu>

        </div>        
      </Breadcrumbs>
    </div>
  );
};
export default React.memo(TableHOC(ContactsTable), deepEqualObjects);
