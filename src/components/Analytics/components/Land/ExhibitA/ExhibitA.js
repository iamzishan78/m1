import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/analytics-land-exhibita-schema";
import get from "lodash/get";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Switch from '@material-ui/core/Switch';
import { Tooltip, IconButton } from "@material-ui/core";
// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "components/Table/Styles";
// actions
import { setRevenuePropertyData } from "actions";
import TableESHOC from "components/Table/TableESHOC";
import convert_date from "components/Shared/valueformatters/convert_date.js";
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";

const useStyles = makeStyles(() =>({
    root: {
      width: 54,
      height: 40,
      padding: 0,
      '&. MuiIconButton-root': {
        margin: 0
      }
    },
    switchBase: {
      padding: 0,
      backgroundColor: "transparent !important",
      '&$checked': {
        color: 'white',
        '& + $track': {
          backgroundColor: '#D4E7F1',
          opacity: 1,
          border: 'none',
        },
      },
    },
    thumb: {
      width: 20,
      height: 20,
      marginTop: 9
    },
    track: {
      backgroundColor: '#616A6E',
      opacity: 1,
    },
    checked: {},
    focusVisible: {},
  })
);

function ExhibitATable(props) {
  const classes = usetableStyles();
  const styles = useStyles();
  const [toggle, setToggle] = useState(false)
  const { esIndex, setESFilters } = props;
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false);

  const esFilters = props.esFilters ? props.esFilters : [];

  const formatHits = (hits) => {
    hits = hits.map((hit) => {
      hit.agreementNumber = hit.shape.shapeJson.properties.agreementNumber;
      hit.agreementStatus = hit.shape.shapeJson.properties.agreementStatus;
      hit.agreementName = hit.shape.shapeJson.properties.agreementName;
      hit.agreementType = agreementTypes.find((type) => type.value === hit.shape.shapeJson.properties.agreementType || type.label === hit.shape.shapeJson.properties.agreementType)?.label;
      hit.agreementId = hit.shape._id;
      hit.grantor = hit.shape.shapeJson.properties.grantor;
      hit.grantee = hit.shape.shapeJson.properties.grantee;
      // hit.layerSubType = hit.shape.shapeJson.properties.layerSubType;
      hit.agreementDate = hit.shape.shapeJson.properties.agreementDate ? convert_date(hit.shape.shapeJson.properties.agreementDate) : null;
      hit.effectiveDate = hit.shape.shapeJson.properties.effectiveDate ? convert_date(hit.shape.shapeJson.properties.effectiveDate) : null;
      hit.tractState =
        get(hit, "parcel.shapeJson.properties.originalProperties.State", "") ||
        get(hit, "parcel.shapeJson.properties.originalProperties.StateAbbreviation", "");
      hit.tractCounty = get(hit, "parcel.shapeJson.properties.originalProperties.County", "");
      hit.tractName = get(hit, "parcel.name", "");
      hit.legalDesctiption = get(hit, "shape.shapeJson.properties.legalDesctiption", "");
      hit.internalCompany = get(hit, "shape.shapeJson.properties.internalCompany", "");
      hit.prospectID = hit.shape.shapeJson.properties.prospectID;
      hit.acquisitionID = hit.shape.shapeJson.properties.acquisitionID;
      hit.blockTownship =
        get(hit, "parcel.shapeJson.properties.originalProperties.Block", undefined) ||
        get(hit, "parcel.shapeJson.properties.originalProperties.Township", undefined);
      hit.sectionRange =
        get(hit, "parcel.shapeJson.properties.originalProperties.Section", undefined) ||
        get(hit, "parcel.shapeJson.properties.originalProperties.Range", undefined);
      hit.abstractSection =
        get(hit, "parcel.shapeJson.properties.originalProperties.AbstractName", undefined) ||
        get(hit, "parcel.shapeJson.properties.originalProperties.ShortName", undefined);
      hit.recordedDate = get(hit, "shape.shapeJson.properties.recordedDate")
        ? convert_date(get(hit, "shape.shapeJson.properties.recordedDate"))
        : null;
      hit.recordedBook = get(hit, "shape.shapeJson.properties.recordedBook");
      hit.recordedPage = get(hit, "shape.shapeJson.properties.recordedPage");
      hit.recordedInstrumentNumber = get(hit, "shape.shapeJson.properties.recordedInstrumentNumber");
      return hit;
    });
    return hits;
  };

  // useEffect(() => {
  //   if(toggle){
  //     setESFilters([...esFilters, { field: "shape.shapeJson.properties.agreementStatus.keyword", value: ["Active", "ACTIVE"] }])
  //   }else{
  //     const filters = esFilters ? copy(esFilters) : [];
  //     const index = filters.findIndex(d => (d.field === 'shape.shapeJson.properties.agreementStatus.keyword' && d.value.includes('Active') && d.value.includes('ACTIVE')))
  //     if(index > -1){
  //       filters.splice(index, 1)
  //     }
  //     setESFilters(filters)
  //   }
  
  // },[toggle])

  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : [];
    const fixedFilters = [];
    if(toggle){
      fixedFilters.push({ field: "shape.shapeJson.properties.agreementStatus.keyword", value: ["Active", "ACTIVE"] })
    }
    // if (formatedFilter[0] && formatedFilter[0].value.range) {
    //   formatedFilter[0].type = "range";
    //   formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field];
    //   fixedFilters.push(formatedFilter[0]);
    // }
    fixedFilters.push({ field: "shape.shapeJson.properties.type", value: "agreement" });
    // fixedFilters.push({ field: "shape._id", value: '637180f3ddaf4a47251a35b5' });

    props.setInitialFilters(formatedFilter);
    props.setTableMeta({
      extendSearchQuery: props.landSearchQuery || "",
      TableHeader: copy(TableHeader),
      esIndex: esIndex,
      filters: fixedFilters,
      selectedGridView: { filters: [] },
      startPaginationAt: 25,
      defaultSort: { field: "_ts", order: "desc" },
      formatHits,
      downloadAll: { exportPx: '121px' },
      setAppliedFilters: props.filterChange,
    });
    // eslint-disable-next-line
  }, [props.landSearchQuery, props.filterToggle, refetchData, esFilters, toggle]);

  useEffect(() => {
    dispatch(setRevenuePropertyData({ loading: props.loading, data: props.rows }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rows]);

  useEffect(() => {
    if ((props?.total === 0 || props?.total) && props.onPropertiesCount) {
      props.onPropertiesCount(props.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.total, props.dependencyUpdate]);

  props.options.search = props.searchBar;

  return (
    <>
      <Container maxWidth={false} className={classes.container} id={props.id ? props.id : props.parent}>
        <Table
          style={{ backgroundColor: "#fff" }}
          header={props.header}
          columns={props.columns}
          rows={props.rows}
          total={false}
          potentialIssues={[]}
          addAble={{ type: "RevenueProperties" }}
          loading={props.loading}
          targetLabel={props.targetLabel}
          uploadIcon={null}
          dense={props.dense ? props.dense : undefined}
          orderByTracks={false}
          startPaginationAt={props.startPaginationAt}
          onTableChange={props.onTableChange}
          options={{ 
            ...props.options, 
            ...props.customOptions,
            customToolbar: () => {
              return (
                <>
                  <div style={{
                    display: "inline",
                    position: "absolute",
                    right: "121px",
                  }}>
                    <IconButton onClick={props.onDownload} disabled={props.isExporting}>
                        <Tooltip title="Download to CSV" aria-label="add">
                            <CloudDownloadIcon />
                        </Tooltip>
                    </IconButton>
                  </div>
                  <div style={{
                    display: "inline",
                    position: "absolute",
                    marginTop: "5px",
                    right: "225px",
                  }}>
                    <>Include inactive agreements</>
                    <Switch
                    classes={{
                      switchBase: styles.switchBase,
                      thumb: styles.thumb,
                      track: styles.track,
                      checked: styles.checked,
                    }}
                      checked={toggle}
                      onChange={() => setToggle(!toggle)}
                      name="checkedB"
                      color="primary"
                    />
                  </div>
              </>
              )
            }
          }}
          parent={props.parent}
          setColumnsBase={[]}
          setRefetchData={setRefetchData}
          refetchData={refetchData}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(ExhibitATable), deepEqualObjects);
