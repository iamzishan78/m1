import React, { useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Table from "components/Shared/M1nTable/components/Table";
import TableHeader from "components/Table/constants/analytics-land-acerage-details-schema";
import { esExtentedSearch } from "components/Shared/functions";
import { Tooltip, IconButton } from "@material-ui/core";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Switch from '@material-ui/core/Switch';
// QUERIES
import { deepEqualObjects, copy } from "components/Shared/functions";
// Utilities
import { usetableStyles } from "components/Table/Styles";
// actions
import { setRevenuePropertyData } from "actions";
import TableESHOC from "components/Table/TableESHOC";

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

function AcerageDetail(props) {
  const classes = usetableStyles();
  const styles = useStyles();
  const { esIndex, setESFilters } = props;
  const [toggle, setToggle] = useState(false)
  // redux
  const dispatch = useDispatch();
  const [refetchData, setRefetchData] = useState(false);

  const esFilters = props.esFilters ? props.esFilters : [];

  const formatHits = (hits) => {
    
    hits = hits.map((hit) => {
      hit._id = hit.shape._id;
      hit.agreementNumber = hit.shape.shapeJson.properties.agreementNumber;
      hit.agreementName = hit.shape.shapeJson.properties.agreementName;
      hit.agreementStatus = hit.shape.shapeJson.properties.agreementStatus;
      hit.agreementSubtype = hit.shape.shapeJson.properties.agreementSubtype;
      hit.layerSubType = hit.shape.shapeJson.properties.layerSubType;
      hit.rightsType = hit.shape.shapeJson.properties.rightsType;
      hit.agreementState = hit?.shape?.shapeJson?.properties?.originalProperties?.State || hit?.shape?.shapeJson?.properties?.originalProperties?.StateAbbreviation
      hit.agreementCounty = hit?.shape?.shapeJson?.properties?.originalProperties?.County
      hit.tractName = hit.parcel.name;
      hit.tractStatus = hit?.parcel?.shapeJson?.properties?.tractStatus;
      hit.reportGrossAcres = hit?.parcel?.shapeJson?.properties?.reportGrossAcres;
      hit.sdGrossAcres = hit?.parcel?.shapeJson?.properties?.sdGrossAcres;
      hit.netAcres = hit?.parcel?.shapeJson?.properties?.netAcres;
      hit.companyNetAcres = hit?.parcel?.shapeJson?.properties?.companyNetAcres;
      hit.netRoyalty = hit?.parcel?.shapeJson?.properties?.netRoyalty;

      hit.internalCompany = hit.shape.shapeJson.properties.internalCompany;
      hit.prospectID = hit.shape.shapeJson.properties.prospectID;
      hit.acquisitionID = hit.shape.shapeJson.properties.acquisitionID;
      return hit;
    });
    return hits;
  };

  useEffect(() => {
    const formatedFilter = esFilters ? copy(esFilters) : [];
    const fixedFilters = [];
    if(!toggle){
      fixedFilters.push({ field: "shape.shapeJson.properties.agreementStatus.keyword", value: ["Active", "ACTIVE"] })
    }
    if (formatedFilter[0] && formatedFilter[0].value.range) {
      formatedFilter[0].type = "range";
      formatedFilter[0].value = formatedFilter[0].value.range[formatedFilter[0].field];
      fixedFilters.push(formatedFilter[0]);
    }
    fixedFilters.push({ field: "shape.shapeJson.properties.type", value: 'agreement' });
    // fixedFilters.push({ field: "shape._id", value: '637180f3ddaf4a47251a35b5' });
    
    props.setInitialFilters(formatedFilter);
    props.setTableMeta({
      extendSearchQuery: esExtentedSearch(props.landAnalyticsSearchQuery, ''),
      TableHeader: copy(TableHeader),
      esIndex: esIndex,
      filters: fixedFilters,
      selectedGridView: { filters: [] },
      startPaginationAt: 100,
      downloadAll: { exportPx: '176px' },
      // defaultSort: { field: "name.keyword", order: "asc" },
      formatHits,
    });
    // eslint-disable-next-line
  }, [props.landAnalyticsSearchQuery, props.filterToggle, refetchData, toggle]);

  useEffect(() => {
    // setESFilters(props.initialFilters);
    // eslint-disable-next-line
  }, [props.initialFilters]);

  useEffect(() => {
    dispatch(
      setRevenuePropertyData({ loading: props.loading, data: props.rows })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.rows]);

  useEffect(() => {
    if ((props?.total === 0 || props?.total) && props.onPropertiesCount) {
      props.onPropertiesCount(props.total);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.total, props.dependencyUpdate]);

  // delete props.options.customToolbar;
  delete props.options.customToolbarSelect;
  delete props.options.onRowClick;
  props.options.search = props.searchBar;

  return (
    <>
      <Container
        maxWidth={false}
        className={classes.container}
        id={props.id ? props.id : props.parent}
      >
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
                    <>Includes inactive agreements</>
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
          {...props.esHocProps}
        />
      </Container>
    </>
  );
}

export default React.memo(TableESHOC(AcerageDetail), deepEqualObjects);
