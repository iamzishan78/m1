import { withStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { useInView } from 'react-intersection-observer';

const defaultBodyRowStyles = theme => ({
	root: {
		// material v4
		'&.Mui-selected': {
			backgroundColor: theme.palette.action.selected,
		},

		// material v3 workaround
		'&.mui-row-selected': {
			backgroundColor: theme.palette.action.selected,
		},
	},
	hoverCursor: { cursor: 'pointer' },
	responsiveStacked: {
		[theme.breakpoints.down('sm')]: {
			borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
			borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
			padding: 0,
			margin: 0,
		},
	},
	responsiveSimple: {
		[theme.breakpoints.down('xs')]: {
			borderTop: 'solid 2px rgba(0, 0, 0, 0.15)',
			borderBottom: 'solid 2px rgba(0, 0, 0, 0.15)',
			padding: 0,
			margin: 0,
		},
	},
});

const TableRowComponent = props => {
	const { classes, options, rowSelected, onClick, className, isRowSelectable, onInfiniteScroll, totalRows, ...rest } =
		props;
	const [ref, inView] = useInView();
	var methods = {};
	if (onClick) {
		methods.onClick = onClick;
	}
	return (
		<TableRow
			ref={ref}
			innerRef={ref}
			hover={options.rowHover ? true : false}
			{...methods}
			className={clsx(
				{
					[classes.root]: true,
					[classes.hover]: options.rowHover,
					[classes.hoverCursor]: (options.selectableRowsOnClick && isRowSelectable) || options.expandableRowsOnClick,
					[classes.responsiveSimple]: options.responsive === 'simple',
					[classes.responsiveStacked]:
						options.responsive === 'vertical' ||
						options.responsive === 'stacked' ||
						options.responsive === 'stackedFullWidth',
					'mui-row-selected': rowSelected,
				},
				className
			)}
			selected={rowSelected}
			{...rest}
		>
			{inView || !onInfiniteScroll || totalRows < 150 ? props.children : <div style={{ height: '40px' }}></div>}
			{/* {} */}
		</TableRow>
	);
};

class TableBodyRow extends React.Component {
	static propTypes = {
		/** Options used to describe table */
		options: PropTypes.object.isRequired,
		/** Callback to execute when row is clicked */
		onClick: PropTypes.func,
		/** Current row selected or not */
		rowSelected: PropTypes.bool,
		/** Extend the style applied to components */
		classes: PropTypes.object,
	};

	render() {
		return <TableRowComponent {...this.props} />;
	}
}

export default withStyles(defaultBodyRowStyles, { name: 'MUIDataTableBodyRow' })(TableBodyRow);
