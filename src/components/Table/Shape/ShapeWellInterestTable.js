import React, { useEffect } from "react";
// context

import { Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES 
import { useMutation } from "@apollo/client";

import { deepEqualObjects, copy } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas 
import TableHeader from 'components/Table/constants/unitperwell-header-schema.js'

// Utilities
import { usetableStyles } from "../Styles";
import AddUnitInterestDialog from "components/Shared/M1nTable/components/SubComponents/AddUnitWellInterestDialog";
import { UPDATE_SHAPE_WELL_INTEREST } from "graphQL/useMutationUpdateShapeWellInterest";


function ShapeWellInterestTable(props) {
  const classes = usetableStyles();

  const [updateShapeWellInterests] = useMutation(UPDATE_SHAPE_WELL_INTEREST, {
    onCompleted: () => {
      props.setLoading(false);
    },
    refetchQueries: ["getESPaginatedList", "getESFilterList"], awaitRefetchQueries: true
  });

  useEffect(() => {
    props.setTableMeta({
      initializeGenericData: { actions: ['comments', 'tags'], key: '_id' },
      shapeType: props.shapeType,
      addableName: "Well",
      extendSearchQuery: `shape._id:${props.customLayer._id}`,
      TableHeader: copy(TableHeader),
      esIndex: 'shapewellinterests_flat',
      startPaginationAt: 25,
      formatHits
    })
  }, []);

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = props.setGenricData(hit, hit._id, ['comments', 'tracks', 'tags']);
      hit.globalWell = hit?.well?.globalWell
      return hit;
    });
    return hits
  }

  const deleteFunc = (ids) => {
    props.setLoading(true);
    updateShapeWellInterests({
      variables: {
        wellInterests: ids.map((id) => ({
          id,
          isDeleted: true
        })),
      },
      refetchQueries: [
        "getESPaginatedList", "getESFilterList"
      ],
      awaitRefetchQueries: true,
    });
  }


  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >


      {props.addToTable && <AddUnitInterestDialog
        open={props.addToTable}
        width="450px"
        shapeId={props.customLayer._id}
        shapeType={props.shapeType}
        wellInterest={props.clickedRow}
        onClose={() =>
          props.setAddToTable(false)
        }
      />}

      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {
          props.openDialog === "delete" && <DeleteConfirmationDialogContent
            header={`Delete Well(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR => props.rows[sR.dataIndex]._id))}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected well${props.selectedRows &&
              props.selectedRows.length > 1 &&
              props.selectedRows.length > 1
              ? "s"
              : ""
              } from  this ${props.shapeType}?`}
          </DeleteConfirmationDialogContent>
        }
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
        options={props.options}
        parent={props.parent}
        setColumnsBase={[]}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(ShapeWellInterestTable), deepEqualObjects);