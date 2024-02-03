import React, { useContext, useEffect, useMemo, useState } from "react";
// context

import { Button, Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";

// QUERIES
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";

import { deepEqualObjects } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas
import getTableHeader from "components/Table/constants/unit-owners-tracts-header-schema.js";

// Utilities
import { usetableStyles } from "../Styles";
import AddAgreementOwnerAndTractDialog from "components/Table/TableAddDialog/AddAgreementOwnerAndTractDialog";
import { DrawerContext } from "components/Land/components/Agreements/detailComponents/DrawerContext";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import _ from "lodash";

function AgreementOwnersTractsTable(props) {
  const classes = usetableStyles();
  const [drawerContainer, setDrawerContainer] = useState(null);
  const [selectredTract, setSelectredTract] = useState(props.clickedRow);
  const [resetSelectedRow, setResetSelectedRow] = useState(false);

  useEffect(() => {
    setSelectredTract(props.clickedRow)
  }, [props.clickedRow])


  const [drawer, setDrawer] = useContext(DrawerContext);
  useEffect(() => {
    if (props.portal) {
      const ele = document.querySelector(props.portal);

      if (ele) {
        setDrawerContainer(ele);
      }
    }
  }, [props.portal])

  const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
    onCompleted: () => {
      props.setLoading(false);
      props.setSelectedRows([]);
      setResetSelectedRow(!resetSelectedRow)
    },
    onError: (err) => { },
  });

  const formatHits = (hits) => {
    return hits.map((hit) => {
      if (hit?.tract?.tractName || hit?.tract?.name) hit.tractName = hit?.tract?.name || hit?.tract?.tractName;
      const isTX = hit.state === "TX"
      hit.name = hit?.contact?.entityDetail?.name
      hit.SurveyMeridian = isTX ? hit.survey : hit.meridian
      hit.BlockTownship = isTX ? hit.block : hit.township
      hit.SectionRange = isTX ? hit.section : hit.range
      hit.AbstractSection = isTX ? hit.abstract : hit.section
      hit.department = _.get(hit, 'tract.department')
      return hit;
    });
  };

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      updateShapeOwners({
        variables: {
          shapeType: 'Agreement',
          shapeOwners: ids.map((_id, i) => ({
            _id, isDeleted: true,
            shapeId: props.customLayer?._id,
            relatedObject: props.rows.find(r => r._id === ids[i])?.contact?._id,
            tract: { ...props.rows.find(r => r._id === ids[i])?.tract, isDeleted: true }
          })),
        },
        refetchQueries: ["getCustomLayer", "getESPaginatedList", "getESSimpleSearch", "getESFilterList"],
        awaitRefetchQueries: true
      });
    }
  };

  const layerType = useMemo(() => {
    let layerType = _.upperFirst(props?.customLayer?.layer)
    layerType = layerType === 'Surface' ? 'Surface/ROW' : layerType
    return layerType
  }, [props?.customLayer?.layer])

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

  useEffect(() => {
    getMetaData({
      variables: {
        category: "Agreement",
      },
    });
  }, [getMetaData])

  const interestMapping = useMemo(() => {
    if (!metaDataRes) return

    const { metaData } = metaDataRes.getMetaData
    const interestMetaData = metaData.filter(data => data.esKey === 'custom_data.interest_type')[0]

    return interestMetaData?.mapping?.reduce((acc, val) => ({ ...acc, [val.from]: val.to }), {})
  }, [metaDataRes])

  useEffect(() => {
    if ((props.customLayer?._id && interestMapping && layerType) || props.isTestcase)
      props.setTableMeta({
        shapeType: props.shapeType,
        addableName: "Tract",
        searchFields: ["contact.entityDetail.name", "_all"],
        filters: [...(!props.isTestcase ? [{ field: "shape._id", value: props.customLayer._id }] : [])],
        TableHeader: getTableHeader({ interestMapping, layerType, isTestcase: props.isTestcase }),
        esIndex: "shapeowners_flat",
        startPaginationAt: 25,
        formatHits
      });
  }, [props.customLayer, interestMapping, layerType]);

  useEffect(() => {
    if (props.setTractsNumber) props.setTractsNumber(props.rows.length);
    if (props.setRecord) props.setRecord(props.rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.rows]);

  const tableOptions = {
    ...props.options,
    customToolbar: () => {
      return (
        <div style={{ display: "inline", float: "left", marginRight: "15px", marginTop: "5px" }}>
          <Button
            id="addTractToAgreementBtn"
            color="secondary"
            className={classes.multiSelectionTopBarButtons}
            onClick={() => {
              setDrawer("tract");
              setSelectredTract(null)
            }}
          >
            + ADD TRACT TO AGREEMENT
          </Button>
        </div>
      );
    },
  }

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      {drawer === "tract" && (
        <AddAgreementOwnerAndTractDialog
          open
          width="450px"
          shapeId={props.customLayer._id}
          layerType={props.customLayer.layer}
          shapeType={props.shapeType}
          seletedOwner={selectredTract}
          deleteFunc={deleteFunc}
          onClose={() => {
            setDrawer(null)
            setSelectredTract(null)
          }}
          drawerContainer={drawerContainer}
        />
      )}

      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Tract(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected tract${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
        resetSelectedRow={resetSelectedRow}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={tableOptions}
        parent={props.parent}
        setColumnsBase={[]}
        commentType={props.commentType}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(AgreementOwnersTractsTable), deepEqualObjects);
