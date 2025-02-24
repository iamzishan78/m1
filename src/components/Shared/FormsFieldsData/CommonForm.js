import React from 'react'
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';
import { sideDialogController } from 'hookstate/sideDialogController';
import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import UserField from './Fields/UserField';
import DateTimeField from './Fields/DateTimeField';

function CommonForm({ formSchema, control, watch, dialogKey }) {
  return (
    <>
      {formSchema.map((item, index) => (
        <React.Fragment key={item.name}>
          {
            item.renderField === "autoComplete" ? (
              <AutoCompleteComponent
                item={item}
                control={control}
              />
            ) : item.renderField === "owner" ? (
              <Grid item xs={12}>
                <h3>{item.label}</h3>

                <UserField
                  dialogKey={dialogKey}
                  item={item}
                />
              </Grid>
            ) : item.renderField === "dateTime" ? (
              <Grid item xs={12}>
                <h3>{item.label}</h3>

                <DateTimeField
                  dialogKey={dialogKey}
                  item={item}
                />
              </Grid>
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
                        sideDialogController(dialogKey).updateState({ [item.name]: values })
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
                        sideDialogController(dialogKey).updateState({ [item.name]: values })
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
                dialogKey={dialogKey}
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

CommonForm.propTypes = {
  formSchema: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
      renderField: PropTypes.oneOf([
        "autoComplete",
        "campaignName",
        "associatedDeals",
        "radioButton",
      ]).isRequired,
      defaultOptions: PropTypes.array,
      variables: PropTypes.object,
      query: PropTypes.func,
      getOptions: PropTypes.func,
      options: PropTypes.array,
      size: PropTypes.string,
      type: PropTypes.string,
      InputProps: PropTypes.object,
      fullWidth: PropTypes.bool,
      defaultValue: PropTypes.any,
      multiline: PropTypes.bool,
      variant: PropTypes.oneOf(["standard", "outlined", "filled"]),
      isValueOverridden: PropTypes.bool,
      onBlur: PropTypes.func,
      onChange: PropTypes.func,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  control: PropTypes.object.isRequired, // From react-hook-form
  watch: PropTypes.func.isRequired, // Function to watch form values
  dialogKey: PropTypes.string.isRequired, // Key for side dialog state updates
};

export default CommonForm