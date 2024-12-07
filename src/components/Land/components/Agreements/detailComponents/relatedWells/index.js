import React, { useState, useEffect } from 'react';
import _ from 'underscore';
import { useForm } from 'react-hook-form';
import { makeStyles } from '@material-ui/styles';
import {
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Grid,
	Chip,
	IconButton,
	TextField,
} from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { useStyles as customStyles } from '../style';

import { copy } from 'components/Shared/functions';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import AgreementOwnersTractsTable from 'components/Table/Agreement/AgreementOwnersTractsTable';
import ShapeWellInterestTable from 'components/Table/Shape/ShapeWellInterestTable';
import AssociatedWellsShapeTable from 'components/Table/Wells/AssociatedWellsShapeTable';

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

export default function LagalDescription({ uniObj, shapeSummaryDetails }) {
	const classes = useStyles();
	const customClasses = customStyles();
	const [selectedWellTab, setWellSelectedTab] = useState(0);

	const WellHeader = ({ selectedWellTab, setWellSelectedTab }) => (
		<TabButtons
			labels={['Agreement Wells', 'Potential Wells']}
			value={selectedWellTab}
			setValue={n => {
				setWellSelectedTab(n);
			}}
		/>
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
								Related Wells
							</Typography>
							<Chip color="info" label={shapeSummaryDetails?.shapeWells} />
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<Grid container direction="column" alignItems="center" spacing={4} style={{ display: 'block' }}>
						{uniObj && (
							<Grid item xs={12} style={{ padding: '35px 20px 0px 0px' }}>
								{selectedWellTab === 0 && (
									<ShapeWellInterestTable
										customLayer={uniObj}
										shapeType="Agreement"
										parent="associatedWellsPerUnits"
										targetLabel="well"
										header={<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />}
										showTracks
										dense
										portal={'#agreementDetailsDrawer'}
									/>
								)}
								{selectedWellTab === 1 && (
									<AssociatedWellsShapeTable
										customLayer={uniObj}
										shapeType="Agreement"
										parent="associatedWellsPerUnits"
										targetLabel="well"
										header={<WellHeader selectedWellTab={selectedWellTab} setWellSelectedTab={setWellSelectedTab} />}
										showTracks
										setSelectedTab={setWellSelectedTab}
										dense
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
