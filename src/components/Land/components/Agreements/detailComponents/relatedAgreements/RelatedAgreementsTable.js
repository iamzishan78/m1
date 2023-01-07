import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "@apollo/client";

// context
import { Container, Dialog, Button, IconButton, Tooltip } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES
import { DELETE_RELATED_AGREEMENTS } from "graphQL/useMutationsRelatedAgreement";

import { deepEqualObjects } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas
import TableHeader from "components/Table/constants/related-agreements-header-schema";

// Utilities
import { usetableStyles } from "./style";
import convert_date from "components/Shared/valueformatters/convert_date";
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";
import { get } from "lodash";
import AddNewRelatedAgreementDialog from "./AddNewRelatedAgreementDialog";

function AgreementOwnersTractsTable(props) {
  const classes = usetableStyles();
  const [isDeletePopup, setDeletePopup] = useState(false);
  const [selectedRow, selectRow] = useState([]);
  const { moduleId } = props;

  const [deleteRelatedAgreements] = useMutation(DELETE_RELATED_AGREEMENTS);

  const options = {
    ...props.options,
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
          <Button
            id="addRelatedAgreementBtn"
            color="secondary"
            className={classes.multiSelectionTopBarButtons}
            onClick={() => {
              if (props.setDrawer) props.setDrawer("agrmt");
            }}
          >
            + ADD RELATED AGMT
          </Button>
        </div>
      );
    },
    onRowClick: (rowData, { dataIndex, rowIndex }) => {
      props.setDrawer("agrmt-existing");
      selectRow({ ...props.rows[dataIndex] });
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
  };

  const formatHits = (hits) => {
    return hits.map((hit) => {
      if (hit?.tract?.tractName) hit.tractName = hit?.tract?.tractName;
      const isTX = hit.state === "TX";
      hit.SurveyMeridian = isTX ? hit.survey : hit.meridian;
      hit.BlockTownship = isTX ? hit.block : hit.township;
      hit.SectionRange = isTX ? hit.section : hit.range;
      hit.AbstractSection = isTX ? hit.abstract : hit.section;
      hit.agreementDate = hit.agreementDate ? convert_date(hit.agreementDate) : null;
      hit.effectiveDate = hit.effectiveDate ? convert_date(hit.effectiveDate) : null;
      hit.expirationDate = hit.expirationDate ? convert_date(hit.expirationDate) : null;
      hit.extensionDate = hit.extensionDate ? convert_date(hit.extensionDate) : null;
      hit.agreementType = agreementTypes.find((type) => type.value === hit.agreementType || type.label === hit.agreementType)?.label;
      return hit;
    });
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      deleteRelatedAgreements({
        variables: {
          currentAgreementId: moduleId,
          agreementIds: ids,
        },
        refetchQueries: ["getESSimpleSearch"],
        awaitRefetchQueries: true,
      });
    }
  };

  useEffect(() => {
    if (moduleId)
      props.setTableMeta({
        shapeType: props.shapeType,
        addableName: "Tract",
        searchFields: ["contact.entityDetail.name", "_all"],
        filters: [{ field: "relatedAgreements._id", value: moduleId }],
        TableHeader: TableHeader,
        esIndex: "shapes_flat",
        startPaginationAt: 25,
        formatHits,
      });
  }, [moduleId]);

  useEffect(() => {
    if (props.setCounter) props.setCounter(props.rows.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows]);

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={isDeletePopup} onClose={() => setDeletePopup(false)} fullWidth={true} maxWidth={"sm"}>
        <DeleteConfirmationDialogContent
          header={`Delete Related Agreement(s)`}
          onClose={() => setDeletePopup(false)}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
          setM1nSelectedRowsIndexes={props.setSelectedRows}
        >
          {`Do you want to delete the selected related agreement${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
            }?`}
        </DeleteConfirmationDialogContent>
      </Dialog>

      {props.drawer === "agrmt-existing" && (
        ReactDOM.createPortal(
          <AddNewRelatedAgreementDialog
            customLayerId={get(props, "customLayer._id")}
            relatedAgreement={selectedRow}
            setDrawer={props.setDrawer}
            parentType="Agreement"
            portal={props.portal}
          />,
          document.querySelector(props.portal))
      )}

      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header ?? "Related Agreements"}
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
