import React, { useState, useEffect } from 'react';

import { Grid, Box, Typography, CircularProgress, Dialog, DialogTitle } from '@material-ui/core';

import { useLazyQuery, useMutation } from '@apollo/client';

import { UPSERT_AUTOMATION } from 'graphQL/useMutationUpsertAutomation';
import { GET_AUTOMATIONS } from 'graphQL/useQueryGetAutomations';

import { globalStateController } from 'stateManagement/globalStateController';

import AutomationHeader from './components/AutomationHeader';
import CreateMetadataAutomation from './components/CreateMetaDataAutomationDialog';
import MetadataAutomation from './components/MetadataAutomation';

const Automations = () => {
	const [automations, setAutomations] = useState([]);
	const [uniqueModules, setUniqueModules] = useState([]);
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
	const [selectedType, setSelectedType] = useState({ label: 'Metadata Update', value: 'metadataUpdate' });
	const [filters, setFilters] = useState({ status: '', module: '' });
	const [filteredAutomations, setFilteredAutomations] = useState([]);
	const [formLoading, setFormLoading] = useState(false);

	const [getAutomations, { data: automationList, loading }] = useLazyQuery(GET_AUTOMATIONS);
	const [upsertAutomation] = useMutation(UPSERT_AUTOMATION, {
		refetchQueries: ['getAutomations'],
		awaitRefetchQueries: true,
	});

	useEffect(() => {
		getAutomations({
			variables: {
				userId: globalStateController.getValue('user').mongoId,
				type: selectedType?.value ?? 'metadataUpdate',
			},
		});
	}, [selectedType?.value]);

	useEffect(() => {
		const automations = automationList?.getAutomations?.automations || null;
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
	}, [automationList]);

	useEffect(() => {
		const filtered = automations.filter(automation => {
			const statusMatch = !filters.status || (filters.status === 'active' ? automation.isActive : !automation.isActive);
			const moduleMatch = !filters.module || automation.config?.module === filters.module;
			return statusMatch && moduleMatch;
		});
		setFilteredAutomations(filtered);
	}, [filters, automations]);

	const onAutomationChange = data => {
		console.log({ data });
		// upsertAutomation({
		// 	variables: {
		// 		automation: data,
		// 	},
		// });
	};

	const renderAutomationCard = automation => {
		switch (automation?.type) {
			case 'metadataUpdate':
				return <MetadataAutomation automation={automation} onAutomationChange={onAutomationChange} />;
			default:
				return null;
		}
	};

	const renderCreateAutomationForm = type => {
		switch (type) {
			case 'metadataUpdate':
				return (
					<CreateMetadataAutomation
						onClose={() => setCreateDialogOpen(false)}
						setFormLoading={setFormLoading}
						handleCreateAutomation={onAutomationChange}
					/>
				);
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
			{/* HEADER SECTION*/}
			<AutomationHeader
				filters={filters}
				setFilters={setFilters}
				selectedType={selectedType}
				uniqueModules={uniqueModules}
				setSelectedType={setSelectedType}
				setCreateDialogOpen={setCreateDialogOpen}
				appliedFiltersCount={Object.values(filters)?.filter(value => value)?.length}
			/>

			{/* CARD SECTION */}
			<Grid container spacing={3} style={{ height: '88vh', overflow: 'scroll' }}>
				{filteredAutomations.length ? (
					filteredAutomations.map(automation => renderAutomationCard(automation))
				) : (
					<Box p={3} textAlign="center" width="100%">
						<Typography variant="body1" color="textSecondary">
							Nothing to show. Try creating a new automation
						</Typography>
					</Box>
				)}
			</Grid>

			{/* CREATION DIALOG */}
			<Dialog open={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} fullWidth>
				<DialogTitle>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Box>
							<Typography variant="h6" style={{ fontSize: '1.25em', fontWeight: '800', marginRight: '12px' }}>
								{'Create New Automation'}
							</Typography>
							<Typography style={{ fontSize: '0.75em' }}>{`(Type: ${selectedType.label})`}</Typography>
						</Box>

						{formLoading && <CircularProgress color="secondary" size={40} />}
					</Box>
				</DialogTitle>
				{renderCreateAutomationForm(selectedType.value)}
			</Dialog>
		</Box>
	);
};

export default Automations;
