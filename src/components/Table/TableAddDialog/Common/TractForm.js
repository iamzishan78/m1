import React, { useEffect, useState } from "react";

import TextField from "@material-ui/core/TextField";
import { Controller } from "react-hook-form";
import { US_STATES_CODES } from "utils/data";
import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";
import { AutoCompleteLandgrid } from "components/Shared/Forms/Fields/AutoCompleteLandgrid";


function TractForm({ isNewTract, tract, tractValue, setSelectedShapeLayer, control, prefix = '' }) {
  const [state, setState] = useState(tract.state)

  useEffect(() => {
    if (tract.state)
      setState(tract.state)
  }, [tract.state])
  return (
    <>
      {!isNewTract && <AutoCompleteShapeLayer value={tractValue} shapeType='parcel' setSelectedShapeLayer={setSelectedShapeLayer} />}

      <Controller
        control={control}
        name={`${prefix}state`}
        defaultValue={tract?.state || ''}
        render={(props) => (
          <AutoCompleteLandgrid
            value={props.value}
            filterKey='level1Name.keyword'
            filters={{ "field": "level1Type.keyword", "value": "State" }}
            label="State"
            variant="outlined"
            onChange={(value) => { props.onChange(value.key); setState(value.key) }}
            autoFocus={false}
          />
        )}
      />

      <Controller
        control={control}
        name={`${prefix}county`}
        defaultValue={tract?.county || ''}
        render={(props) => (
          <AutoCompleteLandgrid
            value={props.value}
            filterKey='level2Name.keyword'
            filters={[{ "field": "level2Type.keyword", "value": "County" }, { "field": "level1Name.keyword", "value": US_STATES_CODES[state] }]}

            label="County"
            variant="outlined"
            onChange={(value) => { props.onChange(value.key) }}
            autoFocus={false}
          />
        )}
      />

      {!['TX', 'Texas'].includes(state) && <>
        <Controller
          control={control}
          name={`${prefix}meridian`}
          defaultValue={tract?.meridian || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level3Name.keyword'
              filters={{ "field": "level3Type.keyword", "value": "Meridian" }}
              label="Meridian"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />

        <Controller
          control={control}
          name={`${prefix}township`}
          defaultValue={tract?.township || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level5Name.keyword'
              filters={{ "field": "level5Type.keyword", "value": "TownshipRange" }}
              label="Township"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />

        <Controller
          control={control}
          name={`${prefix}range`}
          defaultValue={tract?.range || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level5Name.keyword'
              filters={{ "field": "level5Type.keyword", "value": "TownshipRange" }}
              label="Range"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />

        <Controller
          control={control}
          name={`${prefix}section`}
          defaultValue={tract?.section || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level6Name.keyword'
              filters={{ "field": "level6Type.keyword", "value": "Section" }}
              label="Section"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />
      </>}

      {['TX', 'Texas'].includes(state) && <>
        <Controller
          control={control}
          name={`${prefix}survey`}
          defaultValue={tract?.survey || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level3Name.keyword'
              filters={{ "field": "level3Type.keyword", "value": "Survey" }}
              label="Survey"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />

        <Controller
          control={control}
          name={`${prefix}block`}
          defaultValue={tract?.block || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level4Name.keyword'
              filters={{ "field": "level4Type.keyword", "value": "Block" }}
              label="Block"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />

        <Controller
          control={control}
          name={`${prefix}section`}
          defaultValue={tract?.section || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level5Name.keyword'
              filters={{ "field": "level5Type.keyword", "value": "Section" }}
              label="Section"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />

        <Controller
          control={control}
          name={`${prefix}abstract`}
          defaultValue={tract?.abstract || ''}
          render={(props) => (
            <AutoCompleteLandgrid
              value={props.value}
              filterKey='level6Name.keyword'
              filters={{ "field": "level6Type.keyword", "value": "Abstract" }}
              label="Abstract"
              variant="outlined"
              onChange={(value) => { props.onChange(value.key) }}
              autoFocus={false}
            />
          )}
        />
      </>
      }

      <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}legalDescription`} label={"Tract Legal Description"}
        InputLabelProps={{ shrink: true }} multiline rows={4} fullWidth defaultValue={tract?.legalDescription || ''} />
    </>
  );
}

export default TractForm;
