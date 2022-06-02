import React from "react";

import TextField from "@material-ui/core/TextField";
import { Controller } from "react-hook-form";

import AutoCompleteShapeLayer from "components/Shared/Forms/Fields/AutoCompleteShapeLayer";


function TractForm({ tract, tractValue, setSelectedShapeLayer, control, prefix = '' }) {

  return (
    <>
      <AutoCompleteShapeLayer value={tractValue} shapeType='parcel' setSelectedShapeLayer={setSelectedShapeLayer} />

      <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}state`} label={"State"}
        InputLabelProps={{ shrink: true }} fullWidth defaultValue={tract?.state || ''} disabled />

      <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}county`} label={"County"}
        InputLabelProps={{ shrink: true }} fullWidth disabled defaultValue={tract?.county || ''} />

      {tract.state !== 'TX' && <>
        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}meridian`} label={"Meridian"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}township`} label={"Township"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}range`} label={"Range"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}section`} label={"Section"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />
      </>}

      {tract.state === 'TX' && <>
        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}survey`} label={"Survey"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}block`} label={"Block"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}section`} label={"Section"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}abstract`} label={"Abstract"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />

        <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}altSurvey`} label={"Alternate Survey"}
          InputLabelProps={{ shrink: true }} fullWidth disabled />
      </>}

      <Controller as={TextField} control={control} variant="outlined" margin="dense" name={`${prefix}legalDescription`} label={"Tract Legal Description"}
        InputLabelProps={{ shrink: true }} multiline rows={4} fullWidth disabled defaultValue={tract?.legalDescription || ''} />
    </>
  );
}

export default TractForm;
