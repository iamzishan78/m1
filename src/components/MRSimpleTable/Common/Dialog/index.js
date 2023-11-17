import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';
import {
	AssignOwnerToContactDrawerContainer,
	MultipleOwnerToContactDrawerContainer,
} from 'store/containers';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import BuyContactsInfoDialogContent from 'components/Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent';
import DeleteConfirmationDialogContent from './ConfirmationDialog/DeleteConfirmationDialog';
import Loader from 'components/Loaders';
import CommentDialog from './CommentDialog';
import TagDialog from './TagDialog';
import ExportConfirmationDialog from './ConfirmationDialog/ExportConfirmation';

function AllDialogs() {
	const { stateValues } = simpleTableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};
	const tableKey = rest?.tableKey;

	const handleCloseDialog = () => {
		simpleTableGlobalController.updateState({
			dialog: {},
		});
	};

	const updateRows = rows => {
		simpleTableGlobalController.updateState({
			contactDialog: {
				type,
				selectedRows: rows,
			},
		});
	};

	const deleteFunc = async dataToDelete => {
		Loader.createToast('deletion', 'Deletion in Progress');
	};

	return (
		<>
			<Dialog open={!!type} onClose={handleCloseDialog} fullWidth={type === 'comment'}>
				{type === 'tags' && <TagDialog {...rest} />}

				{type === 'comments' && <CommentDialog {...rest} />}
			</Dialog>

			{type === 'asign' && (
				<AssignOwnerToContactDrawerContainer
					header={tableKey}
					onClose={handleCloseDialog}
					rows={rest?.selectedRows}
					setSelectedRow={updateRows}
					setRows={updateRows}
				/>
			)}

			{type === 'buyContactsInfoData' && (
				<RightDialog open handleClickDialogClose={handleCloseDialog} width="700px">
					<BuyContactsInfoDialogContent
						header="Contact Data Integration"
						onClose={handleCloseDialog}
						rows={rest?.selectedRows}
						setRows={updateRows}
					/>
				</RightDialog>
			)}

			{type === 'exportCompleteGrid' && (
				<ExportConfirmationDialog
					table={rest.table}
					tableKey={tableKey}
					header={rest.header}
					onClose={handleCloseDialog}
				>
					{`Do you want to Export ${rest.isSomeRowsSelected ? 'Selected Row (s)' : ' Complete Grid'
						} ?`}
				</ExportConfirmationDialog>
			)}

			{type === 'deleteGrid' && (
				<Dialog open onClose={handleCloseDialog} maxWidth="xs">
					<DeleteConfirmationDialogContent
						header="Delete row (s)"
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						deletedData={rest?.deletedData}
					>
						{`Do you want to delete the selected row ${rest?.Ids?.length > 1 ? 's' : ''
							}?`}
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}

			{type === 'multipleOwnerToContact' && (
				<MultipleOwnerToContactDrawerContainer
					jobType={rest?.jobType}
					jobName={rest?.jobName}
					onClose={handleCloseDialog}
					rows={rest?.rows}
					onSuccess={() => { }}
					setRows={() => { }}
				/>
			)}
		</>
	);
}

export default memo(AllDialogs);
