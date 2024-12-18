import React from 'react';
import PropTypes from 'prop-types';
import find from 'lodash.find';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash/isEmpty';
import keys from './../kit/keymap';
import tablePropTypes from './../kit/tablePropTypes';
import Row from './row';
import { TableRow } from '@material-ui/core';
import './styles.css';

class SpreadsheetGrid extends React.PureComponent {
	constructor(props) {
		super(props);

		this.onGlobalKeyDown = this.onGlobalKeyDown.bind(this);
		this.onGlobalClick = this.onGlobalClick.bind(this);
		this.onCellClick = this.onCellClick.bind(this);
		this.onMouseLeave = this.onMouseLeave.bind(this);
		this.onMouseEnter = this.onMouseEnter.bind(this);
		this.onCellDoubleClick = this.onCellDoubleClick.bind(this);
		this.getCellClassName = this.getCellClassName.bind(this);

		this.state = {
			allRows: this.props.allRows,
		};
	}

	componentDidMount() {
		// this.props.setFocusCell(this.focusCell)
		document.addEventListener('keydown', this.onGlobalKeyDown, false);
		document.addEventListener('click', this.onGlobalClick, false);
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		const disabledCells = nextProps.disabledCells;
		const nextState = {
			allRows: nextProps.allRows,
		};

		if (find(disabledCells, prevState.activeCell)) {
			nextState.activeCell = null;
		}
		if (find(disabledCells, prevState.focusedCell)) {
			nextState.focusedCell = null;
		}

		if (prevState.allRows !== nextProps.allRows) {
			nextState.focusedCell = null;
		}

		return nextState;
	}

	focusCell(nextFocusedCell) {
		this.setState({
			activeCell: nextFocusedCell,
			focusedCell: nextFocusedCell,
		});
		setTimeout(() => document.getElementById(`${nextFocusedCell.x}-${nextFocusedCell.y}`)?.scrollIntoView(), 0);

		this.skipGlobalClick = true;
	}

	componentDidUpdate(prevProps, prevState) {
		document.removeEventListener('keydown', this.onGlobalKeyDown, false);
		document.addEventListener('keydown', this.onGlobalKeyDown, false);
		this.onActiveCellChanged(prevState.activeCell);
		if (this.props.focusedCell) {
			this.skipGlobalClick = true;
		}
	}

