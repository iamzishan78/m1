import React, { useEffect, useState } from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import { useMutation } from "@apollo/client";
import { useSelector } from "react-redux";

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

function AgreementOwnersTractsTable(props) {
  const classes = usetableStyles();
  const [isDeletePopup, setDeletePopup] = useState(false);
  const customLayerId = useSelector(({ Land }) => Land.agreement?.activeAgreement)?._id;

  const [deleteRelatedAgreements] = useMutation(DELETE_RELATED_AGREEMENTS);

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
      return hit;
    });
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      deleteRelatedAgreements({
        variables: {
          currentAgreementId: customLayerId,
          agreementIds: ids,
        },
        refetchQueries: ["getESSimpleSearch"],
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
        TableHeader: TableHeader,
        esIndex: "shapes_flat",
        startPaginationAt: 25,
        formatHits,
      });
  }, [props.customLayer]);

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={isDeletePopup} onClose={() => setDeletePopup(false)} fullWidth={true} maxWidth={"sm"}>
        <DeleteConfirmationDialogContent
          header={`Delete Related Agreement(s)`}
          onClose={() => setDeletePopup(false)}
          deleteFunc={deleteFunc}
          m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]._id)}
          setM1nSelectedRowsIndexes={props.setSelectedRows}
        >
          {`Do you want to delete the selected related agreement${
            props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
