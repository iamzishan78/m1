import React, { useEffect } from 'react';

import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';

// Components

import { GET_RELATED_PARTIES } from 'graphQL/useQueryRelatedParty';

import { useStyles as customStyles } from '../style';
import Fields from './fieldsSection';

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

export default function RelatedParties({ agreementId, agreementDetails }) {
	const classes = useStyles();
	const customClasses = customStyles();

	const [getRelatedParties, { data: relatedPartiesData }] = useLazyQuery(GET_RELATED_PARTIES);

	useEffect(() => {
		if (agreementId) {
			getRelatedParties({
				variables: {
					customLayerId: agreementId,
				},
			});
		}
	}, [agreementId, getRelatedParties]);

	const relatedParties = React.useMemo(() => {
		return relatedPartiesData?.getRelatedParties?.relatedParties.length > 0
			? relatedPartiesData?.getRelatedParties?.relatedParties
			: [];
	}, [relatedPartiesData]);

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
								Related Parties
							</Typography>
							{relatedParties.length > 0 && <Chip color="info" label={relatedParties.length} />}
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<Fields
						relatedParties={relatedParties}
						agreementId={agreementId}
						agreementName={agreementDetails?.agreementName}
						agreementNumber={agreementDetails?.agreementNumber}
						partiesLoading={!relatedPartiesData}
					/>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
