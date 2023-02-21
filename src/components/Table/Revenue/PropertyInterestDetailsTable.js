import React, { useEffect } from "react";
import moment from "moment";
// context
import { Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import { useMutation } from "@apollo/client";

import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/property-interest-details-header-schema";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Utilities
import { usetableStyles } from "../Styles";
import { UPDATE_PROPERTY_INTEREST } from "graphQL/useMutationUpdatepropertyInterest";

function PropertyInterestDetailsTable(props) {
  const classes = usetableStyles();
  const [updatePropertyInterest] = useMutation(UPDATE_PROPERTY_INTEREST, {
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
  });

  const formatHits = (hits) => {
    return hits.map((hit) => {
      hit.effectiveDate = hit.effectiveDate ? moment(hit.effectiveDate).format("MM/DD/YYYY") : null;
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
  };

  useEffect(() => {
    props.setTableMeta({
      addableName: "Property Interest",
      addBtnText: "INTEREST",
      searchFields: ["owner.entityDetail.name", "_all"],
      filters: [{ field: "property._id", value: props.propertyId }],
      TableHeader: copy(TableHeader),
      esIndex: "propertyinterest_flat",
      startPaginationAt: 10,
      formatHits,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.addToTable) {
      if (props.addToTable === 'add') {
        props.setSelectedInterest(null);
      }
      props.onClickAdd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.addToTable]);

  useEffect(() => {
    if (props.clickedRow) {
      props.setSelectedInterest(props.clickedRow);
      props.setAddToTable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clickedRow]);

  useEffect(() => {
    if (!props.showInterestDetails) {
      props.setAddToTable('');
      props.setSelectedInterest(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.showInterestDetails]);

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      for (let i = 0; i < ids.length; i++) {
        updatePropertyInterest({
          variables: {
            propertyInterest: {
              _id: ids[i],
              isDeleted: true
            },
          },
        });
      }
    }
  }

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Dialog
        open={props.openDialog ? true : false}
        onClose={() => props.setOpenDialog(null)}
        fullWidth={true}
        maxWidth={"sm"}
      >
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Interest(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map(
              (sR) => props.rows[sR.dataIndex]._id
            )}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected interest${props.selectedRows &&
              props.selectedRows.length > 1 &&
              props.selectedRows.length > 1
              ? "s"
              : ""
              }?`}
          </DeleteConfirmationDialogContent>
        )}
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
        startPaginationAt={10}
        onTableChange={props.onTableChange}
        options={props.options}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(
  TableESHOC(PropertyInterestDetailsTable),
  deepEqualObjects
);
