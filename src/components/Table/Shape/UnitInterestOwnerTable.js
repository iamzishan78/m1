import React, { useContext, useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import {
  Container,
  Button,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { useMutation } from "@apollo/client";

import { AppContext } from "AppContext";
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";
import { FEATURES } from "components/Shared/FeatureFlag/common";
import RequestPageIcon from "components/Shared/svgIcons/request_page";
import ButtonDropDown from "components/Shared/M1nTable/components/ButtonGroup";
import { NavigationContext } from "components/Navigation/NavigationContext";
import FeatureFlag from "components/Shared/FeatureFlag/FeatureFlagComponent";
import RightDialog from "components/ContactDetailCard/components/RightDialog";
import ExportOwnersAndContacts from "components/Shared/ExportOwnerAndContacts";
import AddUnitOwnerDialogContent from "components/Shared/M1nTable/components/SubComponents/AddUnitOwnerDialogContent";
import BuyContactsInfoDialogContent from "components/Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { AssignOwnerToContactDrawerContainer } from "store/containers";

import TableHeader from "components/Table/constants/ownersperunit-header-schema";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";
import { deepEqualObjects, copy } from "components/Shared/functions";
import { addTrailingZeros } from "components/Shared/functions";
import { usetableStyles } from "../Styles";
import { forEach } from "lodash";
import RecalculateSlideout from "./RecalculateSlideout";

const genericDataActions = ["comments", "tracks", "ifAreContacts"];
const interestKeys = [
  "working_interest",
  "royalty_interest",
  "orri",
  "nri",
  "nra",
];
const startPaginationAt = 25;

function UnitInterestOwnerTable(props) {
  let history = useHistory();
  const classes = usetableStyles();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [resetSelectedRow, setResetSelectedRow] = useState(false);
  const [stateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { customLayer, esIndex, clickedRow } = props;

  const [openCustomDialog, setOpenCustomDialog] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);

  const [updateShapeOwners, { data: updateData }] = useMutation(
    UPDATE_SHAPE_OWNERS,
    {
      onCompleted: () => {
        props.setLoading(false);
        setSelectedRows([]);
      },

      onError: (err) => { },
      refetchQueries: [
        "getESPaginatedList",
        "getESSimpleSearch",
        "getESFilterList",
      ],
      awaitRefetchQueries: true,
    }
  );

  const searchFields = ["contact.entityDetail.name", "_all"];
  const appliedFilters = [
    { field: "shape._id", value: customLayer._id },
    { field: "contact.IsDeleted", value: "false" },
  ];

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.isPurchased = hit?.contact?.isPurchased;
      hit.contactStatus = hit?.contact?.contactStatus;
      //remove until max offer price logic is fixed
      //hit.max_offer_price = hit?.nra * props.customLayer?.shapeJson?.properties?.uMaxUnitPricing;
      Object.keys(hit).forEach((key) => {
        if (interestKeys.includes(key)) {
          if (typeof hit[key] === "number")
            hit[key] = addTrailingZeros(hit[key]);
          else if (hit[key]?.["$numberDecimal"]) {
            hit[key] = addTrailingZeros(Number(hit[key]["$numberDecimal"]));
          }
        }
      });
      if (hit?.tags?.length > 0) {
        const tags = hit.tags.map((tag) => tag.tag);
        if (tags[0]) {
          hit.tags = [[tags], hit.tags.length];
        }
      } else {
        hit.tags = [[], 0];
      }
      hit = props.setGenricData(
        hit,
        hit?.contact?._id,
        genericDataActions,
        genericDataActions
      );
      return hit;
    });
  };

  useEffect(() => {
    props.setTableMeta({
      filters: appliedFilters || [],
      searchFields,
      TableHeader: copy(TableHeader),
      esIndex,
      startPaginationAt,
      formatHits,
      defaultSort: { field: "_ts", order: "asc" },
      setAppliedFilters: props.filtersChange,
      initializeGenericData: {
        key: "contact._id",
        actions: genericDataActions,
      },
      isSelectedAllAllowed: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle]);

  useEffect(() => {
    if (props.initialFilters.length > 2) {
      props.setIsFiltered(true);
    } else {
      props.setIsFiltered(false);
    }
  }, [props.initialFilters]);

  useEffect(() => {
    if (clickedRow) {
      setSelectedOwner({
        ...clickedRow,
      });
      setOpenCustomDialog("addOwnerToUnit");
    }
  }, [clickedRow]);

  const getRows = () => {
    const selectedRows = [];
    for (let i = 0; i < props.selectedRows.length; i++) {
      if (props.rows[props.selectedRows[i].index])
        selectedRows.push({
          ...props.rows[props.selectedRows[i].index],
          _id: props.rows[props.selectedRows[i].index].contactId,
        });
    }
    return selectedRows;
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      updateShapeOwners({
        variables: {
          shapeType: props.shapeType,
          shapeOwners: ids.map((_id) => ({ _id, isDeleted: true })),
        },
        refetchQueries: ["getESSimpleSearch", "getCustomLayer"],
        awaitRefetchQueries: true,
      });
    }
    setResetSelectedRow(!resetSelectedRow);
  };

  const onExport = () => {
    let rowsData = props.selectedRowsValues || []
    if (rowsData?.length === 0) {
      let rows = props.rows
      props.selectedRows.forEach((data) => {
        rowsData.push(rows[data.dataIndex]);
      });
    }
    setSelectedRows(rowsData);
    setOpenCustomDialog("exportOwnersAndContact");
  };

  const onBulkUpdateComplete = () => {
    setSelectedRows([]);
    setResetSelectedRow(!resetSelectedRow);
  };

  const customOptions = {
    customToolbar: () => {
      const options = [
        {
          text: "+ ADD OWNER TO UNIT",
          isShow: false,
          action: () => setOpenCustomDialog("addOwnerToUnit"),
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
                shapeType: "Unit",
              },
            }));
            history.push("/bulkupload");
          },
        },
      ];
      return (
        <div
          style={{
            display: "inline",
            float: "left",
            marginTop: "5px",
            marginRight: "5px",
          }}
        >
          <ButtonDropDown options={options} />
        </div>
      );
    },
    customToolbarSelect: () => {
      return (
        <div
          style={{
            height: "48px",
            display: "flex",
          }}
        >
          <div
            style={{
              marginTop: "6px",
              height: "35px",
              display: "flex",
            }}
          >
            {(!props.selectedRows || props.selectedRows?.length === 0) && (
              <CircularProgress
                size={40}
                color="secondary"
                style={{ marginRight: "1em" }}
              />
            )}
            {props.selectedRows && props.selectedRows?.length !== 0 && (
              <>
                <Button
                  color="secondary"
                  startIcon={<AutorenewIcon color="white" />}
                  className={classes.multiSelectionTopBarButtons}
                  disabled={
                    !props.selectedRows || props.selectedRows?.length === 0
                  }
                  onClick={() => {
                    let owners = [];

                    const rows = props.rows || props.selectedRowsValues;
                    for (let i in props.selectedRows) {
                      owners.push({
                        ...rows[props.selectedRows[i].dataIndex],
                        _id: rows[props.selectedRows[i].dataIndex].contact._id,
                      });
                    }
                    setSelectedRows(owners);
                    setOpenCustomDialog("recalculate");
                  }}
                >
                  Recalculate
                </Button>
                <Button
                  color="secondary"
                  startIcon={<EditIcon color="white" />}
                  className={classes.multiSelectionTopBarButtons}
                  disabled={
                    !props.selectedRows || props.selectedRows?.length === 0
                  }
                  onClick={() => {
                    let owners = [];

                    const rows = props.selectedRowsValues || props.rows;
                    for (let i in props.selectedRows) {
                      owners.push({
                        ...rows[i],
                        _id: rows[i].contact._id,
                      });
                    }
                    setSelectedRows(owners);
                    setOpenCustomDialog("bulkUpdate");
                  }}
                >
                  Bulk Update
                </Button>
                <Button
                  color="secondary"
                  startIcon={<CloudDownloadIcon color="white" />}
                  className={classes.multiSelectionTopBarButtons}
                  disabled={
                    !props.selectedRows || props.selectedRows?.length === 0
                  }
                  onClick={onExport}
                >
                  Export
                </Button>
                <FeatureFlag feature={FEATURES.IDICORE}>
                  <Button
                    color="secondary"
                    startIcon={<RequestPageIcon color="white" />}
                    className={classes.multiSelectionTopBarButtons}
                    disabled={
                      !props.selectedRows || props.selectedRows?.length === 0
                    }
                    onClick={() => setOpenCustomDialog("buyContactsInfoData")}
                  >
                    Contact Data
                  </Button>
                </FeatureFlag>

                <Tooltip title={"Delete"}>
                  <IconButton
                    size="medium"
                    style={{ margin: "0 5px" }}
                    disabled={
                      !props.selectedRows || props.selectedRows?.length === 0
                    }
                    onClick={(e) => {
                      setOpenCustomDialog("deleteOwner");
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </div>
        </div>
      );
    },
  };

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {openCustomDialog === "exportOwnersAndContact" && (
        <ExportOwnersAndContacts
          filters={[...props.initialFilters, ...appliedFilters]}
          onClose={() => setOpenCustomDialog("")}
          search={props.activeSearchRef.current}
          total={props.options.count}
          isSelectAll={isSelectAll}
          rows={selectedRows}
          esIndex={esIndex}
          type="Unit"
          open={true}
        />
      )}
      {openCustomDialog === "buyContactsInfoData" && (
        <RightDialog
          open={true}
          handleClickDialogClose={() => setOpenCustomDialog("")}
          width={"700px"}
        >
          <BuyContactsInfoDialogContent
            header="Contact Data Integration"
            onClose={() => setOpenCustomDialog("")}
            rows={getRows()}
            setRows={props.setSelectedRow}
          />
        </RightDialog>
      )}
      {openCustomDialog === "addOwnerToUnit" && (
        <AddUnitOwnerDialogContent
          open={true}
          width="450px"
          shapeId={props.customLayer._id}
          uAcres={props.customLayer?.shapeJson?.properties?.uAcres}
          uUnitPricing={props.customLayer?.shapeJson?.properties?.uUnitPricing}
          shapeType={props.shapeType}
          selectedRow={selectedOwner}
          onClose={() => {
            setSelectedOwner(null);
            setOpenCustomDialog("");
          }}
        />
      )}
      {openCustomDialog === "bulkUpdate" && (
        <AssignOwnerToContactDrawerContainer
          onClose={() => setOpenCustomDialog("")}
          rows={selectedRows}
          setRows={setSelectedRows}
          setSelectedRows={onBulkUpdateComplete}
        />
      )}
      {openCustomDialog === "recalculate" && (
        <RecalculateSlideout
          onClose={() => setOpenCustomDialog("")}
          rows={selectedRows}
          setRows={setSelectedRows}
        />
      )}
      {openCustomDialog === "deleteOwner" && (
        <DeleteConfirmationDialogContent
          header="Delete Unit Owner(s)"
          onClose={() => setOpenCustomDialog("")}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map(
            (sR) => props.rows[sR.dataIndex]?._id
          )}
          setM1nSelectedRowsIndexes={props.setSelectedRows}
        >
          {`Do you want to permanently delete the unit owner${props.selectedRows &&
            props.selectedRows.length > 1 &&
            props.selectedRows.length > 1
            ? "s"
            : ""
            }?`}
        </DeleteConfirmationDialogContent>
      )}
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        total={false}
        loading={props.loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        resetSelectedRow={resetSelectedRow}
        onRowSelectionChange={(
          currentRowsSelected,
          allRowsSelected,
          rowsSelected
        ) => {
          if (
            allRowsSelected.length === startPaginationAt ||
            allRowsSelected.length === props.options.count
          ) {
            setIsSelectAll(true);
          } else {
            setIsSelectAll(false);
          }
        }}
        options={{
          ...props.options,
          ...customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(UnitInterestOwnerTable), deepEqualObjects);
