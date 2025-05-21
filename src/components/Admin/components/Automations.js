import React, { useState, useEffect } from 'react';

import {
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	Grid,
	Card,
	CardContent,
	IconButton,
	Chip,
	CircularProgress,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import DeleteIcon from '@material-ui/icons/Delete';

import { useLazyQuery } from '@apollo/client';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { GET_AUTOMATIONS } from 'graphQL/useQueryGetAutomations';

import { globalStateController } from 'stateManagement/globalStateController';

const moduleOptions = ['Contacts', 'Companies', 'Deals'];
const fieldOptions = {
	Contacts: ['name', 'email', 'phone'],
	Companies: ['name', 'industry', 'size'],
	Deals: ['title', 'value', 'stage'],
};

const Automations = () => {
	const [getAutomations, { data, loading }] = useLazyQuery(GET_AUTOMATIONS);

	const [automations, setAutomations] = useState([]);
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
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
				type: 'metadataUpdate',
			},
		});
	}, []);

	useEffect(() => {
		console.log({ data });
		if (data?.getAutomations?.automations) {
			setAutomations(data.getAutomations.automations);
		}
	}, [data]);

	if (loading) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
				<CircularProgress color="secondary" size={40} />
			</Box>
		);
	}

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

	return (
		<Box py={10} px={3}>
			<Box display="flex" justifyContent="flex-end" alignItems="center" mb={4}>
				<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
					Create Automation
				</Button>
			</Box>

			<Grid container spacing={3}>
				{automations?.length ? (
					automations.map(automation => (
						<Grid item xs={12} md={6} key={automation._id}>
							<Card>
								<CardContent>
									<Box display="flex" alignItems="center" justifyContent="space-between">
										<Box flex={1}>
											<Box display="flex" alignItems="center" mb={2}>
												<Chip
													label={`${automation?.config?.triggerField} ==> ${automation?.config?.triggerValue}`}
													color="primary"
													variant="outlined"
												/>
												<ArrowRightAltIcon style={{ margin: '0 16px' }} />
												<Chip
													label={`${automation?.config?.targetField} ==> ${automation?.config?.targetValue}`}
													color="secondary"
													variant="outlined"
												/>
											</Box>
											<Chip
												label={automation.isActive ? 'Active' : 'Inactive'}
												color={automation.isActive ? 'primary' : 'default'}
												size="small"
											/>
										</Box>
										<IconButton onClick={() => handleDeleteAutomation(automation._id)} size="small">
											<DeleteIcon />
										</IconButton>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))
				) : (
					<Box>
						<Typography style={{ color: '#888' }}>You haven’t defined any automation yet.</Typography>
					</Box>
				)}
			</Grid>

			{/* Create Automation Dialog remains the same */}
			<Dialog open={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
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
					<Button onClick={() => setCreateDialogOpen(false)} color="primary">
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
		</Box>
	);
};

export default Automations;
