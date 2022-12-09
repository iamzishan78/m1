import React, { useEffect, useCallback, useState, useMemo } from "react";

import TextField from "@material-ui/core/TextField";
import { Controller } from "react-hook-form";
import { US_STATES_CODES } from "utils/data";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import { AutoCompleteLandgrid } from "components/Shared/Forms/Fields/AutoCompleteLandgrid";
import { upperFirst } from "lodash";
import { GET_AUTOCOMPLETE_LIST } from "graphQL/useQueryGetAutoCompleteList";
import { useLazyQuery } from "@apollo/client";
import AutoCompleteWithNewOption from "components/Shared/Forms/Fields/AutoCompleteWithNewOption";
import filterConsts from "./filterConsts";

function TractForm({ isNewTract, tract, tractValue, setSelectedShapeLayer, control, prefix = "" }) {
  const [stateName, setStateName] = useState(tract.state);

  const [getautoCompleteListBasin, { data: dataAutoCompleteListBasin = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);
  const [getautoCompleteListField, { data: dataAutoCompleteListField = [] }] = useLazyQuery(GET_AUTOCOMPLETE_LIST);
  
  useEffect(() => {
    getautoCompleteListBasin({ variables: { type: "AgreementShapeOwner", data: { key: "basin", inTract: true } } });
    getautoCompleteListField({ variables: { type: "AgreementShapeOwner", data: { key: "field", inTract: true } } });
  }, []);

  const autoCompleteListBasin = React.useMemo(
    () => dataAutoCompleteListBasin?.autoCompleteList || [],
    [dataAutoCompleteListBasin?.autoCompleteList]
  );
  const autoCompleteListField = React.useMemo(
    () => dataAutoCompleteListField?.autoCompleteList || [],
    [dataAutoCompleteListField?.autoCompleteList],
    );
  
  useEffect(() => {
    if (tract.state && tract.state !== stateName) setStateName(tract.state);
  }, [tract.state]);


  const getDependencies = useCallback(
    (deps) => {
      const county = tract.county
        ?.toLowerCase()
        .split(" ")
        .reduce((county, current) => county + " " + upperFirst(current), "");
      const dependency = {
        state: { field: "level1Name.keyword", value: US_STATES_CODES[stateName] },
        county: { field: "level2Name.keyword", value: county?.trim() },
        survey: { field: "level3Name.keyword", value: tract.survey },
        meridian: { field: "level3Name.keyword", value: tract.meridian },
        block: { field: "level4Name.keyword", value: tract.block },
        section: { field: "level5Name.keyword", value: tract.section },
        townshipRange: { field: "level5Name.keyword", value: tract.township && tract.range ? `${tract.township} ${tract.range}` : "" },
        abstract: { field: "level6Name.keyword", value: tract.abstract },
        sectionNTX: { field: "level6Name.keyword", value: tract.section },
      };
      const dependencies = [];
      deps?.forEach((dep) => {
        if (dependency[dep].value) dependencies.push(dependency[dep]);
      });
      return dependencies;
    },
    [tract, stateName]
  );

  const filters = useMemo(() => {
    return {
      state: {field: filterConsts.state.filterField, value: 'State'},
      county: [{field: filterConsts.county.filterField, value: 'County'}, ...getDependencies(filterConsts.county.dependencyArray)],
      meridian: [{field: filterConsts.meridian.filterField, value: 'Meridian'}, ...getDependencies(filterConsts.meridian.dependencyArray)],
      township: [{field: filterConsts.township.filterField, value: 'TownshipRange'}, ...getDependencies(filterConsts.township.dependencyArray)],
      range: [{field: filterConsts.range.filterField, value: 'TownshipRange'}, ...getDependencies(filterConsts.range.dependencyArray)],
  
      section: [{field: filterConsts.section.filterField, value: 'Section'}, ...getDependencies(filterConsts.section.dependencyArray)],
      survey: [{field: filterConsts.survey.filterField, value: 'Survey'}, ...getDependencies(filterConsts.survey.dependencyArray)],
      block: [{field: filterConsts.block.filterField, value: 'Block'}, ...getDependencies(filterConsts.block.dependencyArray)],
      sectiontx: [{field: filterConsts.sectiontx.filterField, value: 'Section'}, ...getDependencies(filterConsts.sectiontx.dependencyArray)],
  
      abstract: [{field: filterConsts.abstract.filterField, value: 'Abstract'}, ...getDependencies(filterConsts.abstract.dependencyArray)],
    }
  }, [tract.state, tract.county, tract.township, tract.range, tract.section, tract.survey, tract.block, tract.sectiontx, tract.abstract])
  
  return (
    <>
      {!isNewTract && <AutoCompleteShapeLayer value={tractValue} shapeType="parcel" setSelectedShapeLayer={setSelectedShapeLayer} />}
      <Controller
        as={TextField}
        id="tractName"
        // style={{ display: isNewTract ? "inherit" : "none" }}
        control={control}
        variant="outlined"
        margin="dense"
        name="tract.tractName"
        label={"Tract Name"}
        InputLabelProps={{ shrink: true }}
        fullWidth
        defaultValue={tract?.tractName || ""}
      />
      <Controller
        control={control}
        name={`${prefix}state`}
        defaultValue={tract?.state || ""}
        render={(props) => (
          <AutoCompleteLandgrid
            {...props}
            value={props.value}
            filterKey={filterConsts.state.filterKey}
            filters={{ field: filterConsts.state.filterField, value: "State" }}
            label="State"
            variant="outlined"
            onChange={(e, value) => {
              props.onChange(value.key);
              setStateName(value.key);
            }}
            autoFocus={false}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}county`}
        id="tractCounty"
        defaultValue={tract?.county || ""}
        render={(props) => (
          <AutoCompleteLandgrid
            value={props.value}
            filterKey={filterConsts.county.filterKey}
            filters={[{ field: filterConsts.county.filterField, value: "County" }, ...getDependencies(filterConsts.county.dependencyArray)]}
            label="County"
            variant="outlined"
            onChange={(e, value) => {
              props.onChange(value.key);
            }}
            autoFocus={false}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}basin`}
        defaultValue={tract?.basin || ""}
        render={({ onChange, value, ref }) => (
          <AutoCompleteWithNewOption
            margin="dense"
            label="Basin"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            options={autoCompleteListBasin}
            value={value}
            onChange={(_, value) => {
              onChange(value?.name ?? "");
            }}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}field`}
        defaultValue={tract?.field || ""}
        render={({ onChange, value, ref }) => (
          <AutoCompleteWithNewOption
            margin="dense"
            label="Field"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            options={autoCompleteListField}
            value={value}
            onChange={(_, value) => {
              onChange(value?.name ?? "");
            }}
          />
        )}
      />

      {!["TX", "Texas"].includes(stateName) && (
        <>
          <Controller
            control={control}
            name={`${prefix}meridian`}
            defaultValue={tract?.meridian || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.meridian.filterKey}
                filters={[{ field: filterConsts.meridian.filterField, value: "Meridian" }, ...getDependencies(filterConsts.meridian.dependencyArray)]}
                label="Meridian"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county}}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}township`}
            defaultValue={tract?.township || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.township.filterKey}
                filters={[{ field: filterConsts.township.filterField, value: "TownshipRange" }, ...getDependencies(filterConsts.township.dependencyArray)]}
                label="Township"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county, meridian: tract.meridian}}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}range`}
            defaultValue={tract?.range || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.range.filterKey}
                compoundValue={tract.township}
                filters={[{ field: filterConsts.range.filterField, value: "TownshipRange" }, ...getDependencies(filterConsts.range.dependencyArray)]}
                label="Range"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county, meridian: tract.meridian}}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}section`}
            defaultValue={tract?.section || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.section.filterKey}
                filters={[
                  { field: filterConsts.section.filterField, value: "Section" },
                  ...getDependencies(filterConsts.section.dependencyArray),
                ]}
                label="Section"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county, meridian: tract.meridian, township: tract.township, range: tract.range}}
              />
            )}
          />
        </>
      )}

      {["TX", "Texas"].includes(stateName) && (
        <>
          <Controller
            control={control}
            name={`${prefix}survey`}
            defaultValue={tract?.survey || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.survey.filterKey}
                filters={[{ field: filterConsts.survey.filterField, value: "Survey" }, ...getDependencies(filterConsts.survey.dependencyArray)]}
                label="Survey"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county}}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}block`}
            defaultValue={tract?.block || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.block.filterKey}
                filters={[{ field: filterConsts.block.filterField, value: "Block" }, ...getDependencies(filterConsts.block.dependencyArray)]}
                label="Block"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county, survey: tract.survey}}
              />
            )}
          />

          <Controller
            control={control}
            name={`${prefix}section`}
            defaultValue={tract?.section || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.section.filterKey}
                filters={[{ field: filterConsts.section.filterField, value: "Section" }, ...getDependencies(filterConsts.section.dependencyArray)]}
                label="Section"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county, survey: tract.survey, block: tract.block}}
              />
            )}
          />

          <Controller
            control={control}
            id="tractAbstract"
            name={`${prefix}abstract`}
            defaultValue={tract?.abstract || ""}
            render={(props) => (
              <AutoCompleteLandgrid
                value={props.value}
                filterKey={filterConsts.abstract.filterKey}
                filters={[
                  { field: filterConsts.abstract.filterField, value: "Abstract" },
                  ...getDependencies(filterConsts.abstract.dependencyArray),
                ]}
                label="Abstract"
                variant="outlined"
                onChange={(e, value) => {
                  props.onChange(value.key);
                }}
                autoFocus={false}
                newOptions
                newOptionFilters={{state: tract.state, county: tract.county, survey: tract.survey, block: tract.block, section: tract.section}}
              />
            )}
          />
        </>
      )}

      <Controller
        as={TextField}
        id="tractDescription"
        control={control}
        variant="outlined"
        margin="dense"
        name={`${prefix}legalDescription`}
        label={"Tract Legal Description"}
        InputLabelProps={{ shrink: true }}
        multiline
        rows={4}
        fullWidth
        defaultValue={tract?.legalDescription || ""}
      />
    </>
  );
}

export default TractForm;
