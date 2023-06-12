import React, { useContext, useEffect, useState } from "react";
import get from "lodash/get";
// context
import { Container, Dialog, IconButton, ButtonGroup, Button, Tooltip } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import { useMutation, useApolloClient } from "@apollo/client";
import { useDispatch } from "react-redux";
import DeleteIcon from "@material-ui/icons/Delete";

import { AppContext } from "AppContext";
import { deepEqualObjects, copy } from "components/Shared/functions";
// Header Schemas
import TableHeader from "components/Table/constants/related-contact-header-schema";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Utilities
import { usetableStyles } from "../Styles";
import { activityTypes } from "utils/data";
import { getRangeFilters } from "utils/helper";
import Chip from '@material-ui/core/Chip';
import { TableFilterList } from "mui-datatables";
import AddRelatedContactModal from "components/ContactDetailCard/components/AddRelatedContactModal";
import { DELETE_RELATED_CONTACT } from "graphQL/useMutationRelatedContact";

export const getFilters = (appliedFilters) => {
  let filters = [];
  if (appliedFilters) {
    let range = [];
    range = getRangeFilters(
      {
        dateTime: {
          from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
          to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
        },
      },
      "simple"
    );
    if (range.length > 0) filters = [...filters, ...range];
    range = getRangeFilters(
      {
        endDateTime: {
          from: appliedFilters.fromDate ? new Date(appliedFilters.fromDate).toISOString() : null,
          to: appliedFilters.toDate ? new Date(appliedFilters.toDate).toISOString() : null,
        },
      },
      "simple"
    );
    if (range.length > 0) filters = [...filters, ...range];
    if (appliedFilters.campaignName) {
      filters.push({
        field: "contact.campaignName.keyword",
        value: appliedFilters.campaignName,
      });
    }
    if (appliedFilters.qualifier) {
      filters.push({
        field: "ownerName.keyword",
        value: appliedFilters.qualifier,
      });
    }
    if (!filters.length && appliedFilters.length) filters = appliedFilters;
  }
  return filters;
};


const CustomChip = ({ label, onDelete }) => {
  if (["Expiration", "Option to Extend"].includes(label))
    return null
  return (
    <Chip
      label={label}
      onDelete={onDelete}
    />
  );
};

const CustomFilterList = (props) => {
  return <TableFilterList {...props} ItemComponent={CustomChip} />;
};

function RelatedContactsTable(props) {
  const classes = usetableStyles();
  const [isDeletePopup, setDeletePopup] = useState(false);
  const [selectedRow, selectRow] = useState([]);
  const [stateApp, setStateApp] = useContext(AppContext);
  const { clickedRow, applyCustomClasses } = props;
  const [resetSelectedRow, setResetSelectedRow] = useState(false);

  const [deleteRelatedContacts] = useMutation(DELETE_RELATED_CONTACT);

  useEffect(() => {
    props.setTableMeta({
      filters: [
        ...getFilters([{ field: "relatedContacts.relatedObject", value: props.contactId }]),
      ],
      searchFields: [
        "name",
        "mobilePhone",
        "homePhone",
        "address1",
        "relatedContacts.relationshipType",
      ],
      TableHeader: copy(TableHeader),
      esIndex: "contacts_flat",
      startPaginationAt: 25,
      defaultSort: { field: "lastUpdateAt", order: "desc" },
      setAppliedFilters: props.filtersChange,
      formatHits
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateApp.activitySearchQuery, props.filterToggle, props.activityFilterByType, props.activityFilterByTime, props.activityFilterByOwner]);

  useEffect(() => {
    if (clickedRow) {
      const activity = {
        ...clickedRow,
        type: get(
          activityTypes.find((type) => type.label === clickedRow.type),
          "value",
          ""
        ),
      };

      setStateApp(() => ({ ...stateApp, selectedActivity: activity }));
      onModalOpen(props.dialogType);
    }
  }, [clickedRow]);

  const formatHits = (hits) => {
    return hits.map((hit) => {
      const relationshipType = hit.relatedContacts.find(rc => rc.relatedObject == props.contactId);
      if (relationshipType) {
        hit.relationshipType = relationshipType.relationshipType;
      }
      return hit;
    });
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      //write delete logic here
      deleteRelatedContacts({
        variables: {
          descriptorObjects: ids,
          relatedObject: props.contactId
        },
        refetchQueries: ["getESSimpleSearch", "getContactSummary"],
        awaitRefetchQueries: true,
      }).then(() => {
        props.setLoading(false);
        setResetSelectedRow(!resetSelectedRow);
      });
    }
  };

  const onModalOpen = () => {

  };

  console.log("!!!!!!!!! selectedRow !!!!!!!", selectedRow);

  return (
    <Container
      maxWidth={false}
      className={`${classes.container} ${!applyCustomClasses && classes.subComponentsClasses}`}
      id={props.id ? props.id : props.parent || "RelatedContactsTable"}
    >
      <Dialog open={isDeletePopup} onClose={() => setDeletePopup(false)} fullWidth={true} maxWidth={"sm"}>
        <DeleteConfirmationDialogContent
          header={`Delete Related Contacts(s)`}
          onClose={() => setDeletePopup(false)}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
          setM1nSelectedRowsIndexes={props.setSelectedRows}
        >
          {`Do you want to delete the selected related agreement${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
            }?`}
        </DeleteConfirmationDialogContent>
      </Dialog>

      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={props.columns}
        rows={props.rows}
        total={false}
        loading={props.loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        resetSelectedRow={resetSelectedRow}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={{
          ...props.options,
          onRowClick: (rowData, { dataIndex, rowIndex }) => {
            props.setDrawer("agrmt-existing");
            selectRow({ ...props.rows[dataIndex] });
          },
          customToolbar: () => {
            return (
              <div
                style={{
                  display: "inline",
                  float: "left",
                }}
              >

                <ButtonGroup variant="contained" style={{ height: "40px", margin: "4px" }} color="primary" aria-label="split button">
                  <Button
                    id="addRelatedContactBtn"
                    color="primary"
                    size="small"
                    onClick={() => setStateApp({ ...stateApp, addRelatedContactDialog: true })}
                  >
                    + ADD RELATED CONTACT
                  </Button>
                </ButtonGroup>
              </div>
            );
          },
          customToolbarSelect: ({ data }) => {
            return (
              <div style={{ height: "48px", display: "flex" }}>
                <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
                  <Tooltip title={"Delete"}>
                    <IconButton
                      id="deleteAgreementIcon"
                      size="medium"
                      style={{ margin: "0 5px" }}
                      aria-label="delete"
                      onClick={(e) => {
                        setDeletePopup("delete");
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            );
          },
        }}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
        component={{
          TableFilterList: CustomFilterList,
        }}

      />
      <AddRelatedContactModal width={"700px"} relatedObject={props.contactId} />
    </Container>
  );
}

export default React.memo(TableESHOC(RelatedContactsTable), deepEqualObjects);
