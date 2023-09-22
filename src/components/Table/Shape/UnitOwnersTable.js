import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
// context
import { NavigationContext } from "../../Navigation/NavigationContext";

import { Container, Button, Dialog, Tooltip, IconButton } from "@material-ui/core";
import ButtonDropDown from "components/Shared/M1nTable/components/ButtonGroup";
import Table from "components/Shared/M1nTable/components/Table";
import DeleteIcon from "@material-ui/icons/Delete";
import TableHOC from "components/Table/TableHOC";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import RequestPageIcon from "components/Shared/svgIcons/request_page";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import BuyContactsInfoDialogContent from "../../Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent";


// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import { addTrailingZeros, copy, deepEqualObjects, setStateIfDeepEqual } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent"

// Header Schemas
import TableHeader from 'components/Table/constants/ownersperunit-header-schema'

// Utilities
import { usetableStyles } from "../Styles";
import AddUnitOwnerDialogContent from "components/Shared/M1nTable/components/SubComponents/AddUnitOwnerDialogContent";
import { AutoCompleteFilter } from "../AutoCompleteFilter";
import { GET_ES_PAGINATED_LIST } from "graphQL/useQueryESPaginatedList";
import { GET_ES_FILTER_LIST } from "graphQL/useQueryESFilterList";