	onActiveCellChanged(prevCell) {
		const { onActiveCellChanged } = this.props;
		const newCell = this.state.activeCell;

		if (onActiveCellChanged && newCell !== prevCell) {
			onActiveCellChanged(newCell);
		}
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.onGlobalKeyDown, false);
		document.removeEventListener('click', this.onGlobalClick, false);
	}

	onGlobalKeyDown(e) {
		const block = this;
		let addNewFromMoveRight = false;
		const columnsCount = this.props.columns.length;
		const rowsCount = this.props.rowsCount;

		let newActiveCell = this.state.activeCell;
		let newFocusedCell = this.state.focusedCell;

		if ((e.keyCode === keys.CAPITAL_N || e.keyCode === keys.SMALL_N) && e.ctrlKey) {
			e.preventDefault();
			this.addNewRow();
			return;
		}

		if (this.state.activeCell) {
			const { x, y } = this.state.activeCell;

			newFocusedCell = this.state.activeCell;

			function moveRight({ x, y }) {
				const currentActiveCell = newActiveCell;
				if (y < columnsCount - 1) {
					newActiveCell = { x, y: y + 1 };
				} else if (x < rowsCount - 1) {
					newActiveCell = { x: x + 1, y: 0 };
				} else {
					block.addNewRow();
					addNewFromMoveRight = true;
					return;
				}
				if (currentActiveCell !== newActiveCell) newFocusedCell = newActiveCell;

				if (find(block.props.disabledCells, newActiveCell)) {
					moveRight(newActiveCell);
				}
			}

			function moveDown({ x, y }) {
				const currentActiveCell = newActiveCell;
				if (x < rowsCount - 1) {
					newActiveCell = { x: x + 1, y };
				}
				if (currentActiveCell !== newActiveCell) newFocusedCell = newActiveCell;

				if (find(block.props.disabledCells, newActiveCell)) {
					moveDown(newActiveCell);
				}
			}

			function moveUp({ x, y }) {
				if (x > 0) {
					newActiveCell = { x: x - 1, y };
				}
				newFocusedCell = null;

				if (find(block.props.disabledCells, newActiveCell)) {
					moveUp(newActiveCell);
				}
			}

			function moveLeft({ x, y }) {
				const currentActiveCell = newActiveCell;
				if (y > 0) {
					newActiveCell = { x, y: y - 1 };
				} else if (x > 0) {
					newActiveCell = { x: x - 1, y: columnsCount - 1 };
				}
				if (currentActiveCell !== newActiveCell) newFocusedCell = newActiveCell;

				if (find(block.props.disabledCells, newActiveCell)) {
					moveLeft(newActiveCell);
				}
			}

			if (!this.state.focusedCell) {
				if (e.keyCode === keys.RIGHT) {
					moveRight({ x, y });
				}

				if (e.keyCode === keys.LEFT) {
					moveLeft({ x, y });
				}

				if (e.keyCode === keys.UP) {
					e.preventDefault();
					moveUp({ x, y });
				}

				if (e.keyCode === keys.DOWN) {
					e.preventDefault();
					moveDown({ x, y });
				}

				if (e.keyCode === keys.ALT) {
					newFocusedCell = null;
				}
			}

			if (e.keyCode === keys.ENTER) {
				newFocusedCell = null;
				// if (this.state.focusedCell) {
				//     moveDown({ x, y });
				// } else {
				//     newFocusedCell = this.state.activeCell;
				// }
			}

			if (e.keyCode === keys.TAB) {
				// if (this.state.focusedCell) {
				//     moveRight({ x, y });
				// } else {
				//     newFocusedCell = this.state.activeCell;
				// }

				if (e.shiftKey) {
					moveLeft({ x, y });
				} else moveRight({ x, y });

				// newFocusedCell = this.state.activeCell;
				e.preventDefault();
				// e.stopPropagation();
			}

			if (e.keyCode === keys.ESC) {
				if (this.state.focusedCell) {
					newFocusedCell = null;
				} else if (this.state.activeCell) {
					newActiveCell = null;
					newFocusedCell = null;
				}
			}
			if (!addNewFromMoveRight) {
				this.deleteEmptyRow(newActiveCell?.x);
				this.setState({
					activeCell: newActiveCell,
					focusedCell: newFocusedCell,
				});
			} else {
				addNewFromMoveRight = false;
			}
		}
	}

	onGlobalClick() {
		if (!this.skipGlobalClick) {
			this.deleteEmptyRow();
			this.setState({
				activeCell: null,
				focusedCell: null,
			});
		} else {
			this.skipGlobalClick = false;
		}
	}

	addNewRow() {
		const { allRows, setRows } = this.props;
		allRows.push({});
		setRows([].concat(allRows));
		this.focusCell({ x: allRows.length - 1, y: 0 });
		setTimeout(() => document.getElementById(`${allRows.length - 1}-0`)?.click(), 0);
	}

	deleteEmptyRow(newRowIndex) {
		if (this.state?.activeCell?.x && this.state?.activeCell?.x !== newRowIndex) {
			const { allRows, setRows } = this.props;
			const index = this.state?.activeCell?.x;
			if (isEmpty(allRows[index])) {
				allRows.splice(index, 1);
				setRows([].concat(allRows));
			}
		}
	}

	onCellClick(x, y, row, columnId, e) {
		if (!find(this.props.disabledCells, { x, y })) {
			if (!e.skipCellClick && !isEqual(this.state.focusedCell, { x, y })) {
				this.deleteEmptyRow(x);
				this.setState({
					focusedCell: this.props.focusOnSingleClick ? { x, y } : e.target !== e.currentTarget ? { x, y } : null,
					activeCell: { x, y },
				});
			}
		}

		if (this.props.onCellClick) {
			this.props.onCellClick(row, columnId);
		}

		this.skipGlobalClick = true;
	}

	onMouseEnter(x) {
		this.props.setCurrentRow(x);
		this.setState({
			hoveredRow: x,
		});
	}

	onMouseLeave(x) {
		this.props.setCurrentRow(null);
		this.setState({
			hoveredRow: null,
		});
	}

	onCellDoubleClick(x, y) {
		if (!find(this.props.disabledCells, { x, y })) {
			this.setState({
				activeCell: { x, y },
				focusedCell: { x, y },
			});
		}
	}

	getCellClassName(column, row, x, y) {
		if (column.id === 'action')
			return this.state.hoveredRow === x ? 'SpreadsheetGrid__showAction' : 'SpreadsheetGrid__hideAction';

		return (
			'SpreadsheetGrid__cell' +
			(isEqual(this.state.activeCell, { x, y }) ? ' SpreadsheetGrid__cell_active' : '') +
			(isEqual(this.state.focusedCell, { x, y }) ? ' SpreadsheetGrid__cell_focused' : '') +
			(find(this.props.disabledCells, { x, y }) ? ' SpreadsheetGrid__cell_disabled' : '') +
			(column.getCellClassName ? ' ' + column.getCellClassName(row) : '')
		);
	}

	calculatePosition() {
		return this.props.offset + 'px';
	}

	renderBody() {
		const { rows, columns, startIndex } = this.props;

		let body;

		if (rows.length) {
			body = rows.map((row, i) => {
				return (
					<TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
						<Row
							x={startIndex + i}
							key={this.props.getRowKey(row)}
							columns={columns}
							row={row}
							getCellClassName={this.getCellClassName}
							onCellClick={this.onCellClick}
							onCellDoubleClick={this.onCellDoubleClick}
							onMouseEnter={this.onMouseEnter}
							onMouseLeave={this.onMouseLeave}
							activeCell={this.state.activeCell}
							hoveredRow={this.state.hoveredRow}
							focusedCell={this.state.focusedCell}
							// Pass disabled cells for this row only.
							disabledCells={this.props.disabledCells.filter(({ x }) => {
								return x === startIndex + i;
							})}
							height={this.props.rowHeight}
							columnWidthValues={this.props.columnWidthValues}
						/>
					</TableRow>
				);
			});
		} else {
			body = <div className="SpreadsheetGrid__placeholder">{this.props.placeholder}</div>;
		}

		return body;
	}

	render() {
		return <>{this.renderBody()}</>;
	}
}

SpreadsheetGrid.propTypes = Object.assign({}, tablePropTypes, {
	offset: PropTypes.number.isRequired,
	startIndex: PropTypes.number.isRequired,
	rowsCount: PropTypes.number.isRequired,
	disabledCells: PropTypes.arrayOf(
		PropTypes.shape({
			x: PropTypes.number,
			y: PropTypes.number,
		})
	).isRequired,
});

export default SpreadsheetGrid;
