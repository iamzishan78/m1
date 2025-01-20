import React, { useEffect, useState } from 'react';
import CSVDownloader from 'react-csv-downloader';

import { Box, Grid, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropRight from '@material-ui/icons/ArrowRight';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import vf_number from 'components/Shared/valueformatters/vf_number';

import { TO_FIXED } from 'utils/consts';
import { convertAnalyticsDataToCSV, isEven } from 'utils/helper';

const useStyles = makeStyles(() => ({
	root: {
		// margin: "20px 0px",
	},
	table: {
		textTransform: 'uppercase !important',
		minWidth: 150,
		'& .MuiTableCell-root': {
			paddingBottom: '5px',
			textAlign: 'center',
			fontWeight: 'bold',
		},
		'& .MuiTableCell-head': {
			borderBottom: 'none',
		},
	},
	secondaryTable: {
		width: 'auto',
		'& .MuiTableCell-root': {
			paddingBottom: '8.9px',
			textAlign: 'center',
			fontWeight: 'bold',
			minWidth: '200px',
		},
	},
	headerCell: {
		width: '200px',
		backgroundColor: '#f1f4fb !important',
		paddingBottom: '18px !important',
	},
	monthCell: {
		borderTop: '2px solid #f1f4fb !important',
	},
	highlightedRows: {
		'& .MuiTableCell-root': {
			// paddingTop: "25px !important",
			// borderBottom: "none",
			// background: "linear-gradient(#e0e0e0, #e0e0e0) bottom/100% 3px no-repeat",
		},
	},
	highlightedLessBordered: {
		'& .MuiTableCell-root': {
			// paddingTop: "25px !important",
			// borderBottom: "none",
			// background: "linear-gradient(#e0e0e0, #e0e0e0) bottom/100% 2px no-repeat",
		},
	},
	leftCells: {
		paddingLeft: '3px',
		textAlign: 'left !important',
	},
	topColoredBorderCell: {
		borderTop: '2px solid #34b4e3 !important',
	},
	leftRightColoredBorderCell: {
		borderLeft: '2px solid #34b4e3 !important',
		borderRight: '2px solid #34b4e3 !important',
	},
	bottomColoredBorderCell: {
		borderBottom: '2px solid #34b4e3 !important',
	},
	totalColCell: {
		fontWeight: 'bolder',
		fontSize: '16px',
		fontFamily: 'sans-serif',
	},
}));

export default function AdjustmentTable({ monthsInterval, items, total }) {
	const classes = useStyles();

	const [selectedItems, setSelectedItems] = useState({});

	const monthBreakDownValue = (breakDownType, breakDown) => {
		return breakDown && breakDown[breakDownType] ? breakDown[breakDownType] : null;
	};

	const displayValue = value => {
		return value ? <span>{vf_number(value.toFixed(TO_FIXED))}</span> : <span>-</span>;
	};

	const [csvItems, setCsvItems] = useState(items);

	useEffect(() => {
		const totalAdjustments = { name: 'TOTAL ADJUSTMENTS', total, data: {} };

		monthsInterval.forEach(month => {
			let total = 0;
			items.forEach(item => {
				if (typeof item?.data?.[month] === 'object') {
					total += item?.data?.[month]?.total;
				}
			});

			totalAdjustments.data[month] = total;
		});

		setCsvItems([...items, totalAdjustments]);
	}, [items, monthsInterval, total]);

	return (
		<div className={classes.root}>
			<TableContainer>
				<Grid container display="flex" direction="row" justify="flex-start" style={{ padding: '2px' }}>
					<Grid item md={5}>
						<Table className={classes.table} aria-label="caption table">
							<TableHead>
								<TableRow>
									<TableCell
										style={{ paddingLeft: 0, width: '-webkit-fill-available' }}
										component="th"
										className={`${classes.nameCell} ${classes.headerCell}`}
									>
										<CSVDownloader
											datas={convertAnalyticsDataToCSV(csvItems, monthsInterval)}
											filename={'Adjustments'}
											type="link"
											style={{ position: 'relative', left: '15px', width: '30px' }}
										>
											<IconButton style={{ display: 'flex', padding: '0px' }}>
												<Tooltip title="Download CSV" aria-label="add">
													<CloudDownloadIcon />
												</Tooltip>
											</IconButton>
										</CSVDownloader>
									</TableCell>
									<TableCell
										align="center"
										component="th"
										className={`${classes.headerCell} ${classes.topColoredBorderCell} ${classes.leftRightColoredBorderCell}`}
										style={{ color: '#12abe0' }}
									>
										Total
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{items.map((item, index) => (
									<TableRow key={item.name}>
										<TableCell scope="row" className={classes.leftCells}>
											<Box>
												<span style={{ display: 'flex' }}>
													{selectedItems[index] ? (
														<ArrowDropDownIcon
															style={{ cursor: 'pointer' }}
															onClick={() => setSelectedItems({ ...selectedItems, [index]: false })}
														/>
													) : (
														<ArrowDropRight
															style={{ cursor: 'pointer' }}
															onClick={() => setSelectedItems({ ...selectedItems, [index]: true })}
														/>
													)}
													{item.name}
												</span>
												<span style={{ display: 'grid', marginLeft: '25px', fontWeight: '200' }}>
													{' '}
													{selectedItems[index] && Object.keys(item.breakDown).map(key => <span>{key || '-'}</span>)}
												</span>
											</Box>
										</TableCell>
										<TableCell scope="row" className={`${classes.leftRightColoredBorderCell}`}>
											<span>{item.total.toFixed(TO_FIXED)}</span>
											<span style={{ display: 'grid' }}>
												{' '}
												{selectedItems[index] && Object.values(item.breakDown).map(value => displayValue(value))}
											</span>
										</TableCell>
									</TableRow>
								))}
								<TableRow className={`${classes.highlightedRows}`}>
									<TableCell scope="row" className={`${classes.leftCells} ${classes.totalColCell}`}>
										Total Adjustments
									</TableCell>
									<TableCell
										scope="row"
										className={`${classes.leftRightColoredBorderCell} ${classes.bottomColoredBorderCell} ${classes.totalColCell}`}
										style={{ width: '160px' }}
									>
										{displayValue(total)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Grid>
					<Grid item md={7} style={{ overflowX: 'overlay' }}>
						<Table
							className={`${classes.secondaryTable} ${classes.table}`}
							aria-label="caption table"
							style={{ width: 'auto' }}
						>
							<TableHead>
								<TableRow>
									{monthsInterval.map(month => (
										<TableCell align="center" component="th" className={classes.headerCell + ' ' + classes.monthCell}>
											{month}
										</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{items.map((item, index) => (
									<TableRow className={`${isEven(index) ? classes.highlightedRows : ''}`} key={index}>
										{monthsInterval.map(month => (
											<TableCell scope="row">
												<span>{displayValue(item.data[month]?.total)}</span>
												<span style={{ display: 'grid' }}>
													{selectedItems[index] &&
														Object.keys(item.breakDown).map(breakDownType =>
															displayValue(monthBreakDownValue(breakDownType, item.data[month]?.breakDown))
														)}
												</span>
											</TableCell>
										))}
									</TableRow>
								))}

								<TableRow className={classes.highlightedRows}>
									{monthsInterval.map(month => {
										let total = 0;
										items.forEach(item => {
											if (typeof item.data[month] === 'object') {
												total += item.data[month].total;
											}
										});
										return (
											<TableCell className={classes.totalColCell} scope="row">
												{displayValue(total)}
											</TableCell>
										);
									})}
								</TableRow>
								<TableRow></TableRow>
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</TableContainer>
		</div>
	);
}
