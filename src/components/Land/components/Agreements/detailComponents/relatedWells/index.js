import { Typography, Accordion, AccordionSummary, AccordionDetails, Grid, Chip, IconButton } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useMemo, useState } from 'react';

import RelatedWellsTable from 'components/Common/RelatedTables/Wells';
import TabButtons from 'components/Shared/TabPanels/TabButtons';
import AssociatedWellsShapeTable from 'components/Table/Wells/AssociatedWellsShapeTable';

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

export default function LagalDescription({ uniObj }) {
	const classes = useStyles();
	const customClasses = customStyles();
	const [selectedWellTab, setWellSelectedTab] = useState(0);
	const tableState = tableController('RelatedWellsTable').useState(['data']).stateValues;

	const WellHeader = ({ selectedWellTab, setWellSelectedTab }) => (
		<TabButtons
			labels={['Agreement Wells', 'Potential Wells']}
			value={selectedWellTab}
			setValue={n => {
				setWellSelectedTab(n);
			}}
		/>
	);

	const RelatedWellsOverrideMeta = useMemo(
		() => ({
			tabLabels: ['Agreement Wells', 'Potential Wells'],
			maxTableHeight: 'calc(50vh - 100px)',
			defaultFilters: [{ field: 'shape._id', value: uniObj?._id }],
			customProps: { customLayer: uniObj, shapeType: 'Agreement' },
			deletedKeys: {
				mainRecord: { key: '_id' },
				parentRecord: { value: uniObj?._id },
			},
			customValue: { parentRecord: uniObj?._id },
			columnReordering: false,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[uniObj?._id]
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
							<Chip color="info" label={tableState?.data?.total} />
						</Grid>
					</Grid>
				</AccordionSummary>
				<AccordionDetails className={classes.accordionDetails}>
					<Grid container direction="column" alignItems="center" spacing={4} style={{ display: 'block' }}>
						{uniObj && (
							<Grid item xs={12} style={{ padding: '35px 20px 0px 0px' }}>
								{selectedWellTab === 0 && (
									<RelatedWellsTable
										id="relatedWellsTable"
										overrideMeta={RelatedWellsOverrideMeta}
										shapeType="Agreement"
										customLayer={uniObj}
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
