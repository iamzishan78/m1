import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import RequestPageIcon from 'components/Shared/svgIcons/request_page';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { getAllData } from 'components/MRTTable/utils/GetAllData';
import _ from 'lodash';

const excludeFilters = (tableKey) => {
	const rowSelection = tableController(tableKey).getValue('rowSelection');
	const { rows, total: rangeTotal } = tableController(tableKey).getValue('data');
	const allNumbers = _.range(0, rangeTotal);
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
	if (isAllRowsSelected) {
		excludedIds = excludeFilters(tableKey)

		total = total - excludedIds.length
		isAllRowsSelected = excludedIds.length ? false : isAllRowsSelected
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
		props = {}
	}
) => {
	let showRows = selectedRows;
	if (isAllRowsSelected && !type.toLowerCase().includes('delete')) {
		tableGlobalController.updateState({
			dialog: {
				type,
				selectedRows: [],
				...props
			},
		});
		const excludedIds = excludeFilters(tableKey)
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

export function ExportData({ classes, _selectedRows, search, filters, sort, total, isAllRowsSelected, esIndex, table, tableKey, type, contactIdKey, shapeType }) {
	return (
		<Button
			color="secondary"
			startIcon={<CloudDownloadIcon color="white" />}
			className={classes.selectTopBarButtons}
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
