import React from 'react';
import TextFieldComponent from 'components/Shared/FormsFieldsData/Fields/TextField';
import AutoCompleteComponent from 'components/Shared/FormsFieldsData/Fields/AutoComplete';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import AssociatedDealField from 'components/ContactDetailCard/components/FieldContent/AssociatedDealField';
import RadioGroup from 'components/Shared/FormsFieldsData/Fields/RadioGroup';
import { sideDialogController } from 'hookstate/sideDialogController';
import { Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid';

function CommonForm({ formSchema, control, watch, dialogKey }) {
	return (
		<div style={{ width: '100%', paddingRight: '15px' }}>
			{formSchema.map((item, index) => (
				<React.Fragment key={item.name}>
					{item.renderField === 'autoComplete' ? (
						<AutoCompleteComponent item={item} control={control} />
					) : item.renderField === 'campaignName' ? (
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
					) : (
						<TextFieldComponent key={index} item={item} control={control} watch={watch} />
					)}
				</React.Fragment>
			))}
		</div>
	);
}

export default CommonForm;
