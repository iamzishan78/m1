import React from 'react';
import { Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';

import PropTypes from 'prop-types';

import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';

import { sideDialogController } from 'hookstate/sideDialogController';

import AutoCompleteNewOption from './Fields/AutoCompleteNewOption';
import DatePicker from './Fields/DatePicker';
import StartEndDate from './Fields/StartEndDate';

function CommonForm({ formSchema, control, watch, dialogKey, error }) {
	const getFormattedFieldProps = ({ item, watch, error, key }) => {
		const fieldProps = {
			key,
			control,
			watch,
			error,
			fieldConfig: {
				autoFocus: item.autoFocus,
				type: item.type,
				size: item.size,
				fullWidth: item.fullWidth,
				multiline: item.multiline,
				variant: item.variant,
				disabled: item.disabled,
				required: item.required,
				margin: item.margin,
			},
			fieldAttributes: {
				name: item.name,
				value: item.value,
				valueType: item.valueType,
				inputRef: item.inputRef,
				label: item.label,
				placeholder: item.placeholder,
				InputProps: item.InputProps,
				InputLabelProps: item.InputLabelProps,
				isValueOverridden: item.isValueOverridden,
				allowEdit: item.allowEdit,
			},
			fieldEvents: {
				onKeyUp: item.onKeyUp,
				onKeyDown: item.onKeyDowm,
				onBlur: value => item.onBlur(value),
				onChange: value => item.onChange(value),
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
						renderedField = <AutoCompleteComponent item={item} control={control} watch={watch} error={error} />;
						break;

					case 'campaigns':
						renderedField = (
							<Grid item xs={12}>
								<h3>{item.label}</h3>
								<Controller
									control={control}
									name={item.name}
									render={props => (
										<CampaignField
											{...props}
											value={props?.value}
											onChange={values => {
												sideDialogController(dialogKey).updateState({ [item.name]: values });
												props.onChange(values);
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
									render={props => (
										<AssociatedDealField
											{...props}
											onChange={values => {
												sideDialogController(dialogKey).updateState({ [item.name]: values });
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
						);
						break;

					case 'radioButton':
						renderedField = (
							<RadioGroup key={JSON.stringify(item)} item={item} control={control} dialogKey={dialogKey} />
						);
						break;

					case 'autoCompleteNewOption':
						renderedField = <AutoCompleteNewOption item={item} control={control} />;
						break;

					case 'datePicker':
						renderedField = <DatePicker item={item} control={control} />;
						break;

					case 'startEndDate':
						renderedField = <StartEndDate item={item} control={control} watch={watch} error={error} />;
						break;

					default: {
						const formattedFieldProps = getFormattedFieldProps({ item, watch, error, key: index });
						renderedField = <TextFieldComponent {...formattedFieldProps} />;
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
};

export default CommonForm;
