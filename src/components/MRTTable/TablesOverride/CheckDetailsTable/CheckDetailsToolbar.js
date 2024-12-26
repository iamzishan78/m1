import React, { memo } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { tableController } from 'hookstate/tableController';
import { useHistory } from 'react-router-dom';
import UpdateProperty from './UpdateProperty';
import { getIdFromPath } from 'utils/helper';

// styles
const useStyles = makeStyles(() => ({
	container: { display: 'flex', flexDirection: 'row' },
	selectTopBarButtons: {
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff !important',
		fontWeight: '600',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff !important',
		},
	},
}));

function CheckDetailsToolbar({ table, tableKey }) {
	// initials
	const classes = useStyles();
	let history = useHistory();
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['isAllRowsSelected', 'rowSelection', 'tableStateValues']);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original) || [];
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	return (
		<>
			<div className={classes.container}>
				<h3 style={{ position: 'absolute', left: 10, margin: '5px' }}>Check Details</h3>
				{/* Add To Deal Button */}
				{!isSomethingSelected && (
					<Button
						color="secondary"
						startIcon={<></>}
						className={classes.selectTopBarButtons}
						disabled={isSomethingSelected}
						onClick={() => {
							const checkId = getIdFromPath(window.location.pathname);
							history.push(`/revenue/statement/details/${checkId}/line-item`);
						}}
					>
						INPUT MODE
					</Button>
				)}
				{/* Update property select field */}
				{isSomethingSelected && (
					<div style={{ marginTop: '-10px' }}>
						<UpdateProperty selectedRows={selectedRows} resetRows={table.resetRowSelection} />
					</div>
				)}
			</div>
		</>
	);
}

export default memo(CheckDetailsToolbar);
