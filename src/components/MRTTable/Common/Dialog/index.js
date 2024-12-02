import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useMutation } from '@apollo/client';
import ExportContactsPurchaseAndOwners from 'components/MRTTable/Common/Dialog/ExportContactsPurchaseAndOwners';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { AssignOwnerToContactDrawerContainer, MultipleOwnerToContactDrawerContainer } from 'store/containers';
import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import BuyContactsInfoDialogContent from 'components/Shared/M1nTable/components/SubComponents/BuyContactsInfoDialogContent';
import DeleteConfirmationDialogContent from './ConfirmationDialog/DeleteConfirmationDialog';
import { GRID_GENERIC_REMOVE } from 'graphQL/useMutationCommonGridRemove';
import Loader from 'components/Loaders';
import CommentDialog from './CommentDialog';
import TagDialog from './TagDialog';
import ExportConfirmationDialog from './ConfirmationDialog/ExportConfirmation';
import { globalStateController } from 'hookstate/globalStateController';

function AllDialogs(props) {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};
	const tableKey = rest?.tableKey;

	const {
		stateValues: { refetchQueries },
	} = tableController(props.tableKey).useState(['refetchQueries']);

	const [gridGenericRemove] = useMutation(GRID_GENERIC_REMOVE, {
		awaitRefetchQueries: true,
		refetchQueries,
	});

	const handleCloseDialog = () => {
		tableGlobalController.updateState({
			dialog: {},
		});
	};

	const updateRows = rows => {
		tableGlobalController.updateState({
			dialog: {
				type,
				selectedRows: rows,
			},
		});
	};

	const deleteFunc = async dataToDelete => {
		Loader.createToast('deletion', 'Deletion in Progress');
		const user = globalStateController.getValue('user');
		const testCase = globalStateController.getValue('testCase');
		const hasMultiGrids = tableController(tableKey).getValue('hasMultiGrids');
		gridGenericRemove({
			variables: {
				tableKey,
				deletedData: dataToDelete,
				userId: user?.mongoId,
				ESVariables: rest?.ESVariables,
				isSelectAll: rest?.isSelectAll,
				cypressDelete: testCase?.cypressDelete,
			},
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

		if (hasMultiGrids) {
			tableGlobalController.updateState({
				paymentMultiGrid: { showMultiGrid: false },
			});
		}
	};

	return (
		<>
			{type === 'tags' && (
				<Dialog open={!!type} onClose={handleCloseDialog} fullWidth={false}>
					<TagDialog {...rest} />
				</Dialog>
			)}
			{type === 'comments' && (
				<Dialog open={!!type} onClose={handleCloseDialog} fullWidth={true}>
					<CommentDialog {...rest} hideSharedCommentCheck={props.hideSharedCommentCheck} />
				</Dialog>
			)}

			{type === 'convertContactSlideout' && (
				<MultipleOwnerToContactDrawerContainer
					onClose={() => {
						rest.onRemoveRows(null, true);
						handleCloseDialog();
					}}
					rows={rest.selectedRows}
					setRows={rest.onRemoveRows}
				/>
			)}

			{/* Note: Columns are passed to access in other components */}
			{type === 'exportContacts' && (
				<ExportContactsPurchaseAndOwners {...rest} columns={props.columns} onClose={handleCloseDialog} />
			)}

			{type === 'asign' && (
				<AssignOwnerToContactDrawerContainer
					header={tableKey}
					onClose={handleCloseDialog}
					rows={rest?.selectedRows}
					setSelectedRow={updateRows}
					setRows={updateRows}
					selectedCampaign={rest?.selectedCampaign}
					objectType={rest?.objectType}
					refetchQueries={[rest?.refetchQueries]}
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
					{`Do you want to Export ${rest.isSomeRowsSelected ? 'Selected Row (s)' : ' Complete Grid'} ?`}
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
						{`Do you want to delete the selected row ${rest?.Ids?.length > 1 ? 's' : ''}?`}
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
		</>
	);
}

export default memo(AllDialogs);
