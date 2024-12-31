import React, { memo } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { ADD_MULTI_WELLINTEREST_TO_SHAPE } from 'graphQL/useMutationAddMultiWellInterestToShape';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

function PotentialWellToolbar({ tableKey, table }) {
	const [addMultiWellInterestToShape] = useMutation(ADD_MULTI_WELLINTEREST_TO_SHAPE, {
		onCompleted: () => {
			tableController(tableKey).updateState({
				isLoading: false,
				isFetching: false,
			});

			tableGlobalController.setSelectedTab(0);
		},
		refetchQueries: ['getESPaginatedList', 'getESSimpleSearch', 'getESFilterList', 'getShapeSummaryDetails'],
		awaitRefetchQueries: true,
	});

	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['rowSelection', 'customProps']);
	const tableStateValues = tableState.stateValues;
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);

	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;

	const shapeType = tableStateValues.customProps?.shapeType;

	const addWellsToShape = () => {
		const customLayer = tableStateValues.customProps?.customLayer;

		table.resetRowSelection();
		tableController(tableKey).updateState({
			isFetching: true,
		});

		const user = globalStateController.getValue('user');

		addMultiWellInterestToShape({
			variables: {
				wells: selectedRows,
				shapeId: customLayer._id,
				shapeType: shapeType,
				userId: user.mongoId,
			},
		});
	};

	return (
		<ButtonGroup
			variant="contained"
			style={{ height: '30px', marginBottom: '8px' }}
			color="primary"
			aria-label="split button"
		>
			<Button
				id="addWells"
				size="small"
				color="primary"
				aria-label="select merge strategy"
				aria-haspopup="menu"
				onClick={() => {
					addWellsToShape();
				}}
				disabled={!isSomethingSelected}
			>
				+ ADD Wells TO {shapeType?.toUpperCase()}
			</Button>
		</ButtonGroup>
	);
}

PotentialWellToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default memo(PotentialWellToolbar);
