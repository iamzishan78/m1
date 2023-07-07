import React, { useEffect, useMemo } from "react";
// context

import { Container, Dialog } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "../TableESHOC";

// QUERIES 
import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_SHAPE_OWNERS } from "graphQL/useMutationUpdateShapeOwners";
import AddAgreementOwnerAndTractDialog from "components/Shared/M1nTable/components/SubComponents/AddAgreementOwnerAndTractDialog";

import { deepEqualObjects, copy } from "components/Shared/functions";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";

// Header Schemas 
import getTableHeader from 'components/Table/constants/unit-owners-tracts-header-schema.js'

// Utilities
import { usetableStyles } from "../Styles";
import _ from "lodash";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";

function ESTableComponent(props) {
  const classes = usetableStyles();

  const [updateShapeOwners] = useMutation(UPDATE_SHAPE_OWNERS, {
    onCompleted: () => {
      props.setLoading(false);
      props.setSelectedRows([])
    },

    onError: (err) => { },
    refetchQueries: ["getESPaginatedList", "getESSimpleSearch", "getESFilterList"], awaitRefetchQueries: true
  });

  const formatHits = (hits) => {
    return hits.map((hit) => {
      const isTX = hit.state === "TX"
      hit.SurveyMeridian = isTX ? hit.survey : hit.meridian
      hit.BlockTownship = isTX ? hit.block : hit.township
      hit.SectionRange = isTX ? hit.section : hit.range
      hit.AbstractSection = isTX ? hit.abstract : hit.section
      return hit;
    });
  };

  const layerType = useMemo(() => {
    let layerType = _.upperFirst(props.customLayer.layer)
    layerType = layerType === 'Surface' ? 'Surface/ROW' : layerType
    return layerType
  }, [props.customLayer.layer])

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

    return interestMetaData.mapping.reduce((acc, val) => ({ ...acc, [val.from]: val.to }), {})
  }, [metaDataRes])

  useEffect(() => {
    if (props.customLayer?._id && interestMapping && layerType)
      props.setTableMeta({
        shapeType: props.shapeType,
        addableName: "Tract",
        extendSearchQuery: `shape._id:${props.customLayer._id}`,
        TableHeader: copy(getTableHeader({ layerType, interestMapping })),
        esIndex: 'shapeowners_flat',
        startPaginationAt: 25,
        formatHits,
        // formatColumns,
      })
  }, [props.customLayer, interestMapping, layerType]);

  const formatColumns = (headers, hits) => {
    // const isStateTx = !!hits.find((hit) => hit.state === 'TX')
    // if (isStateTx) {
    //   headers.forEach((header) => {
    //     if (header.name === 'meridian') { header.name = 'survey'; header.label = 'Survey'; header.esKey = 'tract.survey.keyword' }
    //     else if (header.name === 'township') { header.name = 'block'; header.label = 'Block'; header.esKey = 'tract.block.keyword' }
    //     else if (header.name === 'section') { header.name = 'abstract'; header.label = 'Abstract'; header.esKey = 'tract.abstract.keyword' }
    //     else if (header.name === 'range') { header.name = 'section'; header.label = 'Section'; header.esKey = 'tract.section.keyword' }
    //   })
    // }
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
        layerType={props.customLayer.layer}
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
            m1nSelectedRowsIds={props.selectedRows.map((sR => props.rows[sR.dataIndex]?._id))}
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
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(ESTableComponent), deepEqualObjects);