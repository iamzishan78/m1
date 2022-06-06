import React, { useEffect, useContext } from "react";
import { Container } from "@material-ui/core";
import Table from "components/Shared/M1nTable/components/Table";
import TableESHOC from "components/Table/TableESHOC";
import moment from "moment";


import { deepEqualObjects, copy } from "components/Shared/functions";

// Header Schemas
import TableHeader from "components/Table/constants/agreements-header-schema";

// Utilities
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";

import { useSelector } from "react-redux";

import { useMutation } from "@apollo/client";


import debounce from "lodash/debounce";
import { AppContext } from "AppContext";

import { usetableStyles } from "../Styles";
import CustomerViewCol from "../helpers/CustomerView";
import MetaField from "../helpers/MetaField";
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";

const genericDataActions = ['tags', 'comments', 'tracks']
function AgreementsTable(props) {


  const [stateApp] = useContext(AppContext);

  const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

  const classes = usetableStyles();

  const userGridViewSettings = useSelector(({ session }) => session.userGridViewSettings);
  const defaultView = {
    name: `All Agreements`,
    type: "Default",
  };
  const GridViewModule = userGridViewSettings[`Agreements`]

  const searchInput = useSelector(
    (state) => state.MapGridCard.searchInputValue
  );
  const { setESFilters } = props;

  const esFilters = props.esFilters ? props.esFilters : []

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


  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : []
    props.setInitialFilters(formatedFilter)
    setTableMeta({
      // addableName: "Unit",
      extendSearchQuery: props.landSearchQuery || searchInput || '',
      selectedGridView: GridViewModule || defaultView,
      searchFields: ["*"],
      TableHeader: copy(TableHeader),
      esIndex: "shapes_flat",
      startPaginationAt: 10,
      gridView: { category: "Agreement" },
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
    props.setTableMeta((tableMeta) => ({ ...tableMeta, selectedGridView: GridViewModule || defaultView }));
    // eslint-disable-next-line
  }, [GridViewModule]);

  useEffect(() => {
    props?.onAgreementCount && props?.onAgreementCount(props?.options?.count || 0);
  }, [props?.options?.count])

  useEffect(() => {
    setESFilters && setESFilters(props.initialFilters)
    // eslint-disable-next-line
  }, [props.initialFilters]);

  const onCustomKeyChange = (value = null, index, key) => {
    debugger
    const rows = JSON.parse(JSON.stringify(props.rows));
    rows[index].custom_data = {
      ...props.rows[index].custom_data,
      [`${key}`]: value,
    };
    props.setRows(rows);

    const customLayer = {
      shapeJson: {
        ...props.rows[index].shapeJson,
        properties: {
          ...props.rows[index].shapeJson.properties,
          custom_data: { [`${key}`]: value },
        }
      }
    }

    console.log(customLayer)
    // updateCustomLayer({
    //   variables: {
    //     customLayerId: props.rows[index]._id,
    //     customLayer: customLayer
    //   },
    //   refetchQueries: ["customLayer"],
    // });

  };


  console.log("columsn : ", props.columns)

  return (
    <Container
      maxWidth={false}
      className={classes.container}
      id={props.id ? props.id : props.parent}
    >
      {stateApp.showFieldModal && <MetaField columns={props.columns} category="Agreement" updateColumnSorting={props.updateColumnSorting} />}
      <Table
        style={{ backgroundColor: "#fff" }}
        header={props.header}
        columns={props.columns}
        viewColumn={CustomerViewCol}
        viewColumnProps={props.viewColumnProps}
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
        onCustomKeyChange={onCustomKeyChange}
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

export default React.memo(TableESHOC(AgreementsTable, "Agreement"), deepEqualObjects)
