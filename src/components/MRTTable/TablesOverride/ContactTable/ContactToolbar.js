import React, { memo, useContext, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import EmailRoundedIcon from '@material-ui/icons/EmailRounded';
import { makeStyles } from '@material-ui/core/styles';
import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import {
	BulkUpdate,
	ExportData,
	ViewContactData,
	excludeFilters,
	openSideDialog,
} from 'components/MRTTable/Common/CommonToolBarActions';
import ContactTableDialogs from './RightDialogs';
import { AppContext } from 'AppContext';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import DialpadIcon from 'components/Shared/svgIcons/dialpad-icon';
import { ALL_EXTERNAL_TOOLS } from 'graphQL/useQueryAllExternalTools';
import { SYNC_DIALPAD } from 'graphQL/useMutationSyncDialpad';
import { EXTERNAL_TOOL_EXISTS } from 'graphQL/useQueryExternalToolExists';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showSuccessMessage } from 'actions';
import { jobController } from 'hookstate/jobStateController';

const useStyles = makeStyles(() => ({
	disabledTopBarButtons: {
		fontWeight: '600',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
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

function ContactToolbar({ table, tableKey }) {
	const classes = useStyles();
	const client = useApolloClient();
	const history = useHistory();
	const dispatch = useDispatch();
	const [stateApp] = useContext(AppContext);
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'esIndex',
		'globalFilter',
		'searchFields',
		'data',
		'filters',
		'defaultSort',
		'sorting',
		'showAddContactButton',
		'isAllRowsSelected',
		'rowSelection',
		'tableStateValues',
		'defaultFilters',
		'customProps',
		'TableSchema',
		'datasets',
	]);
	const tableStateValues = tableState.stateValues;
	const isSomeRowsSelected =
		table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length ? true : false;
	const isAllRowsSelected = table.getIsAllRowsSelected();
	const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
	const isSomethingSelected = isSomeRowsSelected || isAllRowsSelected;
	const [isDialpadConnected, setIsDialpadConnected] = useState(false);

	const { data: allTools } = useQuery(ALL_EXTERNAL_TOOLS);
	const [syncDialpad] = useMutation(SYNC_DIALPAD);
	const [externalToolExists] = useLazyQuery(EXTERNAL_TOOL_EXISTS);

	useEffect(() => {
		const dialpad = allTools?.allExternalTools?.find(tool => tool.toolName === 'dialpad');
		const isFeatureEnabled = stateApp.user?.features?.some(feature => feature.name === FEATURES.DIALPAD_INTEGRATION);
		if (dialpad && dialpad.apiKey && dialpad.isConnected && isFeatureEnabled) {
			setIsDialpadConnected(true);
		}
	}, [allTools, stateApp.user?.features]);

	const handleContactSync = async ({ toolName }) => {
		const { data } = await externalToolExists({ variables: { toolName } });

		if (!data?.externalToolExists) {
			dispatch(showErrorMessage('An error occured while syncing dialpad.'));
		} else if (!data.externalToolExists?.success) {
			dispatch(showErrorMessage('Please save a valid dialpad api key first.'));
		}

		let isSelectAll = true;
		let excludedIds = [];
		let total = tableStateValues?.data.total;
		const isSubSetSelect = Controller.getValue('isSubSetSelect');

		if (selectedRows.length !== 0 && !!!tableStateValues?.isAllRowsSelected && !isSubSetSelect) {
			isSelectAll = false;
		} else if (!!tableStateValues?.isAllRowsSelected || isSubSetSelect) {
			excludedIds = excludeFilters(tableKey, isSubSetSelect?.total);
			total = isSubSetSelect?.total ? isSubSetSelect?.total : total;
			total = total - excludedIds.length;
		}

		let sortOrder;
		if (tableStateValues.sorting.length > 0) {
			sortOrder = {
				field: tableStateValues.sorting[0]?.id,
				order: tableStateValues.sorting[0]?.desc ? 'desc' : 'asc',
			};
		}
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };
		const selectedIds = selectedRows && selectedRows.length > 0 ? selectedRows.map(item => item._id) : null;

		if (toolName === 'dialpad') {
			syncDialpad({
				variables: {
					toolName,
					requestPayload: {
						total,
						search,
						filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters],
						esIndex: tableStateValues.esIndex,
						sortOrder,
						defaultSort: tableStateValues?.defaultSort,
						isSelectAll,
						selectedIds,
						counts: {
							syncDialpad: tableStateValues?.data.total,
						},
					},
				},
			}).then(({ data }) => {
				if (!data?.syncDialpad?.success) {
					dispatch(showErrorMessage('An error occured while syncing dialpad.'));
				} else {
					dispatch(showSuccessMessage('Contacts will be synced to dialpad shortly.'));
					jobController.toggleBulkUpload();
				}
			});
		}
		table.resetRowSelection();
		Controller.updateState({
			onScrollCheck: true,
			isSubSetSelect: null,
		});
	};

	const routeChange = route => {
		history.push(route);
	};

	const addContact = e => {
		e.stopPropagation();
		tableGlobalController.updateState({
			dialog: {
				type: 'addContact',
			},
		});
		table.resetRowSelection();
	};

	const ExportProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };
		let sort = tableStateValues.defaultSort;
		if (tableStateValues?.sorting?.length) {
			sort = { field: tableStateValues?.sorting?.[0].id, order: tableStateValues.sorting?.[0].desc ? 'desc' : 'asc' };
		}
		return {
			_selectedRows: selectedRows,
			search,
			filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters], //both filter array send to backend
			sort,
			total: tableStateValues?.data.total,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			esIndex: tableStateValues.esIndex,
			table,
			tableKey,
			type: 'exportContacts',
			contactIdKey: '_id',
		};
	};

	const options = [
		{
			text: '+ ADD CONTACT',
			isShow: false,
			action: addContact,
		},
		{
			text: 'Import Contacts',
			isShow: true,
			action: () => routeChange('/bulkupload'),
		},
	];

	const SideDialogProps = () => {
		const query = tableStateValues?.globalFilter ? `*${tableStateValues?.globalFilter}*` : '*';
		const search = { fields: tableStateValues?.searchFields, query };

		return {
			selectedRows,
			search,
			isAllRowsSelected: tableStateValues.isAllRowsSelected,
			sorting: tableStateValues?.sorting,
			defaultSort: tableStateValues?.defaultSort,
			esIndex: tableStateValues.esIndex,
			filters: [...tableStateValues.filters, ...tableStateValues.defaultFilters],
			total: tableStateValues?.data.total,
			client,
			table,
			tableKey,
			selectedCampaign: tableStateValues.customProps?.campaign,
		};
	};

	const exportPropsPass = ExportProps();
	const sidePropsPass = SideDialogProps();

	return (
		<>
			<>
				{isDialpadConnected && isSomethingSelected && (
					<Button
						color={'transparent'}
						className={classes.selectTopBarButtons}
						variant={''}
						startIcon={<DialpadIcon color={'white'} />}
						style={{ color: 'grey' }}
						onClick={() => {
							handleContactSync({ toolName: 'dialpad' });
						}}
					>
						{'Sync to Dialpad'}
					</Button>
				)}

				{!isSomethingSelected && tableStateValues?.showAddContactButton && (
					<ButtonDropDown options={options} data_test_id="add-contact-icon-button" />
				)}

				<ViewContactData isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />

				<BulkUpdate isSomethingSelected={isSomethingSelected} classes={classes} {...sidePropsPass} />

				<Button
					color="secondary"
					startIcon={<MergeTypeIcon />}
					className={
						isSomethingSelected && selectedRows.length > 1 ? classes.selectTopBarButtons : classes.disabledTopBarButtons
					}
					disabled={!(isSomethingSelected && selectedRows.length > 1)}
					onClick={() =>
						openSideDialog({
							type: 'merge',
							selectedRows,
							isAllRowsSelected: sidePropsPass.isAllRowsSelected,
							search: sidePropsPass.search,
							sorting: sidePropsPass.sorting,
							defaultSort: sidePropsPass.defaultSort,
							esIndex: sidePropsPass.esIndex,
							filters: sidePropsPass.filters,
							total: sidePropsPass.total,
							client,
							table,
							tableKey,
						})
					}
				>
					Merge
				</Button>
				<Button
					color="secondary"
					startIcon={<EmailRoundedIcon />}
					className={isSomethingSelected ? classes.selectTopBarButtons : classes.disabledTopBarButtons}
					disabled={!isSomethingSelected}
					onClick={() =>
						openSideDialog({
							type: 'sendMailers',
							selectedRows,
							isAllRowsSelected: sidePropsPass.isAllRowsSelected,
							search: sidePropsPass.search,
							sorting: sidePropsPass.sorting,
							defaultSort: sidePropsPass.defaultSort,
							esIndex: sidePropsPass.esIndex,
							filters: sidePropsPass.filters,
							total: sidePropsPass.total,
							client,
							table,
							tableKey,
							props: {
								...(tableStateValues.customProps?.campaign && { campaign: tableStateValues.customProps?.campaign }),
							},
						})
					}
				>
					Mailers
				</Button>

				{isSomethingSelected && <ExportData classes={classes} {...exportPropsPass} />}
			</>
			<ContactTableDialogs tableKey={tableKey} />
		</>
	);
}

export default memo(ContactToolbar);
