import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FeatureFlag from 'components/MRTTable/Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';
import RequestPageIcon from 'components/Shared/svgIcons/request_page';
import { tableGlobalController } from 'hookstate/tableController';
import { getAllData } from 'components/MRTTable/utils/GetAllData';

const openSideExportDialog = (_selectedRows, search, filters, total, isSelectAll, esIndex, table) => {
	tableGlobalController.updateState({
		dialog: {
			type: 'exportContacts',
			search,
			filters,
			total,
			isSelectAll,
			rows: _selectedRows,
			esIndex,
			open: true,
		},
	});
	table.resetRowSelection();
};

const openSideDialog = async (
	type,
	_selectedRows,
	isAllRowsSelected,
	search,
	sorting,
	defaultSort,
	esIndex,
	filters,
	total,
	client,
	table
) => {
	let showRows = _selectedRows;
	if (isAllRowsSelected) {
		tableGlobalController.updateState({
			dialog: {
				type,
				selectedRows: [],
			},
		});
		showRows = await getAllData(search, sorting, defaultSort, esIndex, filters, total, client);
	}
	tableGlobalController.updateState({
		dialog: {
			type,
			selectedRows: showRows,
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
}) {
	return (
		<Button
			color="secondary"
			startIcon={<EditIcon />}
			className={isSomethingSelected ? classes.selectTopBarButtons : classes.disabledTopBarButtons}
			disabled={!isSomethingSelected}
			onClick={() =>
				openSideDialog(
					'asign',
					selectedRows,
					isAllRowsSelected,
					search,
					sorting,
					defaultSort,
					esIndex,
					filters,
					total,
					client,
					table
				)
			}
		>
			Bulk Update
		</Button>
	);
}

export function ExportData({ classes, _selectedRows, search, filters, total, isSelectAll, esIndex, table }) {
	return (
		<Button
			color="secondary"
			startIcon={<CloudDownloadIcon color="white" />}
			className={classes.selectTopBarButtons}
			onClick={() => openSideExportDialog(_selectedRows, search, filters, total, isSelectAll, esIndex, table)}
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
						'buyContactsInfoData',
						selectedRows,
						isAllRowsSelected,
						search,
						sorting,
						defaultSort,
						esIndex,
						filters,
						total,
						client,
						table
					)
				}
			>
				Contact Data
			</Button>
		</FeatureFlag>
	);
}
