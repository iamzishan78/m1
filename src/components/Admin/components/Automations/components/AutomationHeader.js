import React, { useState } from 'react';

import { Box, Button, FormControl, IconButton, Badge } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import FilterListIcon from '@material-ui/icons/FilterList';

import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import FilterAutomationDialog from './FilterAutomationDialog';

const automationTypes = [{ label: 'Metadata Update', value: 'metadataUpdate' }];

const AutomationHeader = ({
	selectedType,
	setSelectedType,
	setCreateDialogOpen,
	appliedFiltersCount,
	filters,
	setFilters,
	uniqueModules,
}) => {
	const [isFilterDialogOpen, setFilterDialogOpen] = useState(false);

	return (
		<Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
			<FormControl style={{ minWidth: 300 }}>
				<CustomAutoComplete
					fieldAttributes={{
						label: 'Automation Type',
						optionArray: automationTypes,
						value: selectedType?.value ?? null,
					}}
					fieldEvents={{
						onChange: ({ value }) => {
							setSelectedType(automationTypes.find(type => type.value === value));
						},
					}}
					fieldConfig={{
						variant: 'outlined',
					}}
				/>
			</FormControl>
			<Box display="flex" alignItems="center" style={{ marginRight: '12px' }}>
				<Button
					variant="contained"
					color="primary"
					style={{ marginRight: '3em' }}
					startIcon={<AddIcon />}
					onClick={() => setCreateDialogOpen(true)}
				>
					Create Automation
				</Button>
				<IconButton size="small" style={{ backgroundColor: '#E3F2FD' }} onClick={() => setFilterDialogOpen(true)}>
					<Badge badgeContent={appliedFiltersCount} color="primary">
						<FilterListIcon />
					</Badge>
				</IconButton>
			</Box>
			<FilterAutomationDialog
				isOpen={isFilterDialogOpen}
				onClose={() => setFilterDialogOpen(false)}
				filters={filters}
				setFilters={setFilters}
				uniqueModules={uniqueModules}
			/>
		</Box>
	);
};

AutomationHeader.propTypes = {
	selectedType: PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.string,
	}),
	setSelectedType: PropTypes.func.isRequired,
	setCreateDialogOpen: PropTypes.func.isRequired,
	appliedFiltersCount: PropTypes.number,
	filters: PropTypes.shape({
		status: PropTypes.string,
		module: PropTypes.string,
	}),
	setFilters: PropTypes.func.isRequired,
	uniqueModules: PropTypes.arrayOf(PropTypes.string),
};

export default AutomationHeader;
