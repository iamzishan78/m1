import React, { useEffect, useContext, useState, useRef } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import moment from "moment";


import { deepEqualObjects, copy, setStateIfDeepEqual } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/agreements-header-schema";

// Utilities
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";

import { useDispatch, useSelector } from "react-redux";


import debounce from "lodash/debounce";
import { AppContext } from "AppContext";

import { usetableStyles } from "../Styles";
import CustomerViewCol from "../helpers/CustomerView";
import MetaField from "../helpers/MetaField";
import { updateUserGridViewSettingAction } from "store/actions/sessionActions";
import { useLazyQuery } from "@apollo/client";
import { GET_META_DATA } from "graphQL/useQueryGetMetaData";
import { GET_GRID_VIEWS } from "graphQL/useQueryGetGridViews";
import { isEmpty } from "lodash-es";
import { formattingGridView, sortColumns } from "utils/helper";
import { handleSelectedGridChange } from "../helpers";

const genericDataActions = ['tags', 'comments', 'tracks']
function AgreementsTable(props) {
  const defaultView = {
    name: "All Agreements",
    type: "Default",
  };
  const dispatch = useDispatch();
  const { Agreements } = useSelector(({ session }) => session.userGridViewSettings);


  const selectedFilters = useRef([]);

  const [columns, Columns] = useState(JSON.parse(JSON.stringify(TableHeader)));

  const [selectedGridView, setSelectedGridView] = useState(defaultView);
  const [gridViews, setGridViews] = useState(null);
  const [metaDatas, setMetaDatas] = useState(null);
  const [stateApp, setStateApp] = useContext(AppContext);

  const classes = usetableStyles();

  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );
  const { setESFilters } = props;

  const esFilters = props.esFilters ? props.esFilters : []

  const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);
  const [getGridViews, { data: gridViewsData }] = useLazyQuery(GET_GRID_VIEWS);

  const setColumns = (newState) => {
    setStateIfDeepEqual(Columns, newState);
  };

  useEffect(() => {
    return () => {
      setStateApp((stateApp) => ({
        ...stateApp,
        documentSearchQuery: "",
      }));
    };
  }, []);

  useEffect(() => {
    console.log("here", Agreements);
    setSelectedGridView(Agreements || defaultView);
  }, [Agreements]);

  useEffect(() => {
    getMetaData({
      variables: {
        user: stateApp.user?.mongoId,
        category: "Agreement",
      },
    });

  }, [getMetaData, getGridViews]);

  useEffect(() => {
    if (gridViewsData?.getGridViews?.gridViews) {
      setGridViews(gridViewsData.getGridViews.gridViews);

    }
  }, [gridViewsData]);


  useEffect(() => {
    if (metaDataRes?.getMetaData?.metaData) {
      setMetaDatas(metaDataRes?.getMetaData?.metaData);

    }
  }, [metaDataRes]);
  // console.log("columns : ", columns)
  console.log("propscolumns outside : ", props.columns)
  useEffect(() => {
    if (selectedGridView && metaDatas) {
      const selectedData = JSON.parse(JSON.stringify(selectedGridView));
      setStateApp((state, props) => {
        return {
          ...state,
          selectedView: selectedData,
        };
      });

      let filterColumns = props.columns.filter((col) => !metaDatas.find((meta) => meta.name === col.name));
      console.log("propscolumns : ", props.columns)

      let columnsData = JSON.parse(JSON.stringify([...filterColumns, ...metaDatas]));
      for (let i = 0; i < metaDatas.length; i++) {
        TableHeader.push(metaDatas[i]);
      }

      let view = JSON.parse(JSON.stringify(selectedData));
      if (!isEmpty(view)) {
        view = formattingGridView(JSON.parse(JSON.stringify(view)));
        columnsData = handleSelectedGridChange(TableHeader, view, columnsData);
      }

      columnsData = sortColumns(columnsData, view);

      setColumns(columnsData)



      //console.log("columnsData : ", columnsData)
      // setSelectedGridView(selectedData);
    }
  }, [selectedGridView, metaDatas, props.columns]);


  const setTableMeta = React.useMemo(
    () =>
      debounce((request, top, callback) => {
        props.setTableMeta(request);
      }, 500),
    []
  );

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit.agreementType = agreementTypes.find((type) => type.value === hit.agreementType || type.label === hit.agreementType)?.label;
      hit.agreementDate = hit.agreementDate ? moment(new Date(hit.agreementDate)).format("MM/DD/YYYY") : null;
      hit.effectiveDate = hit.effectiveDate ? moment(new Date(hit.effectiveDate)).format("MM/DD/YYYY") : null;
      hit.expirationDate = hit.expirationDate ? moment(new Date(hit.expirationDate)).format("MM/DD/YYYY") : null;
      hit.extensionDate = hit.extensionDate ? moment(new Date(hit.extensionDate)).format("MM/DD/YYYY") : null;
      hit.State = hit?.originalProperties?.State;
      hit.County = hit?.originalProperties?.County;
      hit.tags = hit?.tags?.length > 0 ? [[hit.tags.map((tag) => tag.tag)], hit.tags.length] : [[], 0];
      hit.commentsCounter = hit.comments ? hit.comments.length : 0;
      hit = props.setGenricData(hit, hit.id, genericDataActions, genericDataActions);
      return hit;
    });
    return hits
  }

  const updateColumnSorting = (value) => {
    console.log("selectedGridView : ", selectedGridView)
    dispatch(
      updateUserGridViewSettingAction.STARTED({
        userGridViewSetting: {
          gridView: selectedGridView._id,
          gridViewPatch: {
            filters: selectedFilters.current,
            columns: value.map((col) => ({ name: col.name, display: col.display === "true" })),
          },
          user: stateApp.user?.mongoId,
        },
      })
    );

  };

  const viewColumnProps = {
    selectedGridView,
    updateColumnSorting,
  };
  //console.log("stateApp agrement", stateApp);

  useEffect(() => {
    console.log("here", Agreements);
    setSelectedGridView(Agreements || defaultView);
  }, [Agreements]);

  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : []
    props.setInitialFilters(formatedFilter)
    setTableMeta({
      // addableName: "Unit",
      extendSearchQuery: props.landSearchQuery || searchInput || '',
      searchFields: ["name", "_all"],
      TableHeader: copy(TableHeader),
      esIndex: "shapes_flat",
      startPaginationAt: 10,
      filters: [
        {
          field: "shapeJson.properties.type.keyword",
          value: "agreement",
        },
      ],
      defaultSort: { field: '_ts', order: 'desc' },
      polygon: stateApp?.currentFeature?.geometry && {
        type: "geo_intersects",
        field: "shapeGeometry",
        value: stateApp?.currentFeature?.geometry
      },
      formatHits,
    });
    // eslint-disable-next-line
  }, [searchInput, props.landSearchQuery, props.filterToggle]);

  useEffect(() => {
    props?.onAgreementCount && props?.onAgreementCount(props?.options?.count || 0);
  }, [props?.options?.count])

  useEffect(() => {
    setESFilters && setESFilters(props.initialFilters)
    // eslint-disable-next-line
  }, [props.initialFilters]);




  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {stateApp.showFieldModal && <MetaField columns={props.columns} category="Agreement" updateColumnSorting={updateColumnSorting} />}
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={columns}
        viewColumn={CustomerViewCol}
        viewColumnProps={viewColumnProps}
        rows={props.rows}
        total={false}
        addAble={{ type: "Tracts" }}
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
      />
    </Container>
  );
}

export default React.memo(TableESHOC(AgreementsTable), deepEqualObjects)
