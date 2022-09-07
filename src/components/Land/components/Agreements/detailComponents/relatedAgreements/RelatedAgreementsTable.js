import React, { useEffect } from "react";
import DeleteIcon from "@material-ui/icons/Delete";

// context
import { Container, Dialog, Button, IconButton, Tooltip } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES
import { useMutation } from "@apollo/client";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";

import { deepEqualObjects } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas
import TableHeader from "components/Table/constants/agreements-header-schema";

// Utilities
import { usetableStyles } from "./style";

function AgreementOwnersTractsTable(props) {
  const classes = usetableStyles();

  const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
    onCompleted: () => {
      props.setLoading(false);
      props.setSelectedRows([]);
    },
    onError: (err) => {},
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
    awaitRefetchQueries: true,
  });

  const options = {
    ...props.options,
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
          <Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={() => props.setNewAgmtState(true)}>
            + ADD RELATED AGMT
          </Button>
        </div>
      );
    },
    customToolbarSelect: ({ data }) => {
      return (
        <div style={{ height: "48px", display: "flex" }}>
          <div style={{ marginTop: "6px", height: "35px", display: "flex" }}>
            <Tooltip title={"Delete"}>
              <IconButton
                size="medium"
                style={{ margin: "0 5px" }}
                aria-label="delete"
                onClick={(e) => {
                  //   setOpenDialog("delete");
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      );
    },
  };

  const formatHits = (hits) => {
    return hits.map((hit) => {
      if (hit?.tract?.tractName) hit.tractName = hit?.tract?.tractName;
      const isTX = hit.state === "TX";
      hit.SurveyMeridian = isTX ? hit.survey : hit.meridian;
      hit.BlockTownship = isTX ? hit.block : hit.township;
      hit.SectionRange = isTX ? hit.section : hit.range;
      hit.AbstractSection = isTX ? hit.abstract : hit.section;
      return hit;
    });
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      updateShapeOwners({
        variables: {
          shapeOwners: ids.map((_id) => ({ _id, isDeleted: true })),
        },
        refetchQueries: ["getCustomLayer"],
        awaitRefetchQueries: true,
      });
    }
  };

  useEffect(() => {
    if (props.customLayer?._id)
      props.setTableMeta({
        shapeType: props.shapeType,
        addableName: "Tract",
        searchFields: ["contact.entityDetail.name", "_all"],
        filters: [{ field: "relatedAgreements._id", value: props.customLayer._id }],
        TableHeader: TableHeader(true),
        esIndex: "shapes_flat",
        startPaginationAt: 25,
        formatHits,
      });
  }, [props.customLayer]);

  useEffect(() => {
    if (props.setTractsNumber) props.setTractsNumber(props.rows.length);
    if (props.setRecord) props.setRecord(props.rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows]);

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Tract(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected tract${
              props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
            } from  this ${props.shapeType}?`}
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
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={options}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(AgreementOwnersTractsTable), deepEqualObjects);
