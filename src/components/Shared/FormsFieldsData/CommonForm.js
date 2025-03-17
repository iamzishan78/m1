import React from 'react';
import { Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';

import PropTypes from 'prop-types';

import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import CustomTextField from 'components/Shared/components/Fields/CustomTextField';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';

import { sideDialogController } from 'controllers/sideDialogController';

import StartEndDate from './Fields/StartEndDate';
import CustomDatePicker from '../components/Fields/CustomDatePicker';

function CommonForm({ formSchema, control, watch, dialogKey, error, errors }) {
	const getTextFieldProps = ({ item, watch, error, key }) => {
		const fieldProps = {
			key,
			control,
			watch,
			error,
			fieldConfig: {
				type: item.type,
				size: item.size,
				fullWidth: item.fullWidth,
				multiline: item.multiline,
				variant: item.variant,
				disabled: item.disabled,
				required: item.required,
			},
			fieldAttributes: {
				name: item.name,
				title: item.label,
				defaultValue: item.defaultValue,
				InputProps: item.InputProps,
				isValueOverridden: item.isValueOverridden,
			},
			fieldEvents: {
				onBlur: item.onBlur,
				onChange: item.onChange,
			},
		};

		return fieldProps;
	};

	return (
		<>
			{formSchema.map((item, index) => {
				let renderedField;
				switch (item.renderField) {
					case 'autoComplete':
					case 'autoCompleteNewOption':
						renderedField = (
							<CustomAutoComplete
								key={item.name}
								control={control}
								watch={watch}
								error={error || errors?.[item.name]}
								fieldConfig={{ margin: 'dense', allowNewOptions: item.renderField === 'autoCompleteNewOption' }}
								fieldEvents={{ onChange: item.onChange }}
								fieldAttributes={{
									name: item.name,
									title: item.label,
									label: item.label,
									defaultOptions: item.defaultOptions,
									getOptions: item.getOptions,
									query: item.query,
									variables: item.variables,
									isESSearch: item.isESSearch || false,
								}}
							/>
						);
						break;

					case 'campaigns':
						renderedField = (
							<Grid item xs={12}>
								<h3>{item.label}</h3>
								<Controller
									control={control}
									name={item.name}
									render={({ field }) => (
										<CampaignField
											{...field}
											value={field?.value}
											onChange={values => {
												sideDialogController(dialogKey).updateState({ [item.name]: values });
												field.onChange(values);
											}}
											fullWidth
											targetLabel="Contact"
											simpleChips
										/>
									)}
								/>
							</Grid>
						);
						break;

					case 'associatedDeals':
						renderedField = (
							<Grid item xs={12}>
								<h3>{item.label}</h3>
								<Controller
									control={control}
									name={item.name}
									render={({ field }) => (
										<AssociatedDealField
											{...field}
											onChange={values => {
												sideDialogController(dialogKey).updateState({ [item.name]: values });
												field.onChange(values);
											}}
											value={field.value}
											fullWidth
											targetLabel="Contact"
											simpleChips
										/>
									)}
								/>
							</Grid>
						);
						break;

					case 'radioButton':
					case 'boolean':
						renderedField = (
							<RadioGroup key={JSON.stringify(item)} item={item} control={control} dialogKey={dialogKey} />
						);
						break;

					case 'datePicker':
						renderedField = (
							<CustomDatePicker
								control={control}
								fieldAttributes={{
									name: item?.name,
									value: item?.value,
									title: item?.label,
								}}
								fieldEvents={{
									onChange: item?.onChange,
								}}
								fieldConfig={{
									disabled: item?.disabled,
									variant: 'standard',
								}}
							/>
						);

						break;

					case 'startEndDate':
						renderedField = (
							<StartEndDate item={item} control={control} watch={watch} error={error || errors?.[item.name]} />
						);
						break;

					default: {
						const formattedFieldProps = getTextFieldProps({
							item,
							watch,
							error: error || errors?.[item.name],
							key: index,
						});
						renderedField = <CustomTextField {...formattedFieldProps} />;
						break;
					}
				}

				return <React.Fragment key={item.name}>{renderedField}</React.Fragment>;
			})}
		</>
	);
}

CommonForm.propTypes = {
	control: PropTypes.object.isRequired,
	watch: PropTypes.func.isRequired,
	dialogKey: PropTypes.string.isRequired,
	value: PropTypes.any,
	onChange: PropTypes.func,
	formSchema: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			renderField: PropTypes.string.isRequired,
			label: PropTypes.string,
			autoFocus: PropTypes.bool,
			type: PropTypes.string,
			size: PropTypes.string,
			fullWidth: PropTypes.bool,
			multiline: PropTypes.bool,
			variant: PropTypes.string,
			disabled: PropTypes.bool,
			required: PropTypes.bool,
			margin: PropTypes.string,
			value: PropTypes.any,
			valueType: PropTypes.string,
			inputRef: PropTypes.object,
			placeholder: PropTypes.string,
			InputProps: PropTypes.object,
			InputLabelProps: PropTypes.object,
			isValueOverridden: PropTypes.bool,
			allowEdit: PropTypes.bool,
			onBlur: PropTypes.func,
			onKeyUp: PropTypes.func,
			onChange: PropTypes.func,
			onKeyDown: PropTypes.func,
		})
	).isRequired,
	error: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.bool]),
	errors: PropTypes.object,
};

export default CommonForm;
