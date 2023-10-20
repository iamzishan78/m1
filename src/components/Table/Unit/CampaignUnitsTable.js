import React, { useEffect } from "react";
import { Container, Dialog } from "@material-ui/core";
import { debounce, get } from "lodash";
import moment from "moment";

// context
import TableESHOC from "components/Table/TableESHOC";
import Table from "components/Shared/M1nTable/components/Table";

// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/campaign-units-header-schema.js";

// Utilities
import { usetableStyles } from "components/Table/Styles";
import DeleteConfirmationDialogContent from "components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent";
import { useMutation } from "@apollo/client";
import { REMOVE_CAMPAIGN_FROM_CUSTOMLAYER } from "graphQL/useMutationCampaign";

function MapGridUnitTable(props) {
  const classes = usetableStyles();

  const [removeCampaignFromCustomLayer] = useMutation(REMOVE_CAMPAIGN_FROM_CUSTOMLAYER);

  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit.coordinates = {
        objToPopulateSearchLayer: {
          objectType: props.targetLabel,
          objectId: hit.Id,
          objectName: hit.Operator,
        },
      };
      hit.ownersCount = get(hit, "interestSummary.unitInterestCount", "");
      hit.qualifier = get(hit, "qualifier.name", "");
      hit.lastUpdated = moment(hit._ts).format("MM/DD/YYYY");
      hit = props.setGenricData(hit, hit._id, [], []);
      hit.tags = hit?.tags?.length > 0 ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length] : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    setTableMeta({
      extendSearchQuery: null,
      // selectedGridView: GridViewModule || defaultView,
      searchFields: ["name^4", "_all"],
      TableHeader: copy(TableHeader),
      esIndex: "shapes_flat",
      startPaginationAt: 25,
      // typeKeyword: { gridViewCategory: "Units", metaModule: "Unit" },
      filters: [
        {
          field: "layer.keyword",
          value: "unit",
        },
        {
          field: "shapeJson.properties.campaignName.keyword",
          value: get(props.campaign, "name", ""),
        },
      ],
      defaultSort: { field: "_ts", order: "desc" },
      formatHits,
    });
    // eslint-disable-next-line

  }, [props.campaign]);

  const deleteFunc = (unitIds) => {
    if (!unitIds || unitIds.length === 0) return

    props.setLoading(true);

    const customlayers = props.selectedRowsValues.map(row => ({
      _id: row._id,
      shapeJson: {
        ...row.shapeJson,
        properties: {
          ...row.shapeJson.properties,
          campaignName: row.shapeJson.properties.campaignName?.filter?.(name => name !== props.campaign.name) || []
        }
      }
    }))

    removeCampaignFromCustomLayer({
      variables: {
        campaignId: props.campaign._id,
        customlayers,
      },
      onCompleted: () => {
        props.setLoading(false)
      },
      refetchQueries: ["getCampaign", "getESSimpleSearch"],
      awaitRefetchQueries: true
    })
  }

  return (
    <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
      <Dialog open={props.openDialog ? true : false} onClose={() => props.setOpenDialog(null)} fullWidth={true} maxWidth={"sm"}>
        {props.openDialog === "delete" && (
          <DeleteConfirmationDialogContent
            header={`Delete Record(s)`}
            onClose={() => props.setOpenDialog(null)}
            deleteFunc={deleteFunc}
            m1nSelectedRowsIds={props.selectedRows.map((sR) => props.rows[sR.dataIndex]?._id)}
            setM1nSelectedRowsIndexes={props.setSelectedRows}
          >
            {`Do you want to delete the selected record${props.selectedRows && props.selectedRows.length > 1 && props.selectedRows.length > 1 ? "s" : ""
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
        startPaginationAt={null}
        onTableChange={props.onTableChange}
        options={{
          ...props.options,
          ...props.customOptions,
        }}
        parent={props.parent}
        setColumnsBase={[]}
        deleteFunc={deleteFunc}
      />
    </Container>
  );
}

export default React.memo(TableESHOC(MapGridUnitTable), deepEqualObjects);
