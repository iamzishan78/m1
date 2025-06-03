import React, { useState, useEffect } from 'react';

import { DialogContent, DialogActions, Button, Grid, FormControl } from '@material-ui/core';

import { useLazyQuery } from '@apollo/client';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';
import { GET_METADATA_MODULES } from 'graphQL/useQueryGetMetadataModules';

import DynamicMetadataField from './DynamicMetadataField';

const CreateMetaDataAutomationDialog = ({ onClose, setFormLoading, handleCreateAutomation, automation }) => {
	const [moduleOptions, setModuleOptions] = useState([]);
	const [selectedModule, setSelectedModule] = useState(automation?.targetModule || '');
	const [selectedTriggerField, setSelectedTriggerField] = useState(automation?.triggerField || '');
	const [selectedTargetField, setSelectedTargetField] = useState(automation?.targetKey || '');
	const [metadataOptions, setMetadataOptions] = useState([]);
	const [triggerValue, setTriggerValue] = useState(automation?.triggerValue || '');
	const [targetValue, setTargetValue] = useState('');

	const [getMetadataModules, { data: metadataModules, loading: fetchingModules }] = useLazyQuery(GET_METADATA_MODULES);
	const [getMetaData, { data: moduleMetadata, loading: fetchingMetadata }] = useLazyQuery(GET_META_DATA);

	useEffect(() => {
		getMetadataModules();
	}, []);

	useEffect(() => {
		const modules = metadataModules?.getMetadataModules?.modules.filter(Boolean) || [];
		setModuleOptions(modules);
	}, [metadataModules]);

	useEffect(() => {
		setFormLoading(fetchingModules || fetchingMetadata);
	}, [fetchingModules, fetchingMetadata]);

	useEffect(() => {
		if (selectedModule) {
			getMetaData({
				variables: {
					category: selectedModule,
				},
			});
		}
	}, [selectedModule]);

	useEffect(() => {
		if (moduleMetadata?.getMetaData?.metaData) {
			setMetadataOptions(moduleMetadata?.getMetaData?.metaData || []);
		}
	}, [moduleMetadata]);

	return (
		<>
			<DialogContent style={{ overflow: 'visible' }}>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Source Module',
									optionArray: moduleOptions,
									value: selectedModule,
								}}
								fieldEvents={{
									onChange: ({ value }) => {
										setSelectedModule(value);
										setSelectedTriggerField('');
									},
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>

					{selectedModule && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<CustomAutoComplete
									fieldAttributes={{
										label: 'Trigger Field',
										optionArray: metadataOptions,
										value: selectedTriggerField,
									}}
									fieldEvents={{
										onChange: ({ valueObj }) => {
											setSelectedTriggerField(valueObj);
											setTriggerValue('');
										},
									}}
									fieldConfig={{
										variant: 'outlined',
										size: 'small',
										disabled: !selectedModule,
									}}
								/>
							</FormControl>
						</Grid>
					)}

					{selectedTriggerField && (
						<Grid item xs={12}>
							<DynamicMetadataField
								selectedField={selectedTriggerField}
								value={triggerValue}
								onChange={value => setTriggerValue(value)}
							/>
						</Grid>
					)}

					{selectedTriggerField && (
						<Grid item xs={12}>
							<FormControl fullWidth>
								<CustomAutoComplete
									style={{ borderRadius: '4px' }}
									fieldAttributes={{
										label: 'Target Field',
										optionArray: metadataOptions.filter(({ _id }) => _id !== selectedTriggerField?._id),
										value: selectedTargetField,
									}}
									fieldEvents={{
										onChange: ({ valueObj }) => {
											setSelectedTargetField(valueObj);
											setTargetValue('');
										},
									}}
									fieldConfig={{
										variant: 'outlined',
										size: 'small',
										disabled: !selectedTriggerField,
									}}
								/>
							</FormControl>
						</Grid>
					)}

					{selectedTargetField && (
						<Grid item xs={12}>
							<DynamicMetadataField
								selectedField={selectedTargetField}
								value={targetValue}
								onChange={value => setTargetValue(value)}
							/>
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
					disabled={!selectedModule || !selectedTriggerField || !triggerValue || !selectedTargetField || !targetValue}
					onClick={() => {
						handleCreateAutomation({
							config: {
								module: selectedModule,
								triggerField: selectedTriggerField.esKey,
								triggerValue: triggerValue,
								triggerLabel: selectedTriggerField.label,
								targetField: selectedTargetField.esKey,
								targetValue: targetValue,
								targetLabel: selectedTargetField.label,
							},
						});
						onClose();
					}}
				>
					Create
				</Button>
			</DialogActions>
		</>
	);
};

CreateMetaDataAutomationDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	automation: PropTypes.shape({
		triggerField: PropTypes.string,
		triggerValue: PropTypes.string,
		targetModule: PropTypes.string,
		targetKey: PropTypes.string,
	}),
	setFormLoading: PropTypes.func.isRequired,
	handleCreateAutomation: PropTypes.func.isRequired,
};

export default CreateMetaDataAutomationDialog;
