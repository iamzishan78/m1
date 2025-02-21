import React, { memo } from 'react';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import AddUnitTractDialog from 'components/Common/TableAddDialog/AddUnitTractDialog';

import { tableController, tableGlobalController } from 'controllers/tableController';

const useStyles = makeStyles(() => ({
	multiSelectionTopBarButtons: {
		margin: '0px 5px',
		fontWeight: '600',
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
}));

function TractPerUnitToolBar({ table, tableKey }) {
	const classes = useStyles();
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'isAllRowsSelected',
		'rowSelection',
		'defaultFilters',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection || {})?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};

	const addTractToUnit = e => {
		const { customLayer } = Controller.getValue('customProps');
		e.stopPropagation();
		tableGlobalController.updateState({
			dialog: {
				type: 'addTractToUnit',
				shapeId: customLayer?._id,
				uAcres: customLayer?.shapeJson?.properties?.uAcres,
				uUnitPricing: customLayer?.shapeJson?.properties?.uUnitPricing,
				uMaxUnitPricing: customLayer?.shapeJson?.properties?.uMaxUnitPricing,
				shapeType: 'Unit',
				selectedRow: null,
			},
		});
		table.resetRowSelection();
	};

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	return (
		<>
			{!isSomethingSelected && (
				<Button color="secondary" className={classes.multiSelectionTopBarButtons} onClick={e => addTractToUnit(e)}>
					+ ADD Tract To UNIT
				</Button>
			)}

			{type === 'addTractToUnit' && (
				<AddUnitTractDialog
					open
					width="450px"
					shapeId={rest?.shapeId}
					shapeType={rest?.shapeType}
					seletedTract={rest?.selectedRow}
					onClose={() => handleCloseDialog()}
				/>
			)}
		</>
	);
}

export default memo(TractPerUnitToolBar);
