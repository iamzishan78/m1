import React, { useEffect, useMemo } from 'react';

import { Button, ButtonGroup } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';

import { ToggleButton } from '@mui/material';

import PropTypes from 'prop-types';

import MetaFieldList from 'components/MRTTable/Common/MetaData/MetaFieldList';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';

import { globalStateController } from 'hookstate/globalStateController';
import { slidoutStateController } from 'hookstate/slidoutStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import MetaField from 'utils/MetaField';

import DocumentRightDialogs from './RightDialogs';

const docSearchColumn = {
	...CommonSchema.ACTION_COLUMN,
	name: 'docSearch',
	id: 'docSearch',
	header: 'Doc Search',
	accessorFn: row => row?.docSearch?.map(t => t.text)?.join(' ...... ') || '',
	muiTableBodyCellProps: {
		sx: {
			maxHeight: '250px',
			overflowY: 'auto',
			display: 'flex',
			alignItems: 'start',
		},
	},
	size: 400,
};

function DocumentToolBar({ tableKey }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'metaFieldList',
		'showFieldModal',
		'fetchMetaData',
		'TableSchema',
		'advanceSearch',
		'globalFilter',
	]);
	const tableStateValues = tableState.stateValues;

	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

	const isDocSearch = useMemo(() => {
		return !!(tableStateValues?.globalFilter && tableStateValues.advanceSearch?.docSearch);
	}, [tableStateValues?.globalFilter, tableStateValues.advanceSearch?.docSearch]);

	useEffect(() => {
		const hasDocSearchColumn = tableStateValues.TableSchema.some(c => c.name === 'docSearch');

		if (!hasDocSearchColumn && isDocSearch) {
			tableController(tableKey).updateState({ TableSchema: [...tableStateValues.TableSchema, docSearchColumn] });
		} else if (hasDocSearchColumn && !isDocSearch) {
			tableController(tableKey).updateState({
				TableSchema: tableStateValues.TableSchema.filter(c => c.name !== 'docSearch'),
			});
		}
	}, [isDocSearch]);

	return (
		<>
			<>
				<ButtonGroup variant="contained" color="primary" aria-label="split button">
					<Button
						id="addDocument"
						color="primary"
						size="small"
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={() => {
							Controller.updateState({
								metaFieldList: true,
							});
						}}
					>
						Meta Fields
					</Button>
				</ButtonGroup>

				<ButtonGroup variant="contained" color="primary" aria-label="split button">
					<Button
						id="addDocument"
						color="primary"
						size="small"
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={() => {
							tableGlobalController.updateState({
								documentDialog: {
									type: 'createAndAddDocument',
									tableKey,
								},
							});

							slidoutStateController.updateState({
								newEntity: true,
								title: 'Add New Document',
							});
						}}
					>
						<PostAddIcon></PostAddIcon>
						Add Document
					</Button>
				</ButtonGroup>
				{tableStateValues?.globalFilter && (
					<ToggleButton
						style={{
							padding: '0',
							height: 'fit-content',
							margin: 'auto 0',
							color: tableStateValues.advanceSearch?.docSearch ? '#fff' : '#263451',
							backgroundColor: tableStateValues.advanceSearch?.docSearch ? '#263451' : '#fff',
							border: `1px solid ${tableStateValues.advanceSearch?.docSearch ? '#fff' : '#263451'}`,
						}}
						selected={tableStateValues.advanceSearch?.docSearch}
						onChange={() =>
							tableController(tableKey).updateState({
								advanceSearch: { docSearch: !tableStateValues.advanceSearch?.docSearch },
							})
						}
					>
						<small
							style={{
								padding: '5px',
								fontWeight: 'normal',
							}}
						>
							{'Doc Search'}
						</small>
					</ToggleButton>
				)}

				{/* Custom metat data dialog */}
				{!!tableStateValues?.metaFieldList && <MetaFieldList tableKey={tableKey} />}
				{!!globalStateValues.showFieldModal && (
					<MetaField
						tableKey={tableKey}
						columns={tableStateValues?.TableSchema}
						category={tableStateValues?.fetchMetaData?.category}
					/>
				)}
			</>
			<DocumentRightDialogs />
		</>
	);
}

DocumentToolBar.propTypes = {
	tableKey: PropTypes.string.isRequired,
};

export default DocumentToolBar;
