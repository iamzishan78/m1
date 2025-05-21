import React from 'react';

import { Grid, Card, CardContent, Box, Typography, IconButton, Chip } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import DeleteIcon from '@material-ui/icons/Delete';

import PropTypes from 'prop-types';

const MetadataAutomation = ({ automations, onAutomationChange }) => {
	const handleAutomationChange = automationId => {
		onAutomationChange(automationId);
	};

	return (
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
									<IconButton onClick={() => handleAutomationChange(automation._id)} size="small">
										<DeleteIcon />
									</IconButton>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))
			) : (
				<Box>
					<Typography style={{ color: '#888' }}>Nothing to show. Try creating a new automation</Typography>
				</Box>
			)}
		</Grid>
	);
};

MetadataAutomation.propTypes = {
	automations: PropTypes.array.isRequired,
	onAutomationChange: PropTypes.func.isRequired,
};

export default MetadataAutomation;
