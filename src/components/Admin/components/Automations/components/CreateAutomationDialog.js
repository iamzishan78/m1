import React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, FormControl } from '@material-ui/core';

import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

const moduleOptions = ['Contacts', 'Companies', 'Deals'];
const fieldOptions = {
	Contacts: ['name', 'email', 'phone'],
	Companies: ['name', 'industry', 'size'],
	Deals: ['title', 'value', 'stage'],
};

const CreateAutomationDialog = ({ isOpen, onClose, newAutomation, setNewAutomation, handleCreateAutomation }) => {
	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Create New Automation</DialogTitle>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Source Module',
									optionArray: moduleOptions,
									value: newAutomation.triggerField,
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										setNewAutomation({
											...newAutomation,
											triggerField: value,
											triggerValue: '',
										});
									},
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>

					{newAutomation.triggerField && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<CustomAutoComplete
									fieldAttributes={{
										label: 'Source Field',
										optionArray: fieldOptions[newAutomation.triggerField] || [],
										value: newAutomation.triggerValue,
									}}
									fieldEvents={{
										onChange: ({ value }) => {
											setNewAutomation({
												...newAutomation,
												triggerValue: value,
											});
										},
									}}
									fieldConfig={{
										variant: 'outlined',
										size: 'small',
										disabled: !newAutomation.triggerField,
									}}
								/>
							</FormControl>
						</Grid>
					)}

					<Grid item xs={12}>
						<FormControl fullWidth>
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Target Module',
									optionArray: moduleOptions,
									value: newAutomation.targetModule,
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										setNewAutomation({
											...newAutomation,
											targetModule: value,
											targetKey: '',
										});
									},
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>

					{newAutomation.targetModule && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<CustomAutoComplete
									fieldAttributes={{
										label: 'Target Field',
										optionArray: fieldOptions[newAutomation.targetModule] || [],
										value: newAutomation.targetKey,
									}}
									fieldEvents={{
										onChange: ({ value }) => {
											setNewAutomation({
												...newAutomation,
												targetKey: value,
											});
										},
									}}
									fieldConfig={{
										variant: 'outlined',
										size: 'small',
										disabled: !newAutomation.targetModule,
									}}
								/>
							</FormControl>
						</Grid>
					)}
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button
					onClick={handleCreateAutomation}
					color="primary"
					variant="contained"
					disabled={
						!newAutomation.triggerField ||
						!newAutomation.triggerValue ||
						!newAutomation.targetModule ||
						!newAutomation.targetKey
					}
				>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};

CreateAutomationDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	newAutomation: PropTypes.shape({
		triggerField: PropTypes.string,
		triggerValue: PropTypes.string,
		targetModule: PropTypes.string,
		targetKey: PropTypes.string,
	}),
	setNewAutomation: PropTypes.func.isRequired,
	handleCreateAutomation: PropTypes.func.isRequired,
};

export default CreateAutomationDialog;
