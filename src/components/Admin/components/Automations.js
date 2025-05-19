import React, { useState } from 'react';

import {
	Box,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
	Card,
	CardContent,
	IconButton,
	Chip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import DeleteIcon from '@material-ui/icons/Delete';

const moduleOptions = ['Contacts', 'Companies', 'Deals'];
const fieldOptions = {
	Contacts: ['name', 'email', 'phone'],
	Companies: ['name', 'industry', 'size'],
	Deals: ['title', 'value', 'stage'],
};

const Automations = () => {
	const [automations, setAutomations] = useState([]);
	const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
	const [newAutomation, setNewAutomation] = useState({
		sourceModule: '',
		sourceField: '',
		targetModule: '',
		targetField: '',
	});

	const handleCreateAutomation = () => {
		const automation = {
			id: Date.now(),
			...newAutomation,
			active: true,
		};

		setAutomations([...automations, automation]);
		setCreateDialogOpen(false);
		setNewAutomation({
			sourceModule: '',
			sourceField: '',
			targetModule: '',
			targetField: '',
		});
	};

	const handleDeleteAutomation = id => {
		setAutomations(automations.filter(automation => automation.id !== id));
	};

	return (
		<Box py={10} px={3}>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
				<Typography variant="h4">Automations</Typography>
				<Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setCreateDialogOpen(true)}>
					Create Automation
				</Button>
			</Box>

			<Grid container spacing={3}>
				{automations.map(automation => (
					<Grid item xs={12} md={6} key={automation.id}>
						<Card>
							<CardContent>
								<Box display="flex" alignItems="center" justifyContent="space-between">
									<Box flex={1}>
										<Box display="flex" alignItems="center" mb={2}>
											<Chip
												label={`${automation.sourceModule} - ${automation.sourceField}`}
												color="primary"
												variant="outlined"
											/>
											<ArrowRightAltIcon style={{ margin: '0 16px' }} />
											<Chip
												label={`${automation.targetModule} - ${automation.targetField}`}
												color="secondary"
												variant="outlined"
											/>
										</Box>
										<Chip
											label={automation.active ? 'Active' : 'Inactive'}
											color={automation.active ? 'primary' : 'default'}
											size="small"
										/>
									</Box>
									<IconButton onClick={() => handleDeleteAutomation(automation.id)} size="small">
										<DeleteIcon />
									</IconButton>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Create Automation Dialog remains the same */}
			<Dialog open={isCreateDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
				<DialogTitle>Create New Automation</DialogTitle>
				<DialogContent>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel>Source Module</InputLabel>
								<Select
									value={newAutomation.sourceModule}
									onChange={e =>
										setNewAutomation({
											...newAutomation,
											sourceModule: e.target.value,
											sourceField: '',
										})
									}
								>
									{moduleOptions.map(module => (
										<MenuItem key={module} value={module}>
											{module}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{newAutomation.sourceModule && (
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel>Source Field</InputLabel>
									<Select
										value={newAutomation.sourceField}
										onChange={e =>
											setNewAutomation({
												...newAutomation,
												sourceField: e.target.value,
											})
										}
									>
										{fieldOptions[newAutomation.sourceModule]?.map(field => (
											<MenuItem key={field} value={field}>
												{field}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
						)}

						<Grid item xs={12}>
							<FormControl fullWidth>
								<InputLabel>Target Module</InputLabel>
								<Select
									value={newAutomation.targetModule}
									onChange={e =>
										setNewAutomation({
											...newAutomation,
											targetModule: e.target.value,
											targetField: '',
										})
									}
								>
									{moduleOptions.map(module => (
										<MenuItem key={module} value={module}>
											{module}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>

						{newAutomation.targetModule && (
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel>Target Field</InputLabel>
									<Select
										value={newAutomation.targetField}
										onChange={e =>
											setNewAutomation({
												...newAutomation,
												targetField: e.target.value,
											})
										}
									>
										{fieldOptions[newAutomation.targetModule]?.map(field => (
											<MenuItem key={field} value={field}>
												{field}
											</MenuItem>
										))}
									</Select>
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
							!newAutomation.sourceModule ||
							!newAutomation.sourceField ||
							!newAutomation.targetModule ||
							!newAutomation.targetField
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
