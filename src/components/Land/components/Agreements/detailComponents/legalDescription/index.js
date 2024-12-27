import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import _ from 'underscore';

import RelatedTractsTable from 'components/Common/RelatedTables/Tracts';
import AgreementLegalDescriptionFields from 'components/Land/components/Agreements/detailComponents/legalDescription/FieldsSection';

import { tableController } from 'hookstate/tableController';

import { useStyles as customStyles } from '../style';

// Components
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
		padding: '30px 18px',
	},
	numberField: {
		'& .MuiOutlinedInput-root': {
			borderRadius: '10px',
		},
		'& input[type=number]': {
			'-moz-appearance': 'textfield',
		},
		'& input[type=number]::-webkit-outer-spin-button': {
			'-webkit-appearance': 'none',
			margin: 0,
		},
		'& input[type=number]::-webkit-inner-spin-button': {
			'-webkit-appearance': 'none',
			margin: 0,
		},
	},
}));

export default function LagalDescription({ agreementDetails, agreementId, uniObj, updateAgreement }) {
	const classes = useStyles();
	const customClasses = customStyles();
	const { reset } = useForm();
	const tableState = tableController('RelatedTractsTable').useState(['data']).stateValues;

	useEffect(() => {
		if (!_.isEmpty(agreementDetails)) {
			reset(agreementDetails);
		}
	}, [reset, agreementDetails]);

	const RelatedTractsOverrideMeta = useMemo(
		() => ({
			tableHeading: 'Related Tracts',
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [{ field: 'shape._id', value: agreementId }],
			customProps: { customLayer: agreementDetails?.customLayer, shapeType: 'Agreement' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: agreementId },
			},
			customValue: { parentRecord: agreementId },
			columnReordering: false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[agreementId]
	);

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
								Legal Description
							</Typography>
							<Chip color="info" label={tableState?.data?.total} />
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<Grid container direction="column" alignItems="center" spacing={4} style={{ display: 'block' }}>
						<Grid item xs={12} style={{ padding: '0px 50px 0px 0px' }}>
							<AgreementLegalDescriptionFields
								agreementDetails={agreementDetails}
								updateAgreement={updateAgreement}
								tractOwners={tableState?.data?.rows}
							/>
						</Grid>
						{uniObj && (
							<Grid item xs={12} style={{ padding: '35px 50px 0px 0px' }}>
								<RelatedTractsTable
									id="relatedTractsTable"
									overrideMeta={RelatedTractsOverrideMeta}
									shapeType="Agreement"
									customLayer={uniObj}
								/>
							</Grid>
						)}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}
