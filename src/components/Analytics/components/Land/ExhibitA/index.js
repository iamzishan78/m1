import React, { useContext, useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";

import { AppContext } from "AppContext";
import ExhibitA from "./ExhibitA";
import { AutoCompleteFilter } from "components/Table/AutoCompleteFilter";
import { GET_ES_SIMPLE_FILTER } from "graphQL/useQueryESSimpleFilter";
import { agreementTypes } from "components/ShapeDetailCard/Common/SummaryTable/agreementDefaultData";
import { copy, getSearchFields } from "components/Shared/functions";
import TableHeader from "components/Table/constants/analytics-land-exhibita-schema";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "100%",
  },
  select: {
    height: 40,
  },
  actionsGrid: {
    width: "100%",
  },
  actionBar: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: "100%",
    minHeight: "65px",
    marginBottom: 30,

    "& .MuiSelect-select:focus, & .MuiOutlinedInput-root": {
      backgroundColor: "#ffff",
    },
    "& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)": {
      borderColor: "#ffff",
    },
  },
  gridRoot: {
    "& div": {
      "&>.MuiPaper-root": {
        display: "flex",
        "flex-direction": "column",
        // height: "calc(100vh - 240px)",
        position: "relative",
        boxShadow: "none",
        "align-items": "stretch",
        "&>.MuiPaper-root": {
          display: "contents",
        },
        "&>:nth-child(3)": {
          height: "inherit !important",
        },
        "&> table": {
          bottom: 0,
        },
      },
    },
  },
}));

const filterColumnsHeader = [
  {
    label: "Agreement Type",
    filterKey: "shape.shapeJson.properties.agreementType.keyword",
    name: "agreementType",
    custom: {
      formatedFilterOptions: agreementTypes
    }
  },
  {
    label: "State",
    filterKey: [
      "parcel.shapeJson.properties.originalProperties.State.keyword",
      "parcel.shapeJson.properties.originalProperties.StateAbbreviation.keyword",
    ],
    custom: {
      oRFilter: true,
    },
    name: "state",
  },
  {
    label: "County",
    filterKey: "parcel.shapeJson.properties.originalProperties.County.keyword",
    name: "county",
  },
  {
    label: "Internal Company",
    filterKey: "shape.shapeJson.properties.internalCompany.keyword",
    name: "internalCompany",
  },
  {
    label: "Prospect",
    filterKey: "shape.shapeJson.properties.prospectID.keyword",
    name: "prospectID",
  },
  {
    label: "Acquisition",
    filterKey: "shape.shapeJson.properties.acquisitionID.keyword",
    name: "acquisitionID",
  },
];

