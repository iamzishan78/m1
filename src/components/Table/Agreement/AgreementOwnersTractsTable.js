import React, { useEffect } from "react";
// context

import { Container, Dialog, } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES 
import { useMutation } from "@apollo/client";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";

import { deepEqualObjects } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas 
import TableHeader from 'components/Table/constants/unit-owners-tracts-header-schema.js'

// Utilities
import { usetableStyles } from "../Styles";
import AddAgreementOwnerAndTractDialog from "components/Table/TableAddDialog/AddAgreementOwnerAndTractDialog";

function AgreementOwnersTractsTable(props) {
  const classes = usetableStyles();

  const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
    onCompleted: () => {
      props.setLoading(false);
      props.setSelectedRows([])
    },

    onError: (err) => { },
    refetchQueries: ["getESPaginatedList", "getESFilterList"], awaitRefetchQueries: true
  });

  const formatColumns = (headers, hits) => {
    const isStateTx = !!hits.find((hit) => hit.state === 'TX')
    if (isStateTx) {
      headers[4] = { ...headers[4], name: 'survey', label: 'Survey', esKey: 'tract.survey.keyword' }
      headers[5] = { ...headers[5], name: 'block', label: 'Block', esKey: 'tract.block.keyword' }
      headers[6] = { ...headers[6], name: 'abstract', label: 'Abstract', esKey: 'tract.abstract.keyword' }
      headers[7] = { ...headers[7], name: 'section', label: 'Section', esKey: 'tract.section.keyword' }
    }
    return headers
  }

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      updateShapeOwners({
        variables: {
          shapeOwners: ids.map((_id) => ({ _id, isDeleted: true })),
        }
      });
    }
  }

  useEffect(() => {
    props.setTableMeta({
      shapeType: props.shapeType,
      addableName: "Tract",
      searchFields: ["contact.entityDetail.name", "_all"],
      filters: [{ field: "shape._id", value: props.customLayer._id }],
      TableHeader: TableHeader,
      esIndex: 'shapeowners_flat',
      startPaginationAt: 25,

      formatColumns,
    })
  }, []);

  useEffect(() => {
    if (props.setTractsNumber) props.setTractsNumber(props.rows.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows]);

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >

      {props.addToTable && <AddAgreementOwnerAndTractDialog
        open={props.addToTable}
        width="450px"
        shapeId={props.customLayer._id}
        shapeType={props.shapeType}
        seletedOwner={props.clickedRow}
        onClose={() =>
          props.setAddToTable(false)
        }
      />}

      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {
          props.openDialog === "delete" && <DeleteConfirmationDialogContent
            header={`Delete Tract(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR => props.rows[sR.dataIndex]._id))}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected tract${props.selectedRows &&
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

export default React.memo(TableESHOC(AgreementOwnersTractsTable), deepEqualObjects);