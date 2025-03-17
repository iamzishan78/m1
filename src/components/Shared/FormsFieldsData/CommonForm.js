import React from 'react';
import { Controller } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import UserField from './Fields/UserField';
import DateTimeField from './Fields/DateTimeField';

import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import CampaignField from 'components/ContactDetailCard/components/FieldContent/CampaignField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';

import { sideDialogController } from 'stateManagement/sideDialogController';

import AutoCompleteNewOption from './Fields/AutoCompleteNewOption';
import DatePicker from './Fields/DatePicker';
import StartEndDate from './Fields/StartEndDate';

function CommonForm({ formSchema, control, watch, dialogKey, error }) {
	return (
		<>
			{formSchema.map((item, index) => (
				<React.Fragment key={item.name}>
					{item.renderField === 'autoComplete' ? (
						<AutoCompleteComponent item={item} control={control} watch={watch} error={error} />
					) : item.renderField === 'owner' ? (
						<Grid item xs={12}>
							<h3>{item.label}</h3>

							<UserField dialogKey={dialogKey} item={item} />
						</Grid>
					) : item.renderField === 'dateTime' ? (
						<Grid item xs={12}>
							<h3>{item.label}</h3>

							<DateTimeField dialogKey={dialogKey} item={item} />
						</Grid>
					) : item.renderField === 'campaignName' ? (
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
					) : item.renderField === 'associatedDeals' ? (
						<Grid item xs={12}>
							<h3>{item.label}</h3>

							<Controller
								control={control}
								name={item.name}
								render={props => (
									<AssociatedDealField
										{...props}
										onChange={(values, id) => {
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
					) : item.renderField === 'radioButton' ? (
						<RadioGroup key={index} item={item} control={control} dialogKey={dialogKey} />
					) : item.renderField === 'autoCompleteNewOption' ? (
						<AutoCompleteNewOption item={item} control={control} />
					) : item.renderField === 'datePicker' ? (
						<DatePicker item={item} control={control} />
					) : item.renderField === 'startEndDate' ? (
						<StartEndDate item={item} control={control} watch={watch} error={error} />
					) : (
						<TextFieldComponent key={index} item={item} control={control} watch={watch} error={error} />
					)}
				</React.Fragment>
			))}
		</>
	);
}

CommonForm.propTypes = {
	formSchema: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			label: PropTypes.string,
			renderField: PropTypes.oneOf([
				'autoComplete',
				'owner',
				'dateTime',
				'campaignName',
				'associatedDeals',
				'radioButton',
				'autoCompleteNewOption',
				'datePicker',
				'startEndDate',
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
			variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
			isValueOverridden: PropTypes.bool,
			onBlur: PropTypes.func,
			onChange: PropTypes.func,
			disabled: PropTypes.bool,
		})
	).isRequired,
	control: PropTypes.object.isRequired, // From react-hook-form
	watch: PropTypes.func.isRequired, // Function to watch form values
	dialogKey: PropTypes.string.isRequired, // Key for side dialog state updates
	error: PropTypes.bool,
};

export default CommonForm;
