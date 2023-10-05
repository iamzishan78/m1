import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useMutation } from '@apollo/client';
import ExportContacts from 'components/Shared/ExportContacts';
import { tableGlobalController } from 'hookstate/tableController';
import { AssignOwnerToContactDrawerContainer } from 'store/containers';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import BuyContactsInfoDialogContent from 'components/Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import { REMOVECOMMONGRIDFUNCTIONALITY } from 'graphQL/useMutationCommonGridRemove';
import Loader from 'components/Loaders';
import CommentDialog from './CommentDialog';
import TagDialog from './TagDialog';
import ExportConfirmationDialog from '../TableCells/ExportConfirmation';

function AllDialogs() {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};
	const [removeCommonDelete] = useMutation(REMOVECOMMONGRIDFUNCTIONALITY, {
		refetchQueries: ["customLayer"],
		awaitRefetchQueries: true,
	});

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	const updateRows = rows => {
		tableGlobalController.updateState({
			contactDialog: {
				type,
				selectedRows: rows,
			},
		});
	};

	const deleteFunc = async IdsToDelete => {
		Loader.createToast('deletion', 'Deletion in Progress');
		removeCommonDelete({
			variables: { tableKey: rest?.tableKey, Ids: IdsToDelete, shapeIds: rest?.shapeIds },
		}).then(
			res => {
				if (res?.data?.gridGenericRemove) {
					const { success, message } = res.data.gridGenericRemove;
					if (success) Loader.successToast('deletion', message);
					else Loader.errorToast('deletion', message);
				} else Loader.errorToast('deletion', 'Failed to delete row (s)');
				tableGlobalController.refetch();
			},
			() => {
				Loader.errorToast('deletion', 'Failed to delete row (s)');
				tableGlobalController.refetch();
			}
		);
	};

	return (
		<>
			<Dialog open={!!type} onClose={handleCloseDialog} fullWidth={type === 'comment'}>
				{type === 'tags' && <TagDialog {...rest} />}

				{type === 'comments' && <CommentDialog {...rest} />}
			</Dialog>

			{type === 'exportContacts' && <ExportContacts {...rest} onClose={handleCloseDialog} />}

			{type === 'asign' && (
				<AssignOwnerToContactDrawerContainer
					header={rest.tableKey}
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
					tableKey={rest.tableKey}
					header={rest.header}
					onClose={handleCloseDialog}
				>
					{`Do you want to Export ${rest.isSomeRowsSelected ? 'Selected Row (s)' : ' Complete Grid'} ?`}
				</ExportConfirmationDialog>
			)}

			{type === 'deleteGrid' && (
				<Dialog open onClose={handleCloseDialog} maxWidth="xs">
					<DeleteConfirmationDialogContent
						header="Delete row (s)"
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						m1nSelectedRowsIds={rest?.Ids}
					>
						{`Do you want to delete the selected row ${rest?.Ids?.length > 1 ? 's' : ''}?`}
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
		</>
	);
}

export default memo(AllDialogs);
