import Checkbox from '@mui/material/Checkbox';
import Tooltip from '@mui/material/Tooltip';
import Radio from '@mui/material/Radio';
import { tableController } from 'hookstate/tableController';

function MRT_SelectCheckbox_OverRide({ row, selectAll, table, tableKey }) {
	const tableState = tableController(tableKey).useState(['rowSelection']);
	const tableStateValues = tableState.stateValues;
	if (!table) return null;

	const {
		getState,
		options: {
			localization,
			enableMultiRowSelection,
			muiSelectCheckboxProps,
			muiSelectAllCheckboxProps,
			selectAllMode,
		},
	} = table;
	const { density } = getState();

	const checkboxProps = !row
		? muiSelectAllCheckboxProps instanceof Function
			? muiSelectAllCheckboxProps({ table })
			: muiSelectAllCheckboxProps
		: muiSelectCheckboxProps instanceof Function
			? muiSelectCheckboxProps({ row, table })
			: muiSelectCheckboxProps;

	const allRowsSelected = selectAll
		? selectAllMode === 'page'
			? table.getIsAllPageRowsSelected()
			: table.getIsAllRowsSelected()
		: undefined;

	const commonProps = {
		checked: selectAll ? allRowsSelected : row?.getIsSelected(),
		disabled: false,
		inputProps: {
			'aria-label': selectAll ? localization.toggleSelectAll : localization.toggleSelectRow,
			'data-testid': `row-check-box-${row?.id}`,
		},
		onChange: row
			? row?.getToggleSelectedHandler()
			: selectAllMode === 'all'
				? table.getToggleAllRowsSelectedHandler()
				: table.getToggleAllPageRowsSelectedHandler(),
		size: density === 'compact' ? 'small' : 'medium',
		...checkboxProps,
		onClick: e => {
			e.stopPropagation();
			checkboxProps?.onClick?.(e);
		},
		sx: theme => ({
			height: density === 'compact' ? '1.75rem' : '2.5rem',
			width: density === 'compact' ? '1.75rem' : '2.5rem',
			m: density !== 'compact' ? '-0.4rem' : undefined,
			...(checkboxProps?.sx instanceof Function ? checkboxProps.sx(theme) : checkboxProps?.sx),
		}),
		title: undefined,
	};

	return (
		<Tooltip
			arrow
			enterDelay={1000}
			enterNextDelay={1000}
			title={checkboxProps?.title ?? (selectAll ? localization.toggleSelectAll : localization.toggleSelectRow)}
		>
			{enableMultiRowSelection === false ? (
				<Radio {...commonProps} />
			) : (
				<Checkbox
					indeterminate={
						selectAll
							? (table.getIsSomeRowsSelected() || Object.keys(tableStateValues?.rowSelection)?.length) &&
								!allRowsSelected
							: row?.getIsSomeSelected()
					}
					{...commonProps}
				/>
			)}
		</Tooltip>
	);
}

export default MRT_SelectCheckbox_OverRide;
