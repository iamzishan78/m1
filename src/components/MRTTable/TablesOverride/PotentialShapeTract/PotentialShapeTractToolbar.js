import React, { memo } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import { ADD_TRACTS_TOA_SHAPE } from 'graphQL/useMutationAddTractsToAShape';

import { tableController, tableGlobalController } from 'hookstate/tableController';

function PotentialShapeTractToolbar({ tableKey, table }) {
	const [addShapeTract] = useMutation(ADD_TRACTS_TOA_SHAPE, {
		onCompleted: () => {
			tableController(tableKey).updateState({
				isLoading: false,
				isFetching: false,
			});

			tableGlobalController.setSelectedTab(0);
		},
		refetchQueries: ['getDbData', 'getESFilterList'],
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

	const addTractsToShape = () => {
		const customLayer = tableStateValues.customProps?.customLayer;

		const shapeTracts = selectedRows.map(row => {
			return {
				...row?.shapeJson?.properties,
				...row?.shapeJson?.originalProperties,
				name: row?.name,
				state: row?.shapeJson?.properties?.originalProperties?.State,
				county: row?.shapeJson?.properties?.originalProperties?.County,
				surveyMerdian: row?.shapeJson?.properties?.originalProperties?.surveyMerdian,
				blockTownship: row?.shapeJson?.properties?.originalProperties?.blockTownship,
				rangeSection: row?.shapeJson?.properties?.originalProperties?.rangeSection,
				altSurvey: row?.shapeJson?.properties?.originalProperties?.Grantee,
				grantee: row?.shapeJson?.properties?.originalProperties?.Grantee,
				legalDescription: row?.shapeJson?.properties?.legalDescription,
				shapeArea: row?.shapeJson?.properties?.shapeArea,
				sdGrossAcres: row?.shapeJson?.properties?.sdGrossAcres,
				parcelId: row?._id,
				shapeId: customLayer?._id,
			};
		});

		table.resetRowSelection();
		tableController(tableKey).updateState({
			isFetching: true,
		});

		addShapeTract({
			variables: { shapeTracts, shapeType },
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
				id="addTractButton"
				size="small"
				color="primary"
				aria-label="select merge strategy"
				aria-haspopup="menu"
				onClick={() => {
					addTractsToShape();
				}}
				disabled={!isSomethingSelected}
			>
				+ ADD Tracts To {shapeType?.toUpperCase()}
			</Button>
		</ButtonGroup>
	);
}

PotentialShapeTractToolbar.propTypes = {
	table: PropTypes.object.isRequired,
	tableKey: PropTypes.string.isRequired,
};

export default memo(PotentialShapeTractToolbar);
