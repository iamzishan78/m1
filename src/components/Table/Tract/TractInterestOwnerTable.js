import React, { useContext, useEffect, useState } from "react";
// context
import { useHistory } from "react-router-dom";
import { Container, Button, Tooltip, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import EditIcon from "@material-ui/icons/Edit";
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
import AddParcelOwnerDialogContent from "components/Shared/M1nTable/components/SubComponents/AddParcelOwnerDialogContent";
import BuyContactsInfoDialogContent from "components/Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

import TableHeader from "components/Table/constants/tract-interest-owner-header-schema";
import { UPDATEPARCELOWNER } from "graphQL/useMutationUpdateParcelOwner";
import vf_currency from "components/Shared/valueformatters/vf_currency";
import { deepEqualObjects, copy } from "components/Shared/functions";
import { addTrailingZeros } from "components/Shared/functions";
import { usetableStyles } from "../Styles";
import { AssignOwnerToContactDrawerContainer } from "store/containers";

const genericDataActions = ["comments", "tracks", "ifAreContacts"];
const interestKeys = [
  "nra",
  "surface_interest",
  "mineral_interest",
  "royalty_interest",
  "orri",
  "record_title",
  "operating_rights",
  "nri",
  "net_acres",
  "company_net_acres",
  "unknown_interest",
];
const startPaginationAt = 25;

function TractInterestOwnerTable(props) {
  let history = useHistory();
  const classes = usetableStyles();
  const [selectedRows, setSelectedRows] = useState([]);
  const [resetSelectedRow, setResetSelectedRow] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [stateApp, setStateApp] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { customLayer, esIndex, searchFields, clickedRow } = props;

  const [openCustomDialog, setOpenCustomDialog] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);

  const [updateParcelOwner] = useMutation(UPDATEPARCELOWNER);

  const appliedFilters = [
    { field: "shape._id", value: customLayer._id },
    { field: "contact.IsDeleted", value: "false" },
    { field: "descriptor", value: "ParcelDescriptor" }
  ];

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.ownershipType = hit?.contact?.ownerType;
      hit.isPurchased = hit?.contact?.isPurchased;
      hit.name = hit?.contact?.entityDetail?.name;
      if (hit.cost_bearing_high_value) {
        hit.cost_bearing_high_value =
          typeof hit?.cost_bearing_high_value === "number"
            ? vf_currency(hit.cost_bearing_high_value)
            : hit.cost_bearing_high_value;
      }
      if (hit.cost_free_high_value) {
        hit.cost_free_high_value =
          typeof hit?.cost_free_high_value === "number"
            ? vf_currency(hit.cost_free_high_value)
            : hit.cost_free_high_value;
      }
      if (hit.qtr) {
        hit.qtr_calls = `${hit.qtr[0] ? hit.qtr[0] : ""} ${hit.qtr[1] ? hit.qtr[1] : ""
          } ${hit.qtr[2] ? hit.qtr[2] : ""} ${hit.qtr[3] ? hit.qtr[3] : ""}`;
      }
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
        const tags = hit.tags.map((tag) => tag.tag)
        if (tags[0]) {
          hit.tags = [[tags], hit.tags.length]
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

  const formatColumns = (headers, hits) => {
    let tenantName = window.sessionStorage.getItem("tenantName");
    if (customLayer.state !== "TX") {
      headers[19].options = { display: true, viewColumn: true };
    }
    if (tenantName === "Providence") {
      headers[14].options = { display: true, viewColumn: true };
      headers[15].options = { display: true, viewColumn: true };
      headers[16].options = { display: true, viewColumn: true };
    }
    return headers;
  };

  useEffect(() => {
    props.setTableMeta({
      filters: appliedFilters,
      extendSearchQuery: stateApp.activitySearchQuery,
      searchFields,
      TableHeader: copy(TableHeader(props.isSnapGrid)),
      esIndex,
      startPaginationAt,
      formatHits,
      formatColumns,
      defaultSort: { field: "_ts", order: "asc" },
      setAppliedFilters: props.filtersChange,
      initializeGenericData: {
        key: "contact._id",
        actions: genericDataActions,
      },
      isSelectedAllAllowed: true
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle]);

  useEffect(() => {
    if (clickedRow) {
      setSelectedOwner({
        ...clickedRow,
      });
      setOpenCustomDialog("addOwnerToParcel");
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

  const onBulkUpdateComplete = () => {
    setSelectedRows([]);
    setResetSelectedRow(!resetSelectedRow);
  };

  const deleteFunc = (idsToDelete) => {
    for (let i = 0; i < idsToDelete.length; i++) {
      updateParcelOwner({
        variables: {
          parcelOwner: { _id: idsToDelete[i], isDeleted: true },
        },
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
      });
    }
    setResetSelectedRow(!resetSelectedRow)
  };

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {openCustomDialog === "bulkUpdate" && (
        <AssignOwnerToContactDrawerContainer
          onClose={() => setOpenCustomDialog("")}
          rows={selectedRows}
          setRows={setSelectedRows}
          onBulkUpdateComplete={onBulkUpdateComplete}
        />
      )}
      {openCustomDialog === "exportOwnersAndContact" && (
        <ExportOwnersAndContacts
          onClose={() => setOpenCustomDialog("")}
          search={props.activeSearchRef.current}
          filters={[...props.initialFilters, ...appliedFilters]}
          total={props.options.count}
          isSelectAll={isSelectAll}
          rows={selectedRows}
          esIndex={esIndex}
          type="Tract"
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
      {openCustomDialog === "addOwnerToParcel" && (
        <AddParcelOwnerDialogContent
          onClose={() => {
            setSelectedOwner(null);
            setOpenCustomDialog("");
          }}
          customLayerId={customLayer._id}
          customLayer={customLayer}
          selectedRow={selectedOwner}
          setSelectedRow={setSelectedOwner}
        />
      )}
      {openCustomDialog === "deleteOwner" && (
        <DeleteConfirmationDialogContent
          header="Delete Tract Owner(s)"
          onClose={() => setOpenCustomDialog("")}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map(
            (sR) => props.rows[sR.dataIndex]?._id
          )}
          setM1nSelectedRowsIndexes={props.setSelectedRows}
        >
          {`Do you want to permanently delete the tract owner${props.selectedRows &&
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
        options={{
          ...props.options,
          customToolbar: () => {
            const options = [
              {
                text: "+ ADD INTEREST OWNER",
                isShow: false,
                action: () => setOpenCustomDialog("addOwnerToParcel"),
              },
              {
                text: "Import Interest Owners",
                isShow: true,
                action: () => {
                  setStateNav((stateNav) => ({
                    ...stateNav,
                    bulkUploadFromMap: true,
                    bulkUploadParcel: stateApp.selectedParcel,
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
                    onClick={() => {
                      let owners = [];

                      const rows = props.selectedRowsValues || props.rows;
                      for (let i in props.selectedRows) {
                        owners.push({
                          ...rows[i],
                        });
                      }
                      setSelectedRows(owners);
                      setOpenCustomDialog("exportOwnersAndContact");
                    }}
                  >
                    Export
                  </Button>
                  <FeatureFlag feature={FEATURES.IDICORE}>
                    <Button
                      color="secondary"
                      startIcon={<RequestPageIcon color="white" />}
                      className={classes.multiSelectionTopBarButtons}
                      disabled={props.selectedRows.length < 1}
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
                </div>
              </div>
            );
          }
        }}
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
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(
  TableESHOC(TractInterestOwnerTable),
  deepEqualObjects
);
