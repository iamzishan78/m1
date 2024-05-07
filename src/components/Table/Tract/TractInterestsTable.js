import React, { useEffect, useContext, useState } from "react";
import { useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { Container, Dialog } from "@material-ui/core";
import { AppContext } from "AppContext";
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/tract-interests-header-schema";
import TableESHOC from "components/Table/TableESHOC";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { deepEqualObjects, copy, esExtentedSearch } from "components/Shared/functions";
import { REMOVE_TRACT_INTERESTS } from "graphQL/useMutationRemoveTractInterests";
import { useMutation } from "@apollo/client";
import { usetableStyles } from "../Styles";

const genericDataActions = ['tags', 'comments', 'tracks']
function TractInterestTable(props) {
  const classes = usetableStyles();
  const [stateApp] = useContext(AppContext);
  const [resetSelectedRow, setResetSelectedRow] = useState(false);

  const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
  const GridViewModule = userGridViewSettings?.TractInterest
  const defaultView = {
    name: `All Tracts Interests`,
    type: "Default",
  };

  const [removeTractInterests] = useMutation(REMOVE_TRACT_INTERESTS, {
    refetchQueries: ["getESSimpleSearch"],
    awaitRefetchQueries: true,
  });

  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
      return hit;
    });
    return hits
  }

  const deleteFunc = (ids) => {
    if (ids.length > 0) {
      props.setLoading(true);
      removeTractInterests({
        variables: {
          descriptorIds: ids,
        },
      }).then(() => {
        props.setLoading(false);
        setResetSelectedRow(!resetSelectedRow);
      });
    }
  };

  useEffect(() => {
    props.setSelectedGridView(GridViewModule || defaultView);
  }, [GridViewModule]);

  useEffect(() => {
    props.setESFilters(props.selectedGridView?.filters || []);
  }, [props.selectedGridView]);

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: esExtentedSearch(props.landSearchQuery, searchInput),
      searchFields: [
        "contact._id",
        "shape.shapeJson.properties.shapeLabel",
        "shape.shapeJson.properties.originalProperties.0?.State?.StateAbbreviation?",
        "shape.shapeJson.properties.originalProperties.0?.County",
        "shape.shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?",
        "shape.shapeJson.properties.originalProperties.0?.Block?.Township?",
        "shape.shapeJson.properties.originalProperties.0?.Section?.Range?",
        "shape.shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?",
        "qtr",
        "shape.shapeJson.properties.sdGrossAcres",
        "depthFrom",
        "depthTo",
        "contact.entityDetail.name",
        "mineral_interest",
        "royalty_interest",
        "orri",
        "net_acres",
        "nra",
        "shape.shapeJson.properties.department",
        "comments.comment",
      ],
      TableHeader: copy(TableHeader),
      esIndex: "shapeowners_flat",
      selectedGridView: GridViewModule || defaultView,
      typeKeyword: { gridViewCategory: "TractInterest" },
      startPaginationAt: 50,
      filters: [
        {
          field: "shape.layer.keyword",
          value: "parcel",
        },
      ],

      defaultSort: { field: '_ts', order: 'desc' },
      downloadAll: props.parent === "TractInterestsTable" ? { exportPx: '121px' } : undefined,
      polygon: stateApp?.currentFeature?.geometry && {
        type: "geo_intersects",
        field: "geoJSON",
        value: stateApp?.currentFeature?.geometry
      },
      formatHits,
    });
    // eslint-disable-next-line
  }, [searchInput, props.landSearchQuery, userGridViewSettings]);

  useEffect(() => {
    props?.onTractCount && props?.onTractCount(props?.options?.count || 0);
  }, [props?.options?.count])

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Tract Interest(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected Tract Interest${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
        addAble={{ type: "TractInterests" }}
        loading={props.loading}
        targetLabel={props.targetLabel}
        uploadIcon={null}
        dense={props.dense ? props.dense : undefined}
        orderByTracks={false}
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        resetSelectedRow={resetSelectedRow}
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
        {...props.esHocProps}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(TractInterestTable), deepEqualObjects);
