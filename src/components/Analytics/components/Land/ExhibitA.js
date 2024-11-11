import { Grid, makeStyles } from '@material-ui/core';
import MRTTable from 'components/MRTTable';
import { globalStateController } from 'hookstate/globalStateController';
import { tableController } from 'hookstate/tableController';
import React, { useEffect, useState } from 'react';

const TableKey = 'ExhibitATable';

const filterColumnsHeader = [
	{
		label: 'Agreement Type',
		name: 'shape.shapeJson.properties.agreementType.keyword',
	},
	{
		label: 'State',
		name: 'parcel.shapeJson.properties.originalProperties.State.keyword',
	},
	{
		label: 'County',
		name: 'parcel.shapeJson.properties.originalProperties.County.keyword',
	},
	{
		label: 'Internal Company',
		name: 'shape.shapeJson.properties.internalCompany.keyword',
	},
	{
		label: 'Prospect',
		name: 'shape.shapeJson.properties.prospectID.keyword',
	},
	{
		label: 'Acquisition',
		name: 'shape.shapeJson.properties.acquisitionID.keyword',
	},
];

const useStyles = makeStyles(theme => ({
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

const FilterComp = ({ filterColumn }) => {
	const { stateValues } = tableController(TableKey).useState(['TableSchema', 'mrtTableRef', 'filters']);
	const columnSchema = stateValues.TableSchema?.find(s => s.name === filterColumn.name);

	const [value, setValue] = useState('');

	useEffect(() => {
		const filter = stateValues.filters.find(f => f.field === columnSchema?.id || f.field === columnSchema?.name);

		if (!filter) return setValue('');

		setValue(filter.value);
	}, [columnSchema?.id, columnSchema?.name, stateValues.filters]);

	const Comp = columnSchema?.SingleSelect;

	if (!Comp) return null;

	const column = stateValues.mrtTableRef?.getColumn?.(columnSchema?.id);

	if (!column) return null;

	return <Comp column={column} _value={value} isCustom />;
};

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
						{filterColumnsHeader.map((filterColumn, index) => (
							<Grid item xs={12} md={2}>
								<FilterComp key={index} filterColumn={filterColumn} />
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
