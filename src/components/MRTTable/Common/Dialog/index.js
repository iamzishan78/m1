import React, { memo } from 'react';

import Dialog from '@material-ui/core/Dialog';

import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import RightDialog from 'components/ContactDetailCard/components/RightDialog';
import Loader from 'components/Loaders';
import BuyContactsInfoDialogContent from 'components/MRTTable/Common/Components/BuyContactsInfoDialogContent';
import ExportContactsPurchaseAndOwners from 'components/MRTTable/Common/Dialog/ExportContactsPurchaseAndOwners';
import Comments from 'components/Shared/Comments';

import { globalStateController } from 'controllers/globalStateController';
import { tableController, tableGlobalController } from 'controllers/tableController';

import { REMOVECOMMONGRIDFUNCTIONALITY } from 'graphQL/useMutationCommonGridRemove';

import { AssignOwnerToContactDrawerContainer, MultipleOwnerToContactDrawerContainer } from 'store/containers';

import DeleteConfirmationDialog from './ConfirmationDialog/DeleteConfirmationDialog';
import ExportConfirmationDialog from './ConfirmationDialog/ExportConfirmationDialog';
import TagDialog from './TagDialog';

function AllDialogs(props) {
	const { stateValues } = tableGlobalController.useState(['dialog']);
	const { type, ...rest } = stateValues.dialog || {};
	const tableKey = rest?.tableKey || props.tableKey;

	const {
		stateValues: { refetchQueries = [], isClientSide },
	} = tableController(props.tableKey).useState(['refetchQueries', 'isClientSide']);

	const [gridGenericRemove] = useMutation(REMOVECOMMONGRIDFUNCTIONALITY, {
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
		if (rest.deleteType === 'row') {
			rest.deleteFunc?.(dataToDelete);

			return;
		}

		Loader.createToast('deletion', 'Deletion in Progress');
		const user = globalStateController.getValue('user');
		const testCase = globalStateController.getValue('testCase');
		const hasMultiGrids = tableController(tableKey).getValue('hasMultiGrids');
		const paymentMultiGrid = tableGlobalController.getValue('paymentMultiGrid');

		gridGenericRemove({
			variables: {
				tableKey,
				deletedData: dataToDelete,
				userId: user?.mongoId,
				ESVariables: rest?.ESVariables,
				isSelectAll: rest?.isSelectAll,
				cypressDelete: testCase?.cypressDelete,
			},
			refetchQueries: ['getDbData', 'getDbDataTotal', ...refetchQueries],
			awaitRefetchQueries: true,
		}).then(
			res => {
				if (res?.data?.gridGenericRemove) {
					const { success, message } = res.data.gridGenericRemove;
					if (success) {
						Loader.successToast('deletion', message);
					} else {
						Loader.errorToast('deletion', message);
					}
				} else {
					Loader.errorToast('deletion', 'Failed to delete row (s)');
				}
				tableGlobalController.refetch();
			},
			() => {
				Loader.errorToast('deletion', 'Failed to delete row (s)');
				tableGlobalController.refetch();
			}
		);

		if ((hasMultiGrids && dataToDelete?.mainRecord?.includes(paymentMultiGrid?.paymentId)) || rest?.isSelectAll) {
			tableGlobalController.updateState({
				paymentMultiGrid: { showMultiGrid: false },
			});
		}
	};

	if (rest?.tableKey && rest?.tableKey !== props?.tableKey) {
		return null;
	}

	return (
		<>
			{type === 'tags' && (
				<Dialog open={!!type} onClose={handleCloseDialog} fullWidth={false}>
					<TagDialog
						{...rest}
						refetch={isClientSide ? tableGlobalController.refetchAdditionalQueries : tableGlobalController.refetch}
					/>
				</Dialog>
			)}
			{type === 'commentsWithTags' && (
				<Dialog open={!!type} onClose={handleCloseDialog} fullWidth={true}>
					<Comments
						{...rest}
						containsComments={true}
						isHelperTextAllow={true}
						isSaveAllowed={false}
						refetch={isClientSide ? tableGlobalController.refetchAdditionalQueries : tableGlobalController.refetch}
					/>
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
					controller={props.controller}
				>
					{`Do you want to Export ${rest.isSomeRowsSelected ? 'Selected Row (s)' : ' Complete Grid'} ?`}
				</ExportConfirmationDialog>
			)}

			{type === 'deleteGrid' && (
				<Dialog open onClose={handleCloseDialog} maxWidth="xs">
					<DeleteConfirmationDialog
						header="Delete row (s)"
						onClose={handleCloseDialog}
						deleteFunc={deleteFunc}
						deletedData={rest?.deletedData}
					>
						{`Do you want to delete the selected row ${rest?.Ids?.length > 1 ? 's' : ''}?`}
					</DeleteConfirmationDialog>
				</Dialog>
			)}

			{type === 'multipleOwnerToContact' && (
				<MultipleOwnerToContactDrawerContainer
					jobType={rest?.jobType}
					jobName={rest?.jobName}
					onClose={handleCloseDialog}
					rows={rest?.rows}
					onSuccess={() => {}}
					setRows={() => {}}
				/>
			)}
		</>
	);
}

AllDialogs.propTypes = {
	tableKey: PropTypes.string.isRequired,
	columns: PropTypes.array,
	controller: PropTypes.object,
};

export default memo(AllDialogs);
