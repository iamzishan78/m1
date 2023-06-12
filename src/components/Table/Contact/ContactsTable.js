import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Container } from "@material-ui/core";
import get from "lodash/get";
import uniqBy from "lodash/uniqBy";
import moment from "moment";

import TableHeader from "components/Table/constants/contacts-header-schema.js";
import Contact from "components/Shared/svgIcons/contact";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "../TableESHOC";

import Loader from "components/Loaders";
import GridView from "components/Shared/GridView";
import { HeaderComponent } from "components/Table/helpers";

import { useLazyQuery, useMutation } from "@apollo/client";
import { UPDATE_GRID_VIEW } from "graphQL/useMutationUpdateGridView";
import { REMOVE_CONTACTS } from "graphQL/useMutationRemoveContact";
import { GET_CHECK_PURCHASE_DATA } from "graphQL/useQueryCheckPurchaseData";

import { getContactsAddress, copy } from "utils/helper";

import { deepEqualObjects } from "components/Shared/functions";
import { featureFlagChanges } from "components/ContactDetailedInfo/helper";
import CustomerViewCol from "../helpers/CustomerView";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "0 !important",
    height: "100%",

    "& .MuiToolbar-regular > div:nth-child(2)": {
      overflow: "hidden",
      display: "flex",
      flexDirection: "row-reverse",
    },
    "& .MuiToolbar-regular > div:nth-child(2) > button:nth-child(1)": {
      marginRight: "111px",
      position: 'absolute'
    },
    "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(1)": {
      marginRight: "52px",
    },
    "& .MuiToolbar-regular > div:nth-child(2) > span:nth-child(2)": {
      marginRight: "54px",
      position: "absolute"
    },
    "& .MuiToolbar-regular > div:nth-child(1)": {
      minWidth: "400px",
    },
    "&>div>div": {
      height: "100%",
    },
    "& .MuiPaper-root": {
      display: "flex",
      "flex-direction": "column",
      height: "100%",
      position: "relative",
      "align-items": "stretch",
      "&>:nth-child(1)": {
        "min-height": "fit-content",
      },
      "&>:nth-child(3)": {
        height: "inherit !important",
        "&::-webkit-scrollbar": {
          height: "0.8em",
          width: "0.6em",
        },
        "&:hover::-webkit-scrollbar": {
          height: "0.8em",
          width: "0.6em",
        },
      },
      "&>:nth-child(4)": {
        bottom: 0,
      },
    },
  },
  details: {
    display: "block",
    "& div": {
      padding: "5px !important",
    },
  },
  searchField: {
    margin: "0 !important",
    padding: "10px !important",
  },
  summary: {
    backgroundColor: "#F2F2F2",
    height: "40px !important",
    minHeight: "40px !important",
  },
}));
const defaultView = {
  name: "All Contacts",
  type: "Default",
};
function ContactsTable(props) {
  const classes = useStyles();

  // const dispatch = useDispatch();
  const { Contacts } = useSelector(({ session }) => session.userGridViewSettings);
  const User = useSelector(({ app }) => app.user);

  // function states
  const tableRef = useRef();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSaveAsNew, setShowSaveAsNew] = useState(false);
  const { activeModule } = useSelector(({ common }) => common);
  const { user } = useSelector(state => state.app);

  // queries
  const [getCheckPurchaseData, { data: ContactPurchaseData }] = useLazyQuery(GET_CHECK_PURCHASE_DATA);
  const [updateGridView] = useMutation(UPDATE_GRID_VIEW);
  const [removeContact] = useMutation(REMOVE_CONTACTS);

  const addAble = { parent: false, type: "contact" };
  const targetLabel = "contact";
  const uploadIcon = true;
  const header = "Contacts";
  const dense = false;
  const total = false;
  const orderByTracks = false;
  const startPaginationAt = 25;
  const esIndex = 'contacts_flat'
  const genericDataActions = ['tracks']

  const showGenericPhones = React.useMemo(() => {
    return user.features?.find(f => f.name === "showGenericPhones")
  }, [user]);

  const tableheader = React.useMemo(() => {
    return TableHeader.map(header => ({
      ...header,
      label: featureFlagChanges(showGenericPhones, header.label)
    }))
  }, [showGenericPhones]);

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit = getContactsAddress(props.setGenricData(hit, hit._id, ["tracks"]));
      hit.tags =
        hit?.tags?.length > 0
          ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length]
          : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;

      hit.campaignName = hit.campaignName?.[0]?.join?.(',') || hit.campaignName

      return hit;
    });

    return hits;
  };

  useEffect(() => {
    props.setInitialFilters(uniqBy(props.customAppliedFilters, "field") || []);

    const tableheaderCopy = copy(tableheader)
    tableheaderCopy.map(thc => thc.options = tableheader.find(th => th.name === thc.name).options)

    props.setTableMeta({
      // filters: uniqBy(props.customAppliedFilters, "field") || [],
      addableName: "Contact",
      extendSearchQuery: props.contactSearchQuery ? props.contactSearchQuery : null,
      searchFields: ["name^4", "_all"],
      TableHeader: tableheaderCopy,
      esIndex,
      // filters: Contacts?.filters ? getFilters() : [],
      typeKeyword: { gridViewCategory: "Contacts" },
      startPaginationAt: 25,
      defaultSort: { field: "lastUpdateAt", order: "desc", unmapped_type: 'date' },
      formatHits,
      downloadAll: { exportPx: '121px' },
      initializeGenericData: { key: "id", actions: genericDataActions },
      isSelectedAllAllowed: true,
    });
    // eslint-disable-next-line
  }, [props.contactSearchQuery, props.customAppliedFilters]);

  useEffect(() => {
    if (Contacts?.name === "My Contacts" && !Contacts?.isPrivate) {
      Contacts.filters[0] = {
        field: "contactOwners.name",
        value: User.name,
      };
    }
    props.setSelectedGridView(Contacts || defaultView);
    // eslint-disable-next-line
  }, [Contacts]);

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
        if (index !== -1)
          rows[index].isPurchased = true;
      }
      props.setRows(rows);
    }
  }, [ContactPurchaseData]);

  const deleteFunc = (contactsIdsToDelete) => {
    if (contactsIdsToDelete) {
      Loader.createToast("contact-deletion", "Contact Deletion in Progress");
      removeContact({
        variables: {
          contactIds: contactsIdsToDelete,
          userId: props.userId,
        },
        refetchQueries: ["getESSimpleSearch", "getContact", "checkIfOwnersAreContacts"],
        awaitRefetchQueries: true,
      }).then(
        (res) => {
          if (res.data && res.data.removeContact) {
            const { success, message } = res.data.removeContact;
            if (success) Loader.successToast("contact-deletion", message);
            else Loader.errorToast("contact-deletion", message);
          } else Loader.errorToast("contact-deletion", "Failed to convert to contact");
        },
        (err) => {
          Loader.errorToast("contact-deletion", "Failed to convert to contact");
        }
      );
    }
  };

  const handleDefaultView = (view, user) => {
    if (view.name === "My Contacts") {
      view.filters[0].value = user.name;
    }
    if (view.name === "Recently Modified" || view.name === "Recently Added") {
      view.filters[0].value.range[view.filters[0].field].gte = moment().subtract(30, "days").toISOString();
      view.filters[0].value.range[view.filters[0].field].lte = moment().toISOString();
    }
    return view;
  };

  const getSelectedView = () => {
    const isAllModule = get(activeModule, "title", "").includes("All");
    const view = copy(isAllModule ? props.selectedGridView : defaultView);
    if (view?.type === "Default") {
      if (get(activeModule, "title", "").includes("All")) {
        view.name = view.name.replace("Contacts", get(activeModule, "title", "").replace("All ", ""));
      } else {
        view.name = view.name.replace("Contacts", get(activeModule, "title", ""));
      }
    }
    return view || defaultView;
  };

  const headerProps = {
    columns: props.columns,
    Icon: Contact,
    label: props.headerLabel,
    showViewModal,
    setShowSaveAsNew,
    setShowViewModal,
    selectedGridView: getSelectedView(),
    updateGridView,
    selectedFilters: props.activeFiltersRef.current,
  };

  delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = false;

  return (
    <>
      <Container
        maxWidth={false}
        className={classes.container}
        id={props.id ? props.id : props.parent}
      >
        {showViewModal && (
          <GridView
            module="Contacts"
            columns={props.columns}
            defaultView={defaultView}
            handleDefaultView={handleDefaultView}
            handleClose={() => setShowViewModal(false)}
            setSelectedGridView={props.setSelectedGridView}
            selectedGridView={props.selectedGridView}
            setShowViewModal={setShowViewModal}
            setShowSaveAsNew={setShowSaveAsNew}
            showSaveAsNew={showSaveAsNew}
            selectedFilters={props.activeFiltersRef.current}
          />
        )}
        <Table
          tableRef={tableRef}
          style={{ backgroundColor: "#fff" }}
          header={header}
          headerComponent={HeaderComponent}
          viewColumn={CustomerViewCol}
          viewColumnProps={props.viewColumnProps}
          headerProps={headerProps}
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
          selectedRows={props.selectedRows}
          setSelectedRows={setSelectedRows}
          options={{
            ...props.options,
            ...props.customOptions
          }}
          parent={props.parent}
          setColumnsBase={[]}
          deleteFunc={deleteFunc}
          onRowSelectionChange={(
            currentRowsSelected,
            allRowsSelected,
            rowsSelected
          ) => {
            if (
              allRowsSelected.length === startPaginationAt ||
              allRowsSelected.length === props.options.count
            ) {
              setIsSelectAll(true);
            } else {
              setIsSelectAll(false);
            }
          }
          }
          onTableChange={props.onTableChange}
          exportContactsProps={{
            search: props.activeSearchRef.current,
            filters: [...props.initialFilters, ...uniqBy(props.customAppliedFilters, "field") || []],
            total: props.options.count,
            isSelectAll: false,
            rows: props.selectedRowsValues || [],
            esIndex: esIndex,
            open: true
          }}
          isExporting={props.isExporting}
          onDownload={props.onDownload}
          {...props.esHocProps}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(ContactsTable), deepEqualObjects);
