import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import InputModeButton from 'components/MRTTable/Common/EditTable/InputModeButton';
import SaveButton from 'components/MRTTable/Common/EditTable/SaveButton';

import { tableController } from 'hookstate/tableController';

import { getIdFromPath } from 'utils/helper';

import UpdateProperty from './UpdateProperty';

// styles
const useStyles = makeStyles(() => ({
	container: { display: 'flex', flexDirection: 'row' },
}));

function CheckDetailsToolbar({ table, tableKey }) {
	const classes = useStyles();
	let history = useHistory();
	const Controller = tableController(tableKey);
	const { tableStateValues } = Controller.useState(['isAllRowsSelected', 'rowSelection'], 'tableStateValues');
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
					<InputModeButton
						tableKey={tableKey}
						onClick={() => {
							const checkId = getIdFromPath(window.location.pathname);
							history.push(`/revenue/statement/details/${checkId}/line-item`);
						}}
					/>
				)}
				{/* Update property select field */}
				{isSomethingSelected && (
					<div style={{ marginTop: '-10px' }}>
						<UpdateProperty selectedRows={selectedRows} resetRows={table.resetRowSelection} />
					</div>
				)}

				<SaveButton tableKey={tableKey} />
			</div>
		</>
	);
}

CheckDetailsToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default memo(CheckDetailsToolbar);
