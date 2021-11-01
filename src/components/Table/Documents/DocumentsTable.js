import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import { 
  Container,
  Breadcrumbs,
  Typography,
  IconButton
} from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TableHOC from "components/Table/TableHOC";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import { Menu, MenuItem } from "@material-ui/core";
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
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const [selectedGridView, setSelectedGridView] = useState({name: "All Contacts"});

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
      case "resetFilters":
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

  const headerProps = {
    columns,
    setShowSaveAsNew,
    selectedGridView,
    // updateGridView,
    // selectedFilters: selectedFilters.current,
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

const HeaderComponent = ({ selectedGridView, setShowSaveAsNew, selectedFilters, updateGridView, columns }) => {
  const [showIcon, setShowIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

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
        <DescriptionOutlinedIcon />
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
                      filters: selectedFilters,
                      columns: columns.filter(col => col.options.display).map(col => col.name)
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

export default React.memo(TableHOC(DocumentsTable), deepEqualObjects);


