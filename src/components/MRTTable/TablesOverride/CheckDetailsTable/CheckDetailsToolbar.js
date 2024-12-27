import React, { memo, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import { useApolloClient } from '@apollo/client';
import { merge } from 'lodash';
import PropTypes from 'prop-types';

import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { tableController, tableGlobalController } from 'hookstate/tableController';

import { getIdFromPath } from 'utils/helper';

import UpdateProperty from './UpdateProperty';

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
	const classes = useStyles();
	let history = useHistory();
	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(
		['isAllRowsSelected', 'rowSelection', 'editedData', 'validationErrors'],
		'tableStateValues'
	);
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original) || [];
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const client = useApolloClient();

	const saveable = useMemo(() => {
		const hasEditedData = Object.values(tableStateValues.editedData).some(data => !!data);

		const hasErrors = Object.values(tableStateValues.validationErrors).some(rowErrors =>
			Object.values(rowErrors).some(error => !!error)
		);

		return hasEditedData && !hasErrors;
	}, [tableStateValues.editedData, tableStateValues.validationErrors]);

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

				<ToolbarButton
					label="Save"
					disabled={!saveable}
					onClick={async () => {
						const { data, handleUpdateData } = Controller.getAllValues();

						const rowsToUpdate = Object.entries(tableStateValues.editedData)
							.filter(([, value]) => !!value)
							.map(([key, value]) => {
								const currentRow = data.rows.find(r => r._id === key);

								return merge(currentRow, value);
							});

						Controller.clearEditing();

						try {
							await handleUpdateData(client, rowsToUpdate);
						} catch {
							//
						}

						tableGlobalController.refetch();
					}}
				/>
			</div>
		</>
	);
}

CheckDetailsToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default memo(CheckDetailsToolbar);
