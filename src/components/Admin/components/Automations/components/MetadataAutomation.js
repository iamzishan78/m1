import React from 'react';


import { Grid, Card, CardContent, Box, Typography, IconButton, Switch, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import TargetIcon from '@material-ui/icons/Flag';
import TriggerIcon from '@material-ui/icons/PlayArrow';
import AutomationIcon from '@material-ui/icons/Settings';

import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
	card: {
		height: '100%',
		'&:hover': {
			boxShadow: theme.shadows[4],
		},
	},
	cardContent: {
		height: '100%',
		padding: theme.spacing(2),
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: theme.spacing(2),
	},
	icon: {
		marginRight: theme.spacing(3),
		color: theme.palette.primary.main,
	},
	title: {
		fontWeight: 500,
	},
	section: {
		marginBottom: theme.spacing(2),
		padding: theme.spacing(1.5),
		backgroundColor: theme.palette.background.default,
		borderRadius: theme.shape.borderRadius,
	},
	sectionTitle: {
		display: 'flex',
		alignItems: 'center',
		marginBottom: theme.spacing(1),
		color: theme.palette.text.secondary,
		fontSize: '0.875rem',
	},
	sectionIcon: {
		fontSize: '1rem',
		marginRight: theme.spacing(1),
	},
	value: {
		fontWeight: 500,
		color: theme.palette.text.primary,
	},
	footer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginTop: theme.spacing(2),
	},
}));

const MetadataAutomation = ({ automations, onAutomationChange }) => {
	const classes = useStyles();

	const handleAutomationChange = automationId => {
		onAutomationChange(automationId);
	};

	return (
		<Grid container spacing={3}>
			{automations?.length ? (
				automations.map(automation => (
					<Grid item xs={12} md={6} key={automation._id}>
						<Card className={classes.card}>
							<CardContent className={classes.cardContent}>
								{/* Header */}
								<Box className={classes.header}>
									<Box display="flex" justifyContent="center" alignItems="center">
										<AutomationIcon className={classes.icon} />
										<Typography variant="h6" className={classes.title}>
											{`Module: ${automation?.config?.module}`}
										</Typography>
										<Typography
											variant="h6"
											className={classes.title}
											style={{ marginRight: '12px', marginLeft: '12px' }}
										>
											{'|'}
										</Typography>
										<Typography className={classes.title}>{'Metadata Update'}</Typography>
									</Box>

									<IconButton onClick={() => handleAutomationChange(automation._id)} size="small">
										<DeleteIcon />
									</IconButton>
								</Box>

								{/* Trigger Section */}
								<Box className={classes.section}>
									<Typography className={classes.sectionTitle}>
										<TriggerIcon className={classes.sectionIcon} />
										Trigger Condition
									</Typography>
									<Typography className={classes.value}>
										{automation?.config?.triggerField}: {automation?.config?.triggerValue}
									</Typography>
								</Box>

								{/* Target Section */}
								<Box className={classes.section}>
									<Typography className={classes.sectionTitle}>
										<TargetIcon className={classes.sectionIcon} />
										Target Action
									</Typography>
									<Typography className={classes.value}>
										{automation?.config?.targetField}: {automation?.config?.targetValue}
									</Typography>
								</Box>

								{/* Footer */}
								<Box className={classes.footer}>
									<div>
										<Typography variant="span" color="textSecondary">
											{'Status: '}
										</Typography>
										<Typography variant="p" style={{ fontSize: '1.25em', fontWeight: '500' }}>
											{automation.isActive ? 'Active' : 'Disabled'}
										</Typography>
									</div>
									<Switch checked={automation.isActive} color="primary" size="small" />
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))
			) : (
				<Box p={3} textAlign="center" width="100%">
					<Typography variant="body1" color="textSecondary">
						Nothing to show. Try creating a new automation
					</Typography>
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
