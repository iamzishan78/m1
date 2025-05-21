import React, { useState } from 'react';

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
	FormControl,
	Typography,
} from '@material-ui/core';

import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

const FilterAutomationDialog = ({ isOpen, onClose, filters, setFilters, uniqueModules }) => {
	const [status, setStatus] = useState(filters?.status ?? '');
	const [module, setModule] = useState(filters?.module ?? '');

	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>Filter Automations</DialogTitle>
			<DialogContent style={{ overflow: 'hidden' }}>
				<Typography variant="body2" color="textSecondary" style={{ marginBottom: '8px' }}>
					**Filters will be applied on the selected Automation Type
				</Typography>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Status',
									optionArray: [
										{ label: 'Active', value: 'active' },
										{ label: 'Inactive', value: 'inactive' },
									],
									value: status,
								}}
								fieldEvents={{
									onChange: ({ value }) => setStatus(value),
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>

					<Grid item xs={12}>
						<FormControl fullWidth>
							<CustomAutoComplete
								fieldAttributes={{
									label: 'Module',
									optionArray: uniqueModules.map(module => ({ label: module, value: module })),
									value: module,
								}}
								fieldEvents={{
									onChange: ({ value }) => setModule(value),
								}}
								fieldConfig={{
									variant: 'outlined',
									size: 'small',
								}}
							/>
						</FormControl>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						setStatus('');
						setModule('');
					}}
					color="primary"
				>
					Clear Filters
				</Button>
				<Button
					onClick={() => {
						setFilters({ status, module });
						onClose();
					}}
					color="primary"
					variant="contained"
				>
					Apply
				</Button>
			</DialogActions>
		</Dialog>
	);
};

FilterAutomationDialog.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	filters: PropTypes.shape({
		status: PropTypes.string,
		module: PropTypes.string,
	}),
	setFilters: PropTypes.func.isRequired,
	uniqueModules: PropTypes.arrayOf(PropTypes.string),
};

export default FilterAutomationDialog;
