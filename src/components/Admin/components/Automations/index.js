import React, { useState, useEffect } from 'react';

import { Box, CircularProgress } from '@material-ui/core';


import { useLazyQuery } from '@apollo/client';

import { GET_AUTOMATIONS } from 'graphQL/useQueryGetAutomations';

import { globalStateController } from 'stateManagement/globalStateController';

import AutomationHeader from './components/AutomationHeader';
import AutomationsList from './components/AutomationsList';
import CreateAutomationDialog from './components/CreateAutomationDialog';

const Automations = () => {
	const [getAutomations, { data, loading }] = useLazyQuery(GET_AUTOMATIONS);

	const [automations, setAutomations] = useState([]);
	const [uniqueModules, setUniqueModules] = useState([]);
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
	const [selectedType, setSelectedType] = useState({ label: 'Metadata Update', value: 'metadataUpdate' });
	const [filters, setFilters] = useState({ status: '', module: '' });
	const [filteredAutomations, setFilteredAutomations] = useState([]);
	const [newAutomation, setNewAutomation] = useState({
		triggerField: '',
		triggerValue: '',
		targetModule: '',
		targetKey: '',
	});

	useEffect(() => {
		getAutomations({
			variables: {
				userId: globalStateController.getValue('user').mongoId,
				type: selectedType?.value ?? 'metadataUpdate',
			},
		});
	}, []);

	useEffect(() => {
		const automations = data?.getAutomations?.automations || null;
		if (automations) {
			const modulesArr = [];
			automations.forEach(automation => {
				if (automation.config?.module && !modulesArr.includes(automation.config?.module))
					{modulesArr.push(automation.config?.module);}
			});
			setAutomations(automations);
			setFilteredAutomations(automations);
			setUniqueModules(modulesArr);
		}
	}, [data]);

	useEffect(() => {
		const filtered = automations.filter(automation => {
			const statusMatch = !filters.status || (filters.status === 'active' ? automation.isActive : !automation.isActive);
			const moduleMatch = !filters.module || automation.config?.module === filters.module;
			return statusMatch && moduleMatch;
		});
		setFilteredAutomations(filtered);
	}, [filters, automations]);

	const handleCreateAutomation = () => {
		const automation = {
			id: Date.now(),
			...newAutomation,
			active: true,
		};

		setAutomations([...automations, automation]);
		setCreateDialogOpen(false);
		setNewAutomation({
			triggerField: '',
			triggerValue: '',
			targetModule: '',
			targetKey: '',
		});
	};

	const handleDeleteAutomation = id => {
		setAutomations(automations.filter(automation => automation.id !== id));
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress color="secondary" size={40} />
			</Box>
		);
	}

	return (
		<Box py={10} px={3}>
			<AutomationHeader
				filters={filters}
				setFilters={setFilters}
				selectedType={selectedType}
				uniqueModules={uniqueModules}
				setSelectedType={setSelectedType}
				setCreateDialogOpen={setCreateDialogOpen}
				appliedFiltersCount={Object.values(filters)?.filter(value => value)?.length}
			/>

			<AutomationsList filteredAutomations={filteredAutomations} handleDeleteAutomation={handleDeleteAutomation} />

			<CreateAutomationDialog
				isOpen={isCreateDialogOpen}
				onClose={() => setCreateDialogOpen(false)}
				newAutomation={newAutomation}
				setNewAutomation={setNewAutomation}
				handleCreateAutomation={handleCreateAutomation}
			/>
		</Box>
	);
};

export default Automations;