export default function ExhibitATabPanel() {
  const classes = useStyles();
  const [stateApp] = useContext(AppContext);
  const loadMore = { type: 'infiniteScroll', height: "calc(100vh - 166px)" }
  const initialFilterList = [["All"], ["All"], ["All"], ["All"], ["All"], ["All"]];
  const [, setFilters] = useState([]);

  const [esFilters, setESFilters] = useState([]);
  const [tableFilters, setTableFilters] = useState([]);

  useEffect(() => {
    const filter = JSON.parse(JSON.stringify(esFilters))
    for(let i=0; i<filter.length; i++) {
      const column = filterColumnsHeader.find(h => h.filterKey === filter[i].field)
      if(column && column?.custom?.formatedFilterOptions){
        const filterData = column?.custom?.formatedFilterOptions;
        const data = filterData.find(f => f.label === filter[i].value)
        if (data) {
          filter[i].value = data.value
        }
      }
      setTableFilters(filter)
    }
    // if(column?.custom?.formatedFilterOptions){
    //   let value = column.filterList[0];
    //   const filterData = column?.custom?.formatedFilterOptions;
    //   const data = filterData.find(f => f.label === value)
    //   if (data) {
    //     value = data.value
    //   }
    //   column.filterList[0] = value
    // }
    // setTableFilters(esFilters)
  },[esFilters])
  const onChange = (filter, index, column, esKey) => {
    const newFilters = JSON.parse(JSON.stringify(esFilters));

    if (column?.custom?.oRFilter) {
      if (column?.filterList[0]) {
        if (newFilters.find((filter) => filter.field.includes(column?.filterKey[0]))) {
          newFilters[index] = { field: JSON.stringify(column?.filterKey), value: column?.filterList[0], oRFilter: true };
        } else {
          newFilters.push({ field: JSON.stringify(column?.filterKey), value: column?.filterList[0], oRFilter: true });
        }
      } else {
        const index = newFilters.find((filter) => filter.field.includes(column?.filterKey[0]));
        if (index >= '0') {
          newFilters.splice(index, 1);
        }
      }
    } else {
      if (column?.filterList[0]) {
        if (newFilters.find((filter) => filter.field === column?.filterKey)) {
          const index = newFilters.findIndex((filter) => filter.field === column?.filterKey);
          newFilters[index] = { field: column?.filterKey, value: column?.filterList[0] };
        } else {
          newFilters.push({ field: column?.filterKey, value: column?.filterList[0] });
        }
      } else {
        const index = newFilters.findIndex((filter) => filter.field === column?.filterKey);
        if (index > -1) {
          newFilters.splice(index, 1);
        }
      }
    }
    setESFilters(newFilters);
  };
  const filterChange = (filter) => {
    console.log("filter", filter);
  };

  return (
    <>
      <div className={classes.actionBar}>
        <Grid container direction="row" display="flex" alignItems="center" spacing={3} style={{ padding: "0px 36px" }}>
          <Grid container alignItems="center" spacing={2}>
            {filterColumnsHeader.map((filterColumn, index) => {
              const appliedFilters = esFilters?.length > 0 ? JSON.parse(JSON.stringify(esFilters)) : [];
              appliedFilters.push({ field: "shape.shapeJson.properties.type", value: "agreement" });

              let filterList = JSON.parse(JSON.stringify(initialFilterList));
              if (esFilters && typeof filterColumn?.filterKey === "string") {
                const gridViewFilter = esFilters.find((filter) => filter.field === filterColumn?.filterKey);
                if (gridViewFilter) filterList[index] = [gridViewFilter?.value];
                if (filterColumn.name === "County") {
                  const stateFilter = esFilters.find(
                    (filter) => filter.field === "shape.shapeJson.properties.originalProperties.State.keyword"
                  );
                  if (stateFilter) appliedFilters.push(stateFilter);
                }
              } else if (filterColumn?.custom?.oRFilter) {
                const gridViewFilter = esFilters.find((filter) => filter.field.includes(filterColumn?.filterKey[0]));
                if (gridViewFilter) filterList[index] = [gridViewFilter?.value];
              }

              return (
                <Grid item xs={12} md={2} className={classes.inputStyle}>
                  <AutoCompleteFilter
                    multiple={filterColumn.multiple}
                    esIndex={"shapetracts_flat"}
                    variant="outlined"
                    setFilters={setFilters}
                    filterList={JSON.parse(JSON.stringify(filterList))}
                    column={filterColumn}
                    disabled={filterColumn?.disabled}
                    index={index}
                    custom={filterColumn.custom ? filterColumn.custom : undefined}
                    onChange={onChange}
                    query={GET_ES_SIMPLE_FILTER}
                    searchFields={getSearchFields(copy(TableHeader), [])}
                    filters={appliedFilters}
                    extendSearchQuery={stateApp.landAnalyticsSearchQuery}
                    inputSize="small"
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </div>
      <div >
        <ExhibitA
          filterChange={filterChange}
          header="Exhibit A"
          esFilters={tableFilters}
          targetLabel="acerage"
          parent="ExhibitA"
          esIndex="shapetracts_flat"
          setESFilters={setESFilters}
          loadMore={loadMore}
          landSearchQuery={stateApp.landAnalyticsSearchQuery}
        />
      </div>
    </>
  );
}
