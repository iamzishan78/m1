import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { Box, DialogContent, DialogActions, Button, Grid, FormControl, CircularProgress } from '@material-ui/core';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';
import { GET_METADATA_MODULES } from 'graphQL/useQueryGetMetadataModules';

const CreateAutomationDialog = ({ onClose, setFormLoading, handleCreateAutomation }) => {
	const [moduleOptions, setModuleOptions] = useState([]);

	const [getMetadataModules, { data: metadataModules, loading: fetchingModules }] = useLazyQuery(GET_METADATA_MODULES);

	useEffect(() => {
		getMetadataModules();
	}, []);

	useEffect(() => {
		const modules = metadataModules?.getMetadataModules?.modules.filter(Boolean) || [];
		console.log(modules);
		setModuleOptions(modules);
	}, [metadataModules]);

	useEffect(() => {
		setFormLoading(fetchingModules);
	}, [fetchingModules]);

	return (
		<>
			<DialogContent>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Source Module',
									optionArray: moduleOptions,
									// value: newAutomation.triggerField,
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										//Do something here
									},
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>

					{true && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<CustomAutoComplete
									fieldAttributes={{
										label: 'Source Field',
										// optionArray: fieldOptions[newAutomation.triggerField] || [],
										// value: newAutomation.triggerValue,
									}}
									fieldEvents={{
										onChange: ({ value }) => {
											//Do something here
										},
									}}
									fieldConfig={{
										variant: 'outlined',
										size: 'small',
										// disabled: !newAutomation.triggerField,
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
									// value: newAutomation.targetModule,
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										//Do something here
									},
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>

					{true && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<CustomAutoComplete
									fieldAttributes={{
										label: 'Target Field',
										// optionArray: fieldOptions[newAutomation.targetModule] || [],
										// value: newAutomation.targetKey,
									}}
									fieldEvents={{
										onChange: ({ value }) => {
											//Do something here
										},
									}}
									fieldConfig={{
										variant: 'outlined',
										size: 'small',
										// disabled: !newAutomation.targetModule,
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
					color="primary"
					variant="contained"
					disabled={false}
					onClick={() => {
						handleCreateAutomation();
						onClose();
					}}
				>
					Create
				</Button>
			</DialogActions>
		</>
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
