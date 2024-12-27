import React from 'react';

import { Table, TableHead, TableRow, TableCell, TableBody, TableSortLabel } from '@material-ui/core';

import slice from 'lodash/slice';
import PropTypes from 'prop-types';

import Grid from '../grid';
import tablePropTypes from './../kit/tablePropTypes';
import throttleWithRAF from './../kit/throttleWithRAF';

const visuallyHidden = {
	border: 0,
	clip: 'rect(0 0 0 0)',
	height: 1,
	margin: -1,
	overflow: 'hidden',
	padding: 0,
	position: 'absolute',
	top: 20,
	width: 1,
};

class SpreadsheetGridScrollWrapper extends React.PureComponent {
	constructor(props) {
		super(props);

		this.tableEl = React.createRef();
		this.scrollDummyEl = React.createRef();
		this.scrollWrapperEl = React.createRef();
		this.grid = React.createRef();

		this.state = {
			first: 0,
			// last: this.calculateInitialLast(),
			offset: 0,
			columnWidthValues: {},
		};

		// if requestAnimationFrame is available, use it to throttle refreshState
		if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
			this.setScrollState = throttleWithRAF(this.setScrollState);
		}
	}

	componentWillUnmount() {
		if (this.props.isColumnsResizable) {
			document.removeEventListener('mousemove', this.processColumnResize, false);
			document.removeEventListener(
				'mouseup',
				() => {
					this.resizingCell = null;
				},
				false
			);
		}

		window.removeEventListener('resize', this.onResize, false);
	}

	focusCell(nextFocusedCell) {
		this.grid.current.focusCell(nextFocusedCell);
	}

	getHeaderStyle() {
		if (this.state.hasScroll) {
			return {
				overflowY: 'scroll',
			};
		}
	}

	getDisabledCells(rows, startIndex) {
		const disabledCells = [];
		const disabledCellChecker = this.props.disabledCellChecker;

		if (disabledCellChecker) {
			rows.forEach((row, x) => {
				this.props.columns.forEach((column, y) => {
					if (disabledCellChecker(row, column)) {
						disabledCells.push({ x: startIndex + x, y });
					}
				});
			});
		}

		return disabledCells;
	}

	getScrollWrapperClassName() {
		return 'SpreadsheetGridScrollWrapper' + (this.props.isScrollable ? ' SpreadsheetGridScrollWrapper_scrollable' : '');
	}

	renderResizer() {
		return (
			<div
				className="SpreadsheetGrid__resizer"
				onMouseDown={this.startColumnResize}
				style={{
					height: this.props.headerHeight + 'px',
				}}
			/>
		);
	}

	renderHeader() {
		const columns = this.props.columns;
		const { columnWidthValues } = this.state;

		return (
			<div className="SpreadsheetGrid__header" style={this.getHeaderStyle()}>
				{columns.map((column, i) => {
					return (
						<div
							key={i}
							className="SpreadsheetGrid__headCell"
							data-index={i}
							style={{
								height: this.props.headerHeight + 'px',
								width: columnWidthValues ? columnWidthValues[columns[i].id] + 'px' : 'auto',
								// width: 'auto'
							}}
						>
							{typeof column.title === 'string' ? column.title : column.title()}
							{/*
                                {this.props.isColumnsResizable && i !== columns.length - 1 &&
                                    this.renderResizer()} */}
						</div>
					);
				})}
			</div>
		);
	}

	render() {
		const rows = slice(this.props.rows, this.state.first, this.state.last);
		return (
			<>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{this.props.columns.map(column => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.width }}
									sortDirection={this.props.sort.orderBy === column.filterKey ? this.props.sort.order : 'desc'}
								>
									{column.sort ? (
										<TableSortLabel
											active={this.props.sort.orderBy === column.filterKey}
											direction={this.props.sort.orderBy === column.filterKey ? this.props.sort.order : 'desc'}
											onClick={() => this.props.createSortHandler(column.filterKey)}
										>
											{column.title}
											{this.props.sort.orderBy === column.filterKey ? (
												<span style={visuallyHidden}>
													{this.props.sort.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
												</span>
											) : null}
										</TableSortLabel>
									) : (
										column.title
									)}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						<Grid
							{...this.props}
							ref={this.grid}
							rows={rows}
							allRows={this.props.rows}
							rowsCount={this.props.rows.length}
							startIndex={this.state.first}
							offset={this.state.offset}
							columnWidthValues={this.state.columnWidthValues}
							disabledCells={this.getDisabledCells(rows, this.state.first)}
						/>
					</TableBody>
				</Table>
			</>
		);
	}
}

SpreadsheetGridScrollWrapper.propTypes = Object.assign({}, tablePropTypes, {
	// scroll
	isScrollable: PropTypes.bool,
	onScroll: PropTypes.func,
	onScrollReachesBottom: PropTypes.func,
	// resize
	isColumnsResizable: PropTypes.bool,
	onColumnResize: PropTypes.func,
});

SpreadsheetGridScrollWrapper.defaultProps = {
	rows: [],
	isColumnsResizable: false,
	placeholder: 'There are no rows',
	headerHeight: 40,
	rowHeight: 48,
	isScrollable: true,
	focusOnSingleClick: false,
};

export default SpreadsheetGridScrollWrapper;