function UnitOwnersTable(props) {
  const classes = usetableStyles();
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const history = useHistory();

  const [addToTable, setAddToTable] = useState(false)
  const [openDialog, setOpenDialog] = useState(null);
  const [expandedObject, ExpandedObject] = useState();

  // function states
  const [columns, Columns] = useState([]);
  const [selectedRow, selectRow] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const setColumns = (newState) => { setStateIfDeepEqual(Columns, newState); };

  // queries

  const [getESPaginatedList, { data: elasticData }] = useLazyQuery(GET_ES_PAGINATED_LIST, {
    fetchPolicy: "no-cache", onCompleted: () => {
      props.setLoading(false);
      setSelectedRows([])
    }
  });

  const [getCheckPurchaseData, { data: ContactPurchaseData }] = useLazyQuery(
    GET_CHECK_PURCHASE_DATA
  );

  const [updateShapeOwners, { data: updateData }] = useMutation(UPDATE_SHAPE_OWNERS, {
    onCompleted: () => {
      props.setLoading(false);
      setSelectedRows([])
    },

    onError: (err) => { },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
  });

  const tableData = elasticData?.getESPaginatedList

  const addAble = {
    type: "wellInterest", customLayer: props.customLayer,
    customLayerId: props.customLayer._id,
  }

  const startPaginationAt = 25
  const extendSearchQuery = `shape._id:${props.customLayer._id}`
  const esIndex = 'shapeowners_flat';

  const setExpandedObject = (newState) => {
    setStateIfDeepEqual(ExpandedObject, newState);
  };

  ////////////Contact Wells begin///////////////////////////////////////////////
  useEffect(() => {
    getESPaginatedList({
      variables: {
        esIndex,
        pagination: {
          first: startPaginationAt,
          keep_alive: "1micros"
        },
        search: `shape._id:${props.customLayer._id}`
      }
    });
  }, [props.parent]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const objectsIdsArray = tableData?.hits?.map((hit) => hit.ownerEntity);
      const globalOwnerIds = tableData?.hits?.map((hit) => hit.ownerEntity || hit.globalOwnerId);
      props.initializeGenericData(objectsIdsArray, ['comments', 'tags']);
      props.ifAreContacts([...globalOwnerIds]);
    }
  }, [tableData, elasticData]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      const objectsIdsArray = tableData.hits.map((contact) => contact.contactId);
      getCheckPurchaseData({
        variables: {
          contactIds: objectsIdsArray,
        },
      });
    }
  }, [tableData, elasticData]);

  useEffect(() => {
    if (tableData?.hits?.length > 0) {
      let hits = tableData?.hits
      hits = hits.map((hit) => {
        Object.keys(hit).forEach((key) => {
          if (['working_interest', 'royalty_interest', 'orri', 'nri', 'nra'].includes(key))
            hit[key] = addTrailingZeros(hit[key])
        })
        hit.block = hit?.shape?.shapeJson?.properties?.originalProperties?.Block;
        hit.township = hit?.shape?.shapeJson?.properties?.originalProperties?.Township;
        hit.description = hit?.shape?.shapeJson?.properties?.description;
        hit.contactStatus = hit?.contact?.contactStatus;
        hit.isPurchased = hit?.contact?.isPurchased;
        hit = props.setGenricData(hit, hit.ownerEntity, ['comments', 'tracks', 'tags', 'ifAreContacts']);
        return hit;
      });
      // if (ContactPurchaseData?.getCheckPurchaseData) {
      //   for (let i = 0; i < ContactPurchaseData?.getCheckPurchaseData.length; i++) {
      //     for (let index in hits) {
      //       if (hits[index].contactId === ContactPurchaseData.getCheckPurchaseData[i]) {
      //         hits[index].isPurchased = true;
      //       }
      //     }
      //   }
      // }
      props.setRows(copy(hits));
      TableHeader.forEach((column) => {
        const custom = column.custom;
        if (column?.options?.filter) {
          column.options = {
            ...column.options,
            filter: true,
            filterType: 'custom',
            filterOptions: {
              display: (filterList, onChange, index, column) => {
                column.filterKey = TableHeader.find(el => el.name === column.name)?.esKey;
                column.type = TableHeader.find(el => el.name === column.name)?.type;
                return (
                  <AutoCompleteFilter filterList={filterList} column={column} index={index} onChange={onChange}
                    extendSearchQuery={extendSearchQuery} query={GET_ES_FILTER_LIST} esIndex={esIndex} custom={custom} />
                );
              }
            }
          }
        }
      })

      setColumns(TableHeader);
      props.setLoading(false);
    }
    else if (tableData?.hits?.length === 0) {
      props.setRows([]);
      props.setLoading(false);
    }
  }, [tableData, ContactPurchaseData, props.dependencyUpdate]);


  ////////////Contact Wells end///////////////////////////////////////////////

  const onTableChange = (action, tableState, rows, meta) => {
    tableState.esIndex = esIndex
    const tableActions = props.initializeTableActions(tableState, meta, tableData, columns, getESPaginatedList)
    if (action === 'filterChange') {
      if (tableActions?.pageESVariables?.variables?.filters?.length > 0) {
        props.setIsFiltered(true)
      } else {
        props.setIsFiltered(false)
      }
    }
    switch (action) {
      case "search":
      case "sort":
      case "filterChange":
      case "resetFilters":
      case "changeRowsPerPage":
        tableActions.extendSearchQuery(extendSearchQuery);
        tableActions.genericESAction();
        break;
      case "rowSelectionChange":
        setSelectedRows(tableState.selectedRows.data)
        break;
      case "changePage":
        tableActions.extendSearchQuery(extendSearchQuery);
        tableActions.changeESPage();
        break;
      default:
    }
  }

  //   const ButtonActions = React.useMemo(() => {
  //     return [{
  //         isShow: false, text: 'Update Group', action: () => {
  //             handleAddUpdateDelete({ type: 'update', name: reportingGroup })
  //         }
  //     },
  //     { isShow: true, text: 'Save as New Report Group', action: () => setConfig({ show: true, type: 'new', name: reportingGroup + " - Copy" }) },
  //     { isShow: true, text: 'Edit Report Group Name', action: () => setConfig({ show: true, type: 'update', name: reportingGroup }) },
  //     { isShow: true, text: 'Delete Report Group', action: () => setDeleteDialogOpen(true) }
  //     ]
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [reportingGroup, handleAddUpdateDelete]);

  const count = tableData?.total || 0
  const options = {
    rowsPerPageOptions: [10, 25, 50, 100],
    count: count,
    serverSide: true,
    searchable: true,
    rowsSelected: selectedRows.map((sR) => sR.dataIndex),
    filter: true,
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }} >
          <ButtonDropDown variant="contained" /*color="secondary" className={classes.multiSelectionTopBarButtons}*/ options={[
            {
              text: `+ ADD OWNER TO ${props.shapeType?.toUpperCase()}`,
              isShow: false,
              action: () => {
                setAddToTable(true);
                selectRow(null);
              },
            },
            {
              text: "Import Interest Owners",
              isShow: true,
              action: () => {
                setStateNav((stateNav) => ({
                  ...stateNav,
                  bulkUploadFromMap: true,
                  bulkUploadShape: {
                    id: props.customLayer._id,
                    shapeLabel: props.customLayer.name,
                    shapeType: "Unit"
                  }
                }));
                history.push("/bulkupload");
              },
            },
          ]} />
        </div>
      );
    },
    customToolbarSelect: ({ data }) => {
      return (
        <div style={{ height: "48px", display: "flex" }}>
          <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
            <FeatureFlag feature={FEATURES.IDICORE}>
              <Button
                color="secondary"
                startIcon={<RequestPageIcon color="white" />}
                className={classes.multiSelectionTopBarButtons}
                onClick={() => {
                  let contacts = [];
                  for (let i in selectedRows) {
                    if (props.rows[selectedRows[i].dataIndex]) {
                      props.rows[selectedRows[i].dataIndex]._id =
                        props.rows[selectedRows[i].dataIndex].contactId;
                      contacts.push(props.rows[selectedRows[i].dataIndex]);
                    }
                  }
                  selectRow(contacts);
                  handleExpandClick(contacts, "buyContactsInfoData");
                }}
              >
                Contact Data
              </Button>
            </FeatureFlag>
            <Tooltip title={"Delete"}>
              <IconButton
                size="medium"
                style={{ margin: "0 5px" }}
                aria-label="delete"
                onClick={(e) => {
                  setOpenDialog("delete");
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      );
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      setAddToTable(true);
      selectRow({ ...props.rows[dataIndex] });
    },
  };

  const handleExpandClick = async (idOrValues, type) => {
    setExpandedObject(idOrValues);
    setOpenDialog(type);
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      updateShapeOwners({
        variables: {
          shapeType: props.shapeType,
          shapeOwners: ids.map((_id) => ({
            _id,
            shapeId: props.rows.find(row => row._id === _id)?.customLayerId,
            isDeleted: true,
          })),
        }
      });
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false);
    selectRow(null);
  }

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >

      {addToTable && <AddUnitOwnerDialogContent
        open={addToTable}
        width="450px"
        shapeId={props.customLayer._id}
        uAcres={props.customLayer?.shapeJson?.properties?.uAcres}
        uUnitPricing={props.customLayer?.shapeJson?.properties?.uUnitPricing}
        shapeType={props.shapeType}
        selectedRow={selectedRow}
        onClose={() =>
          setAddToTable(false)
        }
      />}

      {openDialog && openDialog === "buyContactsInfoData" && (
        <RightDialog
          open={openDialog ? true : false}
          handleClickDialogClose={handleCloseDialog}
          width={"700px"}
        >
          <BuyContactsInfoDialogContent
            header="Contact Data Integration"
            onClose={() => { setOpenDialog(null); selectRow(null); }}
            rows={expandedObject}
            setRows={setExpandedObject}
            setSelectedRow={selectRow}
          />
        </RightDialog>
      )}

      {openDialog && openDialog === "delete" && (
        <Dialog open={openDialog ? true : false} onClose={() => setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
          <DeleteConfirmationDialogContent
            header="Delete Interest Owner(s)"
            onClose={() => setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={selectedRows.map((sR => props.rows[sR.dataIndex]?._id))}
            setM1nSelectedRowsIndexes={setSelectedRows}
          >
            {`Do you want to permanently delete the Interest Owner${selectedRows &&
              selectedRows.length > 1 &&
              selectedRows.length > 1
              ? "s"
              : ""
              } from  this Unit?`}
          </DeleteConfirmationDialogContent>
        </Dialog>
      )}


      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        rows={props.rows}
        total={false}
        loading={props.loading}
        addAble={addAble}
        targetLabel={props.targetLabel}
        deleteFunc={deleteFunc}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableHOC(UnitOwnersTable), deepEqualObjects);
