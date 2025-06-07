import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import RequestPageIcon from 'components/Shared/svgIcons/request_page';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { getAllData } from 'components/MRTTable/utils/GetAllData';
import _ from 'lodash';

export const excludeFilters = (tableKey, total) => {
	const rowSelection = tableController(tableKey).getValue('rowSelection');
	const { rows, total: rangeTotal } = tableController(tableKey).getValue('data');
	total = total ? total : rangeTotal
	const allNumbers = _.range(0, total);
	const missingNumbers = _.difference(allNumbers, _.keys(rowSelection).map(Number));

	const excludedIds = []
	for (let i = 0; i < missingNumbers.length; i++) {
		excludedIds.push({ field: '_id', value: rows[missingNumbers[i]]._id, type: "advanced", searchType: "notEquals", isKeyword: true },)
	}
	return excludedIds
}

export const openSideExportDialog = ({ _selectedRows, search, filters, sort, total, isAllRowsSelected, esIndex, table, tableKey, type, contactIdKey, shapeType }) => {
	let excludedIds = []
	const includedIds = []
	const isSubSetSelect = tableController(tableKey).getValue('isSubSetSelect');

	if (isAllRowsSelected) {
		excludedIds = excludeFilters(tableKey)

		total = total - excludedIds.length
		isAllRowsSelected = excludedIds.length ? false : isAllRowsSelected
	} else if (!!isSubSetSelect) {
		excludedIds = excludeFilters(tableKey, isSubSetSelect?.total)
		total = isSubSetSelect?.total - excludedIds?.length
	} else {
		total = _selectedRows.length
		const value = []
		for (let i = 0; i < _selectedRows.length; i++) {
			value.push(_selectedRows[i]._id)
		}
		includedIds.push({ field: '_id', value })
	}

	const allFilters = [...filters, ...excludedIds, ...includedIds]
	tableGlobalController.updateState({
		dialog: {
			type,
			search,
			filters: allFilters,
			sort,
			total,
			isAllRowsSelected,
			esIndex,
			contactIdKey,
			shapeType,
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
		props = {},
		selectedCampaign,
	}
) => {
	let showRows = selectedRows;
	const isSubSetSelect = tableController(tableKey).getValue('isSubSetSelect');
	tableGlobalController.updateState({
		dialog: {
			type,
			selectedRows: [],
			...props
		},
	});

	if (isAllRowsSelected) {
		const excludedIds = excludeFilters(tableKey)
		const allFilters = [...filters, ...excludedIds]
		const newTotaltotal = total - excludedIds?.length
		showRows = await getAllData(search, sorting, defaultSort, esIndex, allFilters, newTotaltotal, client);
	} else if (!!isSubSetSelect) {
		const excludedIds = excludeFilters(tableKey, isSubSetSelect?.total)
		const allFilters = [...filters, ...excludedIds]
		const total = isSubSetSelect?.total - excludedIds?.length
		showRows = await getAllData(search, sorting, defaultSort, esIndex, allFilters, total, client);
	}
	tableGlobalController.updateState({
		dialog: {
			type,
			selectedRows: showRows,
			tableKey,
			...props,
			selectedCampaign,
			esIndex
		},
	});

	if (table.getIsAllRowsSelected()) table.toggleAllRowsSelected();

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
	tableKey,
	selectedCampaign,
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
						tableKey,
						selectedCampaign
					}
				)
			}
			data-testid="bulk-update"
		>
			Bulk Update
		</Button>
	);
}

export function ExportData({ classes, _selectedRows, search, filters, sort, total, isAllRowsSelected, esIndex, table, tableKey, type, contactIdKey, shapeType }) {
	return (
		<Button
			color="secondary"
			startIcon={<CloudDownloadIcon color="white" />}
			className={classes.selectTopBarButtons}
			data-testid="export-contact-and-purchse-icon-button"
			onClick={() => openSideExportDialog({ search, _selectedRows, filters, sort, total, isAllRowsSelected, esIndex, table, tableKey, type, contactIdKey, shapeType })}
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
