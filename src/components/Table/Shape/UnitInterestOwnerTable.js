import React, { useContext, useEffect, useState } from "react";

import { useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Container, Button, Tooltip, IconButton } from "@material-ui/core";
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

import TableHeader from "components/Table/constants/ownersperunit-header-schema";
import { UPDATEPARCELOWNER } from "graphQL/useMutationUpdateParcelOwner";
import { deepEqualObjects, copy } from "components/Shared/functions";
import { addTrailingZeros } from "components/Shared/functions";
import { usetableStyles } from "../Styles";

const genericDataActions = ["tags", "comments", "tracks", "ifAreContacts"];
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
  const [stateApp,] = useContext(AppContext);
  const [stateNav, setStateNav] = useContext(NavigationContext);
  const { customLayer, esIndex, clickedRow } = props;

  const [openCustomDialog, setOpenCustomDialog] = useState("");
  const [selectedOwner, setSelectedOwner] = useState(null);

  const [updateParcelOwner] = useMutation(UPDATEPARCELOWNER);

  const searchFields = ["contact.entityDetail.name", "_all"];
  const appliedFilters = [
    { field: "shape._id", value: customLayer._id },
    { field: "contact.IsDeleted", value: "false" },
  ];

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.isPurchased = hit?.contact?.isPurchased;
      hit.contactStatus = hit?.contact?.contactStatus;
      Object.keys(hit).forEach((key) => {
        if (interestKeys.includes(key)) {
          if (typeof hit[key] === "number")
            hit[key] = addTrailingZeros(hit[key]);
          else if (hit[key]?.["$numberDecimal"]) {
            hit[key] = addTrailingZeros(Number(hit[key]["$numberDecimal"]));
          }
        }
      });
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle]);

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
      selectedRows.push({
        ...props.rows[props.selectedRows[i].index],
        _id: props.rows[props.selectedRows[i].index].contactId,
      });
    }
    return selectedRows;
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
              startIcon={<CloudDownloadIcon color="white" />}
              className={classes.multiSelectionTopBarButtons}
              onClick={() => {
                let owners = [];
                for (let i in props.selectedRows) {
                  owners.push(
                    props.rows[props.selectedRows[i].dataIndex]
                  );
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

  }

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {openCustomDialog === "exportOwnersAndContact" && (
        <ExportOwnersAndContacts
          onClose={() => setOpenCustomDialog("")}
          search={props.activeSearchRef.current}
          filters={[...props.initialFilters, ...appliedFilters]}
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
          shapeType={props.shapeType}
          selectedRow={selectedOwner}
          onClose={() => {
            setSelectedOwner(null);
            setOpenCustomDialog("");
          }}
        />
      )}
      {openCustomDialog === "deleteOwner" && (
        <DeleteConfirmationDialogContent
          header="Delete Tract Owner(s)"
          onClose={() => setOpenCustomDialog("")}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map(
            (sR) => props.rows[sR.dataIndex]._id
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
          ...customOptions
        }}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(UnitInterestOwnerTable), deepEqualObjects);
