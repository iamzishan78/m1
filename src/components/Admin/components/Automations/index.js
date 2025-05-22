import React, { useState, useEffect } from 'react';

import { Grid, Box, Typography, CircularProgress } from '@material-ui/core';

import { useLazyQuery, useMutation } from '@apollo/client';

import { UPSERT_AUTOMATION } from 'graphQL/useMutationUpsertAutomation';
import { GET_AUTOMATIONS } from 'graphQL/useQueryGetAutomations';

import { globalStateController } from 'stateManagement/globalStateController';

import AutomationHeader from './components/AutomationHeader';
import CreateAutomationDialog from './components/CreateAutomationDialog';
import MetadataAutomation from './components/MetadataAutomation';

const Automations = () => {
	const [getAutomations, { data, loading }] = useLazyQuery(GET_AUTOMATIONS);
	const [upsertAutomation] = useMutation(UPSERT_AUTOMATION, {
		refetchQueries: ['getAutomations'],
		awaitRefetchQueries: true,
	});

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
				if (automation.config?.module && !modulesArr.includes(automation.config?.module)) {
					modulesArr.push(automation.config?.module);
				}
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

	const onAutomationChange = data => {
		upsertAutomation({
			variables: {
				automation: data,
			},
		});
	};

	const renderAutomationComponent = automation => {
		switch (automation?.type) {
			case 'metadataUpdate':
				return <MetadataAutomation automation={automation} onAutomationChange={onAutomationChange} />;
			default:
				return null;
		}
	};

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress color="secondary" size={40} />
			</Box>
		);
	}

	return (
		<Box py={10} px={3} style={{ height: '100vh', overflow: 'hidden' }}>
			<AutomationHeader
				filters={filters}
				setFilters={setFilters}
				selectedType={selectedType}
				uniqueModules={uniqueModules}
				setSelectedType={setSelectedType}
				setCreateDialogOpen={setCreateDialogOpen}
				appliedFiltersCount={Object.values(filters)?.filter(value => value)?.length}
			/>

			<Grid container spacing={3} style={{ height: '88vh', overflow: 'scroll' }}>
				{filteredAutomations.length ? (
					filteredAutomations.map(automation => renderAutomationComponent(automation))
				) : (
					<Box p={3} textAlign="center" width="100%">
						<Typography variant="body1" color="textSecondary">
							Nothing to show. Try creating a new automation
						</Typography>
					</Box>
				)}
			</Grid>

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
