import React, { useState } from 'react';

import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

// Components
import ProvisionsTab from 'components/ShapeDetailCard/Agreement/ProvisionsTab';

import { useStyles as customStyles } from '../style';

const useStyles = makeStyles(theme => ({
	root: {
		padding: '10px 25px',
	},
	accordionRoot: {
		borderRadius: '5px',
		margin: '10px 0px',
		boxShadow: 'none',
		'& .MuiButtonBase-root.MuiAccordionSummary-root': {
			maxHeight: '50px',
			minHeight: '50px',
			padding: 0,
		},
		'&.MuiAccordion-root.Mui-expanded': {
			margin: 0,
		},
	},
	accordionHeading: {
		display: 'flex !important',
		alignItems: 'center',
		'& .MuiChip-root': {
			width: 'auto',
			fontSize: '1.2rem',
			fontWeight: 'bold',
			color: '#fff',
			borderRadius: '3px !important',
			backgroundColor: '#18aadd',
		},
	},
	accordionDetails: {
		padding: 0,
	},
}));

export default function RelatedParties({ agreementId, agreementProvisions, standardProvisions }) {
	const classes = useStyles();
	const customClasses = customStyles();
	const [provisionsCount, setPCounts] = useState(0);

	return (
		<div className={classes.root}>
			<Accordion className={classes.accordionRoot} defaultExpanded={true}>
				<AccordionSummary
					expandIcon={
						<IconButton>
							<ExpandMoreIcon fontSize="large" />
						</IconButton>
					}
					onClick={e => {}}
				>
					<Grid container direction="row" justify="space-between" alignItems="center">
						<Grid item xs={6} className={classes.accordionHeading}>
							<Typography variant="h5" className={customClasses.titleText}>
								Provisions & Obligations
							</Typography>
							{provisionsCount >= 0 && <Chip chipUpdate color="info" label={provisionsCount} />}
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<ProvisionsTab
						provisions={agreementProvisions}
						setPCounts={setPCounts}
						standardProvisions={standardProvisions}
						id={agreementId}
					/>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
