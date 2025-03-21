import React, { useEffect } from 'react';

import { Grid, makeStyles } from '@material-ui/core';

import MRTTable from 'components/MRTTable';
import MRTFilterComponent from 'components/MRTTable/Common/MRTFilterComponent';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableController } from 'stateManagement/tableController';

const TableKey = 'ExhibitATable';

const filterColumnsHeader = [
	{
		label: 'Agreement Type',
		name: 'shape.shapeJson.properties.agreementType',
	},
	{
		label: 'State',
		name: 'parcel.shapeJson.properties.originalProperties.State',
	},
	{
		label: 'County',
		name: 'parcel.shapeJson.properties.originalProperties.County',
	},
	{
		label: 'Internal Company',
		name: 'shape.shapeJson.properties.internalCompany',
	},
	{
		label: 'Prospect',
		name: 'shape.shapeJson.properties.prospectID',
	},
	{
		label: 'Acquisition',
		name: 'shape.shapeJson.properties.acquisitionID',
	},
];

const useStyles = makeStyles(() => ({
	actionBar: {
		display: 'flex',
		alignItems: 'center',
		backgroundColor: '#f7f7f7',
		width: '100%',
		minHeight: '65px',
		marginBottom: 10,

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
		},
	},
}));

const ExhibitA = () => {
	const { stateValues } = globalStateController.useState(['globalSearch']);

	const classes = useStyles();

	useEffect(() => {
		tableController(TableKey).setGlobalFilter(stateValues.globalSearch);
	}, [stateValues.globalSearch]);

	return (
		<>
			<div className={classes.actionBar}>
				<Grid container direction="row" display="flex" alignItems="center" spacing={3} style={{ padding: '0px 36px' }}>
					<Grid container alignItems="center" spacing={2}>
						{filterColumnsHeader.map(filterColumn => (
							<Grid key={filterColumn.name} item xs={12} md={2}>
								<MRTFilterComponent tableKey={TableKey} filterColumn={filterColumn} />
							</Grid>
						))}
					</Grid>
				</Grid>
			</div>
			<div>
				<MRTTable name={TableKey} />;
			</div>
		</>
	);
};

export default ExhibitA;
