import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Container } from "@material-ui/core";
import get from "lodash/get";

import TableHeader from "components/Table/constants/contacts-header-schema.js";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "../TableESHOC";

import { useLazyQuery } from "@apollo/client";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import { getContactsAddress, copy } from "utils/helper";

import { deepEqualObjects } from "components/Shared/functions";
import { featureFlagChanges } from "components/ContactDetailedInfo/helper";

const useStyles = makeStyles((theme) => ({
  // container: {
  //     padding: "0 !important",
  //     height: "100%",
  //     "& .MuiToolbar-regular > div:nth-child(2)": {
  //         overflow: "hidden",
  //         display: "flex",
  //         flexDirection: "row-reverse",
  //     },
  //     "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(1)": {
  //         marginRight: "52px",
  //     },
  //     "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(2)": {
  //         marginRight: "-104px",
  //     },
  //     "& .MuiToolbar-regular > div:nth-child(1)": {
  //         minWidth: "400px",
  //     },
  //     "&>div>div": {
  //         height: "100%",
  //     },
  //     "& .MuiPaper-root": {
  //         display: "flex",
  //         "flex-direction": "column",
  //         height: "100%",
  //         position: "relative",
  //         "align-items": "stretch",
  //         "&>:nth-child(1)": {
  //             "min-height": "fit-content",
  //         },
  //         "&>:nth-child(3)": {
  //             height: "inherit !important",
  //             "&::-webkit-scrollbar": {
  //                 height: "0.8em",
  //                 width: "0.6em",
  //             },
  //             "&:hover::-webkit-scrollbar": {
  //                 height: "0.8em",
  //                 width: "0.6em",
  //             },
  //         },
  //         "&>:nth-child(4)": {
  //             bottom: 0,
  //         },
  //     },
  // },
  // details: {
  //     display: "block",
  //     "& div": {
  //         padding: "5px !important",
  //     },
  // },
  // searchField: {
  //     margin: "0 !important",
  //     padding: "10px !important",
  // },
  // summary: {
  //     backgroundColor: "#F2F2F2",
  //     height: "40px !important",
  //     minHeight: "40px !important",
  // },
}));

function ContactsTable(props) {
  const classes = useStyles();

  // function states
  const tableRef = useRef();
  const { user } = useSelector((state) => state.app);

  // queries
  const [getCheckPurchaseData, { data: ContactPurchaseData }] = useLazyQuery(GET_CHECK_PURCHASE_DATA);

  const addAble = { parent: false, type: "campaignContact" };
  const targetLabel = "campaignContacts";
  const uploadIcon = true;
  const header = "Contacts";
  const dense = true;
  const total = false;
  const orderByTracks = false;
  const startPaginationAt = 25;
  const esIndex = "contacts_flat";
  const genericDataActions = ["tracks"];

  const showGenericPhones = React.useMemo(() => {
    return user.features?.find((f) => f.name === "showGenericPhones");
  }, [user]);

  const tableheader = React.useMemo(() => {
    return TableHeader.map((header) => ({
      ...header,
      label: featureFlagChanges(showGenericPhones, header.label),
    }));
  }, [showGenericPhones]);

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = getContactsAddress(props.setGenricData(hit, hit._id, ["tracks"]));
      hit.tags = hit?.tags?.length > 0 ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length] : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    props.setInitialFilters([
      {
        field: "campaignName.keyword",
        value: get(props, "campaign.name"),
      },
    ]);
    props.setTableMeta({
      addableName: "Contact",
      extendSearchQuery: null,
      searchFields: ["name^4", "_all"],
      TableHeader: copy(tableheader),
      esIndex,
      // filters: Contacts?.filters ? getFilters() : [],
      typeKeyword: { gridViewCategory: "Contacts" },
      startPaginationAt: 25,
      defaultSort: { field: "lastUpdateAt", order: "desc", unmapped_type: "date" },
      formatHits,
      initializeGenericData: { key: "id", actions: genericDataActions },
    });
    // eslint-disable-next-line
  }, [props.contactSearchQuery, props.customAppliedFilters, props.campaign]);

  useEffect(() => {
    if (props?.rows?.length > 0) {
      const objectsIdsArray = props.rows.map((contact) => contact._id);
      getCheckPurchaseData({
        variables: {
          contactIds: objectsIdsArray,
        },
      });
    }
    // eslint-disable-next-line
  }, [props.rows]);

  useEffect(() => {
    if (ContactPurchaseData?.getCheckPurchaseData) {
      const rows = JSON.parse(JSON.stringify(props.rows));
      for (let i = 0; i < ContactPurchaseData?.getCheckPurchaseData.length; i++) {
        const index = rows.findIndex((row) => row._id === ContactPurchaseData.getCheckPurchaseData[i]);
        rows[index].isPurchased = true;
      }
      props.setRows(rows);
    }
  }, [ContactPurchaseData]);

  delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = false;

  return (
    <>
      <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
        <Table
          tableRef={tableRef}
          style={{ backgroundColor: "#fff" }}
          header={header}
          columns={props.columns}
          rows={props.rows}
          total={total}
          loading={props.loading}
          addAble={addAble}
          targetLabel={targetLabel}
          uploadIcon={uploadIcon}
          dense={dense}
          orderByTracks={orderByTracks}
          startPaginationAt={startPaginationAt}
          contactId={props.contactId}
          options={{
            ...props.options,
            ...props.customOptions,
          }}
          parent={props.parent}
          setColumnsBase={[]}
          onTableChange={props.onTableChange}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(ContactsTable, false), deepEqualObjects);
