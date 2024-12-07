import React, { memo } from 'react';
import { Button, ButtonGroup } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import MetaFieldList from 'components/MRTTable/Common/MetaData/MetaFieldList';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import MetaField from 'components/Table/helpers/MetaField';
import DocumentRightDialogs from './RightDialogs';
import { globalStateController } from 'hookstate/globalStateController';
import { slidoutStateController } from 'hookstate/slidoutStateController';

function DocumentToolBar({ table, tableKey }) {
	const Controller = tableController(tableKey);
	const tableState = Controller.useState(['metaFieldList', 'showFieldModal', 'fetchMetaData', 'TableSchema']);
	const tableStateValues = tableState.stateValues;

	const { globalStateValues } = globalStateController.useState(['showFieldModal'], 'globalStateValues');

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

export default memo(DocumentToolBar);
