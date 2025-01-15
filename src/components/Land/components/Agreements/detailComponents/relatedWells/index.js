import React, { useEffect, useMemo, useState } from 'react';

import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import PropTypes from 'prop-types';

import RelatedWellsTable from 'components/Common/RelatedTables/Wells';
import MRTTable from 'components/MRTTable';

import { tableController, tableGlobalController } from 'hookstate/tableController';

import { useStyles as customStyles } from '../style';

const useStyles = makeStyles(() => ({
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

export default function LagalDescription({ uniObj, agreementId }) {
	const classes = useStyles();
	const customClasses = customStyles();
	const { stateValues } = tableController('RelatedWellsTable').useState(['data', 'isLoading']);

	const [totalWels, setTotalWells] = useState(0);

	const {
		stateValues: { tabKey: selectedTab },
	} = tableGlobalController.useState(['tabKey']);

	const RelatedWellsOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Agreement Wells', 'Potential Wells'],
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [{ field: 'shape._id', value: agreementId }],
			customProps: { customLayer: uniObj, shapeType: 'Agreement' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: agreementId },
			},
			customValue: { parentRecord: agreementId },
		}),
		[agreementId]
	);

	useEffect(() => {
		if (!stateValues.data || stateValues.isLoading) {
			return;
		}

		setTotalWells(stateValues.data.total);
	}, [stateValues.data, stateValues.isLoading]);

	return (
		<div className={classes.root}>
			<Accordion className={classes.accordionRoot} defaultExpanded={true}>
				<AccordionSummary
					expandIcon={
						<IconButton>
							<ExpandMoreIcon fontSize="large" />
						</IconButton>
					}
					onClick={() => {}}
				>
					<Grid container direction="row" justify="space-between" alignItems="center">
						<Grid item xs={6} className={classes.accordionHeading}>
							<Typography variant="h5" className={customClasses.titleText}>
								Related Wells
							</Typography>
							<Chip color="info" label={totalWels} />
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<Grid container direction="column" alignItems="center" spacing={4} style={{ display: 'block' }}>
						{uniObj && (
							<Grid item xs={12} style={{ padding: '35px 20px 0px 0px' }}>
								{selectedTab === 0 && (
									<RelatedWellsTable
										id="relatedWellsTable"
										overrideMeta={RelatedWellsOverrideMeta}
										shapeType="Agreement"
										customLayer={uniObj}
									/>
								)}
								{selectedTab === 1 && (
									<MRTTable
										name="PotentialWellsTable"
										overrideMeta={{
											tabLabels: ['Agreement Wells', 'Potential Wells'],
											customProps: {
												customLayer: uniObj,
												shapeType: 'Agreement',
											},
										}}
									/>
								)}
							</Grid>
						)}
					</Grid>
				</AccordionDetails>
			</Accordion>
		</div>
	);
}

LagalDescription.propTypes = {
	uniObj: PropTypes.object,
	agreementId: PropTypes.string.isRequired,
};
