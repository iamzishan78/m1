import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import RequestPageIcon from 'components/Shared/svgIcons/request_page';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { getAllData } from 'components/MRTTable/utils/GetAllData';
import _ from 'lodash';

const openSideExportDialog = (_selectedRows, search, filters, total, isAllRowsSelected, esIndex, table) => {
	tableGlobalController.updateState({
		dialog: {
			type: 'exportContacts',
			search,
			filters,
			total,
			isAllRowsSelected,
			rows: _selectedRows,
			esIndex,
			open: true,
		},
	});
	table.resetRowSelection();
};

export const openSideDialog = async (
	{
		type,
		selectedRows,
		isAllRowsSelected,
		search,
		sorting,
		defaultSort,
		esIndex,
		filters,
		total,
		client,
		table,
		tableKey,
		props = {}
	}
) => {
	let showRows = selectedRows;
	if (isAllRowsSelected) {
		const rowSelection = tableController(tableKey).getValue('rowSelection');
		const { rows, total: rangeTotal } = tableController(tableKey).getValue('data');
		tableGlobalController.updateState({
			dialog: {
				type,
				selectedRows: [],
				...props
			},
		});
		const allNumbers = _.range(0, rangeTotal);

		const missingNumbers = _.difference(allNumbers, _.keys(rowSelection).map(Number));

		const excludedIds = []
		for (let i = 0; i < missingNumbers.length; i++) {
			excludedIds.push({ field: '_id', value: rows[missingNumbers[i]]._id, type: "advanced", searchType: "notEquals", isKeyword: true },)
		}
		const allFilters = [...filters, ...excludedIds]
		showRows = await getAllData(search, sorting, defaultSort, esIndex, allFilters, total, client);
	}
	tableGlobalController.updateState({
		dialog: {
			type,
			selectedRows: showRows,
			tableKey,
			...props
		},
	});
	table.resetRowSelection();
};

export function BulkUpdate({
	isSomethingSelected,
	classes,
	selectedRows,
	isAllRowsSelected,
	search,
	sorting,
	defaultSort,
	esIndex,
	filters,
	total,
	client,
	table,
	tableKey
}) {
	return (
		<Button
			color="secondary"
			startIcon={<EditIcon />}
			className={isSomethingSelected ? classes.selectTopBarButtons : classes.disabledTopBarButtons}
			disabled={!isSomethingSelected}
			onClick={() =>
				openSideDialog(
					{
						type: 'asign',
						selectedRows,
						isAllRowsSelected,
						search,
						sorting,
						defaultSort,
						esIndex,
						filters,
						total,
						client,
						table,
						tableKey
					}
				)
			}
		>
			Bulk Update
		</Button>
	);
}

export function ExportData({ classes, _selectedRows, search, filters, total, isAllRowsSelected, esIndex, table }) {
	return (
		<Button
			color="secondary"
			startIcon={<CloudDownloadIcon color="white" />}
			className={classes.selectTopBarButtons}
			onClick={() => openSideExportDialog(_selectedRows, search, filters, total, isAllRowsSelected, esIndex, table)}
		>
			Export
		</Button>
	);
}

export function ViewContactData({
	isSomethingSelected,
	classes,
	selectedRows,
	isAllRowsSelected,
	search,
	sorting,
	defaultSort,
	esIndex,
	filters,
	total,
	client,
	table,
	tableKey
}) {
	return (
		<FeatureFlag feature={FEATURES.IDICORE}>
			<Button
				color="secondary"
				startIcon={<RequestPageIcon color="#B3B3B3" />}
				className={isSomethingSelected ? classes.selectTopBarButtons : classes.disabledTopBarButtons}
				disabled={!isSomethingSelected}
				onClick={() =>
					openSideDialog(
						{
							type: 'buyContactsInfoData',
							selectedRows,
							isAllRowsSelected,
							search,
							sorting,
							defaultSort,
							esIndex,
							filters,
							total,
							client,
							table,
							tableKey
						}
					)
				}
			>
				Contact Data
			</Button>
		</FeatureFlag>
	);
}
