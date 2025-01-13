import React, { useMemo } from 'react';

import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import MRTTable from 'components/MRTTable';
import MultiGridsComponent from 'components/Shared/MultiGridsComponent';

import { detailCardController } from 'hookstate/detailCardController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { paymentGridsInitialData } from 'utils/data';

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
	documentHeader: {
		fontSize: '1.25rem',
		'& svg': {
			transform: 'translate(-4%, 22%)',
		},
	},
}));

const RelatedPayments = () => {
	const classes = useStyles();
	const customClasses = customStyles();
	const agreementDetailState = detailCardController.useState(['customLayer', 'drawer']);
	const tableGlobalState = tableGlobalController.useState(['paymentMultiGrid']);
	const paymentsCount = tableController('RelatedPaymentsTable')?.useState(['data']);
	const agreementDetailsValues = agreementDetailState.stateValues;
	const tableGlobalValues = tableGlobalState.stateValues;
	const paymentMultiGrid = tableGlobalValues.paymentMultiGrid;
	const { paymentId } = paymentMultiGrid || {};

	// override meta for related payments
	const overrideMetaRelatedPayments = useMemo(
		() => ({
			defaultFilters: [{ field: 'shapeObj._id', value: agreementDetailsValues?.customLayer?._id }],
			// customProps: { customLayer: parcelObj }
		}),
		[agreementDetailsValues]
	);

	return (
		<>
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
									Payment Obligations
								</Typography>
								<Chip color="info" label={paymentsCount?.stateValues?.data?.total || 0} />
							</Grid>
						</Grid>
					</AccordionSummary>
					<AccordionDetails className={classes.accordionDetails}>
						<Grid container direction="column" alignItems="center" spacing={4} style={{ display: 'block' }}>
							{agreementDetailsValues?.customLayer?._id && (
								<>
									<MRTTable name="RelatedPaymentsTable" overrideMeta={overrideMetaRelatedPayments} />
									{paymentMultiGrid?.showMultiGrid && (
										<Grid item xs={12} style={{ padding: '35px 0px 0px 0px' }}>
											<MultiGridsComponent
												moduleId={agreementDetailsValues?.customLayer?._id}
												multiGridInitialData={paymentGridsInitialData}
												title="Payment Details"
												paymentId={paymentId}
											/>
										</Grid>
									)}
								</>
							)}
						</Grid>
					</AccordionDetails>
				</Accordion>
			</div>
		</>
	);
};

export default RelatedPayments;
