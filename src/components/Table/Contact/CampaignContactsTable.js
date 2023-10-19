import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "@material-ui/core";
import get from "lodash/get";

import TableHeader from "components/Table/constants/campaign-contacts-header-schema.js";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "../TableESHOC";

import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import { getContactsAddress, copy } from "utils/helper";

import { deepEqualObjects } from "components/Shared/functions";
import { featureFlagChanges } from "components/ContactDetailedInfo/helper";
import { usetableStyles } from "components/Table/Styles";
import { uniqBy } from "lodash";
import { UPSERT_CAMPAIGN_DESCRIPTORS } from "graphQL/useMutationCampaign";

function ContactsTable(props) {
  const classes = usetableStyles();

  // function states
  const tableRef = useRef();
  const { user } = useSelector((state) => state.app);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  // queries
  const [getCheckPurchaseData, { data: ContactPurchaseData }] = useLazyQuery(GET_CHECK_PURCHASE_DATA);
  const [upsertCampaignDescriptors] = useMutation(UPSERT_CAMPAIGN_DESCRIPTORS);

  const addAble = { parent: false, type: "campaignContact" };
  const targetLabel = "contact";
  const uploadIcon = true;
  const header = "Contacts";
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
    const tableheaderCopy = copy(tableheader);
    tableheaderCopy.map((thc) => (thc.options = tableheader.find((th) => th.name === thc.name).options));

    props.setInitialFilters([
      {
        field: "campaignName.keyword",
        value: get(props.campaign, "name", ""),
      },
    ]);
    props.setTableMeta({
      isSelectedAllAllowed: true,
      addableName: "Contact",
      extendSearchQuery: null,
      searchFields: ["name^4", "_all"],
      TableHeader: tableheaderCopy,
      esIndex,
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
  props.options.rowsSelected = props.allRowsSelected;

  const deleteFunc = (contactIds) => {
    if (!contactIds || contactIds.length === 0) return

    props.setLoading(true);

    const descriptors = contactIds.map(contactId => ({
      relatedObject: contactId,
      descriptorObject: props.campaign._id,
      isDeleted: true
    }))

    upsertCampaignDescriptors({
      variables: {
        descriptors
      },
      refetchQueries: ["getCampaign", "getESSimpleSearch"],
      awaitRefetchQueries: true
    })
  }

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
          dense={props.dense ? props.dense : undefined}
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
          selectedRows={props.selectedRows}
          setSelectedRows={setSelectedRows}
          onRowSelectionChange={(currentRowsSelected, allRowsSelected, rowsSelected) => {
            if (allRowsSelected.length === startPaginationAt || allRowsSelected.length === props.options.count) {
              setIsSelectAll(true);
            } else {
              setIsSelectAll(false);
            }
          }}
          exportContactsProps={{
            search: props.activeSearchRef.current,
            filters: [...props.initialFilters, ...(uniqBy(props.customAppliedFilters, "field") || [])],
            total: props.options.count,
            isSelectAll: isSelectAll,
            rows: selectedRows,
            esIndex: esIndex,
            open: true,
          }}
          campaign={props.campaign}
          deleteFunc={deleteFunc}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(ContactsTable, false), deepEqualObjects);
