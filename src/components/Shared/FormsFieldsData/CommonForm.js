import React from 'react'
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';
import { sideDialogController } from 'hookstate/sideDialogController';
import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';

function CommonForm({ FormJson, selectedRow = {}, control, reset, getValues, setValue, watch }) {

  return (
    <>
      {FormJson(getValues, setValue).map((item, index) => (
        <React.Fragment key={index}>
          {
            item.renderField === "autoComplete" ? (
              <AutoCompleteComponent
                key={index}
                item={item}
                control={control}
              />
            ) : item.renderField === "campaignName" ? (
              <Grid item xs={12}>
                <h3>{item.label}</h3>

                <Controller
                  control={control}
                  name={item.name}
                  render={props => (
                    <CampaignNameField
                      {...props}
                      value={props?.value}
                      onChange={(values, id) => {
                        sideDialogController.updateState({ [item.name]: values })
                        props.onChange(values);
                      }}
                      fullWidth
                      targetLabel="Contact"
                      simpleChips
                    />
                  )}
                />
              </Grid>
            ) : item.renderField === "associatedDeals" ? (
              <Grid item xs={12}>
                <h3>{item.label}</h3>

                <Controller
                  control={control}
                  name={item.name}
                  render={props => (
                    <AssociatedDealField
                      {...props}
                      onChange={(values, id) => {
                        sideDialogController.updateState({ [item.name]: values })
                        props.onChange(values);
                      }}
                      value={props.value}
                      fullWidth
                      targetLabel="Contact"
                      simpleChips
                    />
                  )}
                />
              </Grid>
            ) : item.renderField === "radioButton" ? (
              <RadioGroup
                key={index}
                item={item}
                control={control}
              />
            ) : (
              <TextFieldComponent
                key={index}
                item={item}
                control={control}
                watch={watch}
              />
            )
          }
        </React.Fragment>
      ))}
    </>
  )
}

export default CommonForm