import React, { useState, useEffect } from 'react';

import { Typography, Grid, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery } from '@apollo/client';
import { set, get, uniqBy } from 'lodash';
import PropTypes from 'prop-types';

import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import vf_number from 'components/Shared/valueformatters/vf_number';

// Components
import { GET_DB_AGGS } from 'graphQL/useQueryDbQuery';
import { GET_META_DATA } from 'graphQL/useQueryGetMetaData';

import PieChartWithLegend from './Charts/PieChartWithLegend';
import ProductChart from './Charts/ProductChart';

export const TabButtons = ({ tab, actiiveId, setActive }) => {
	return (
		<div
			className={tab?.id === actiiveId ? 'tab_button active' : 'tab_button inactive'}
			onClick={() => setActive(tab?.id)}
		>
			{tab.label}
		</div>
	);
};

TabButtons.propTypes = {
	tab: PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
	}).isRequired,
	actiiveId: PropTypes.string.isRequired,
	setActive: PropTypes.func.isRequired,
};

const useStyles = makeStyles(() => ({
	root: {
		paddingTop: 0,
		paddingLeft: 20,
		paddingRight: 20,
		paddingBottom: 20,
	},
	textTransform: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	tabButtons: {
		maxWidth: 440,
		margin: '20px 0 32px',
	},
	totalLabelField: {
		marginBottom: 24,
		maxWidth: 400,
	},
	totalLabelTextColor: {
		color: '#959595',
	},
	graphCard: {
		border: '2px solid #959595',
		borderRadius: 8,
		maxWidth: '440px',
		padding: '0px 10px',
		height: '300px',
	},
	dataCardWidth: {
		maxWidth: 400,
	},
	dataCardMargin: {
		margin: '22px 0px',
	},
	productNameBox: {
		background: '#00000070',
		borderRadius: 8,
		padding: '8px 12px',
	},
	productName: {
		fontSize: 14,
		color: '#ffffff',
		margin: 0,
	},
	field: {
		margin: '16px 0 0',
	},
	fieldLabel: {
		fontSize: 14,
		textAlign: 'center',
	},
	fieldValue: {
		fontWeight: 'bold',
		fontSize: 16,
		textAlign: 'center',
		margin: 0,
	},
	analyticTable: {
		width: '240px',
		marginLeft: '45px',
		'& .MuiDivider-root': {
			backgroundColor: '#c5c5c5',
			height: '1.5px',
		},
	},
	productGridRow: {
		margin: '15px 0px',
	},
	headerRow: {
		'& .MuiGrid-item': {
			fontSize: '13px',
			fontWeight: 'bold',
			textAlign: 'center',
		},
	},
	contentRow: {
		'& .MuiGrid-item': {
			fontSize: '15px',
			textAlign: 'center',
		},
	},
	optionsList: {
		maxHeight: '450px',
	},
	optionButton: {
		backgroundColor: 'white',
		fontWeight: 'bold',
		'&:hover': {
			backgroundColor: 'white',
		},
	},
}));

// const ProductDropdown = () => {
// 	const classes = useStyles();
// 	const [selectedProductOption, setProductOption] = useState('Gross Production');

// 	const options = useMemo(() => ['Gross Production', 'Net Production', 'Net Revenue', 'Average Price'], []);
// 	return (
// 		<PopupState variant="popper" popupId="RevenueSummaryProduct">
// 			{popupState => (
// 				<>
// 					<div style={{ cursor: 'pointer', textAlign: 'center' }} {...bindTrigger(popupState)}>
// 						<Button className={classes.optionButton} endIcon={<KeyboardArrowDownIcon fontSize="small" />}>
// 							{selectedProductOption}
// 						</Button>
// 					</div>
// 					<Popover
// 						{...bindPopover(popupState)}
// 						getContentAnchorEl={null}
// 						anchorOrigin={{
// 							vertical: 'bottom',
// 							horizontal: 'center',
// 						}}
// 						transformOrigin={{
// 							vertical: 'top',
// 							horizontal: 'center',
// 						}}
// 					>
// 						<List className={classes.optionsList}>
// 							{options.map((option, index) => (
// 								<ListItem
// 									button
// 									key={index}
// 									onClick={() => {
// 										popupState.close();
// 										setProductOption(option);
// 									}}
// 									style={{ textTransform: 'uppercase' }}
// 									selected={option === selectedProductOption}
// 								>
// 									<ListItemText primary={option} />
// 								</ListItem>
// 							))}
// 						</List>
// 					</Popover>
// 				</>
// 			)}
// 		</PopupState>
// 	);
// };

const SummarySection = ({ checkId }) => {
	const classes = useStyles();
	const [activeTabId, setActiveTabId] = useState(1);
	const [revenueSummaryDetails, setRevenueSummaryDetails] = useState([]);
	const [adjustmentSummaryDetails, setAdjustmentSummaryDetails] = useState([]);
	const [productSummaryDetails, setProductSummaryDetails] = useState([]);

	// queries
	const [getAggsRevenue, { data: revenueSummary }] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
	});

	const [getAggAdjustment, { data: adjustmentSummary }] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
	});

	const [getProductSummary, { data: productSummary }] = useLazyQuery(GET_DB_AGGS, {
		context: { batch: true },
		fetchPolicy: 'no-cache',
	});

	const [getMetaData, { data: metaDataRes }] = useLazyQuery(GET_META_DATA);

	let revSummary = revenueSummary?.getDbAggs?.aggregations;
	let adjSummary = adjustmentSummary?.getDbAggs?.aggregations;
	let prodSummary = productSummary?.getDbAggs?.aggregations;
	let metaData = metaDataRes?.getMetaData?.metaData;
	const summaryTabs = [
		{ id: 1, label: 'Revenue' },
		{ id: 2, label: 'Adjustments' },
		{ id: 3, label: 'Products' },
	];

	useEffect(() => {
		getMetaData({
			variables: {
				category: 'Check Details',
			},
		});
	}, [getMetaData]);

	useEffect(() => {
		getAggsRevenue({
			variables: {
				index: 'checkdetails_flat',
				filters: [
					{
						field: 'check._id',
						value: checkId,
					},
				],
				aggs: {
					grossRevenue: { sum: { field: 'grossOwnerValue' } },
					netOwnerValue: { sum: { field: 'netOwnerValue' } },
					ownerDeducts: { sum: { field: 'ownerDeducts' } },
					ownerTax: { sum: { field: 'ownerTax' } },
					leasePayments: { sum: { field: 'leasePayments' } },
					other: { sum: { field: 'other' } },
				},
			},
		});

		getAggAdjustment({
			variables: {
				index: 'checkdetails_flat',
				filters: [
					{
						field: 'check._id',
						value: checkId,
					},
				],
				aggs: {
					taxType: {
						terms: { field: 'taxType' },
						aggs: { ownerTax: { sum: { field: 'ownerTax' } } },
					},
					deductType: {
						terms: { field: 'deductType', size: 10000 },
						aggs: { ownerDeducts: { sum: { field: 'ownerDeducts' } } },
					},
				},
			},
		});

		getProductSummary({
			variables: {
				index: 'checkdetails_flat',
				filters: [
					{
						field: 'check._id',
						value: checkId,
					},
				],
				aggs: {
					product: {
						terms: { field: 'product' },
						aggs: {
							grossPropertyVolume: { sum: { field: 'grossPropertyVolume' } },
							grossOwnerVolume: { sum: { field: 'grossOwnerVolume' } },
							netRevenue: { sum: { field: 'netOwnerValue' } },
							avgPrice: { avg: { field: 'price' } },
						},
					},
				},
			},
		});
	}, [checkId]);

	// revenue summary
	useEffect(() => {
		if (!revSummary) {
			return;
		}

		const grossRev = revSummary?.grossRevenue?.[0]?.grossRevenue || 0;
		const ownerDeduct = revSummary?.ownerDeducts?.[0]?.ownerDeducts || 0;
		const ownerTax = revSummary?.ownerTax?.[0]?.ownerTax || 0;
		const ownerDed = ownerDeduct + ownerTax;

		const netRev = revSummary?.netOwnerValue?.[0]?.netOwnerValue || 0;
		const leasePay = revSummary?.leasePayments?.[0]?.leasePayments || 0;
		const other = revSummary?.other?.[0]?.other || 0;

		const format = val => val?.toFixed(2);

		setRevenueSummaryDetails([
			{ name: 'Gross Revenue', value: format(grossRev) },
			{ name: 'Adjustments', value: format(ownerDed) },
			{ name: 'Net Revenue', value: format(netRev) },
			{
				name: 'Lease Payments',
				value: leasePay ? format(leasePay) : '-',
			},
			{
				name: 'Other',
				value: other ? format(other) : '-',
			},
			{
				name: 'Total Income',
				value: format(netRev + leasePay + other),
			},
		]);
	}, [revSummary]);

	// // products summary
	useEffect(() => {
		if (prodSummary) {
			const productMapping = metaData?.find(meta => meta?.name === 'product_type');

			const products = uniqBy(productMapping?.mapping, 'to').map(product => product?.to);
			let buckets = [];
			products.forEach(p => {
				const mappings = productMapping?.mapping?.filter(m => m?.to === p);
				const bucket = { key: p.includes('NGL') ? 'NGL' : p };
				mappings.forEach(m => {
					const fundBucket = prodSummary?.product?.find(p => p?.product?.toLowerCase() === m?.from?.toLowerCase());
					if (fundBucket) {
						set(
							bucket,
							'grossPropertyVolume',
							(get(bucket, 'grossPropertyVolume') || 0) + get(fundBucket, 'grossPropertyVolume')
						);
						set(
							bucket,
							'grossOwnerVolume',
							(get(bucket, 'grossOwnerVolume') || 0) + get(fundBucket, 'grossOwnerVolume')
						);
						set(bucket, 'netRevenue', (get(bucket, 'netRevenue') || 0) + get(fundBucket, 'netRevenue'));
						set(bucket, 'avgPrice', (get(bucket, 'avgPrice') || 0) + get(fundBucket, 'avgPrice'));
					}
				});
				buckets.push(bucket);
			});

			const formatValue = value => {
				const rounded = Math.round((value || 0) * 100) / 100;
				return vf_number(rounded.toFixed(2));
			};

			const formattedBuckets = buckets.map(b => ({
				...b,
				grsProd: b.grossPropertyVolume ? formatValue(b.grossPropertyVolume) : '-',
				netProd: b.grossOwnerVolume ? formatValue(b.grossOwnerVolume) : '-',
				netRevenue: b.netRevenue ? formatValue(b.netRevenue) : '-',
				avgPrice: b.avgPrice ? formatValue(b.avgPrice) : '-',
			}));

			setProductSummaryDetails(formattedBuckets);
		}
	}, [prodSummary]);

	// // adjustment summary
	useEffect(() => {
		if (adjSummary) {
			let { deductType, taxType } = adjSummary;

			const deducts = deductType.map(d => {
				const rawValue = d?.ownerDeducts;
				const safeValue = Number(rawValue) || 0; // fallback to 0 if NaN/undefined/null
				return {
					name: d?.deductType,
					value: safeValue.toFixed(2),
				};
			});

			const taxes = taxType.map(t => {
				const rawValue = t?.ownerTax;
				const safeValue = Number(rawValue) || 0;
				return {
					name: t?.taxType,
					value: safeValue.toFixed(2),
				};
			});

			const adjustments = [...deducts, ...taxes];
			let totalAdjustment = 0;
			adjustments.forEach(a => {
				totalAdjustment += parseFloat(a.value);
			});

			adjustments.push({ name: 'Total Adjustments', value: `${totalAdjustment}` });
			setAdjustmentSummaryDetails(adjustments);
		}
	}, [adjSummary]);

	// const wrapWithBrackets = string => {
	// 	return `${string ? `(${string})` : '-'}`;
	// };

	return (
		<div className={`${classes.root} flex column justifyStart alignStart w-100`}>
			<div className={`${classes.tabButtons} flex justifyBetween alignCenter w-100`}>
				{summaryTabs.map(tab => (
					<TabButtons
						key={tab.id}
						tab={tab}
						actiiveId={activeTabId}
						setActive={selectedId => setActiveTabId(selectedId)}
					/>
				))}
			</div>

			{/* Revenue */}
			{activeTabId === 1 && (
				<Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3}>
					<Grid item xs={6}>
						<div className={classes.graphCard} style={{ maxWidth: '100%' }}>
							<PieChartWithLegend type="revenue" chartData={revenueSummaryDetails} />
						</div>
					</Grid>
					<Grid item xs={6}>
						<div className={classes.analyticTable}>
							{revenueSummaryDetails?.length > 0 &&
								revenueSummaryDetails.map(item => (
									<>
										{['Net Revenue', 'Adjustments', 'Gross Revenue'].includes(item.name) ? (
											<>
												{item.name === 'Net Revenue' && <Divider />}
												<div
													key={item.name}
													className={`${classes.dataCardWidth} ${classes.dataCardMargin} flex justifyBetween alignCenter w-100`}
												>
													<div className="flex alignCenter justifyStart">
														<Typography varient="h6" className={classes.textTransform}>
															{item.name || ''}
														</Typography>
													</div>

													<div
														className="flex"
														style={{ minWidth: '60px', alignItems: 'center', justifyContent: 'center' }}
													>
														<Typography varient="h6" className={classes.textTransform}>
															{vf_currency_to_fixed(item.value, 2)}
														</Typography>
													</div>
												</div>
											</>
										) : (
											<></>
										)}
									</>
								))}
						</div>
					</Grid>
				</Grid>
			)}

			{/* Property */}
			{activeTabId === 3 && (
				<div className="flex alignCenter w-100" style={{ justifyContent: 'flex-start' }}>
					<Grid item xs={6}>
						{/* <div className={classes.graphCard} style={{ maxWidth: '100%' }}> */}
						{/* <ProductDropdown /> */}
						{/* <BarChartWithController productSummaryDetails={productSummaryDetails} /> */}
						<ProductChart productSummaryDetails={productSummaryDetails} />
						{/* </div> */}
					</Grid>
					<Grid item xs={6}>
						<div>
							<Grid container display="flex" direction="row" alignItems="center">
								<Grid item xs={12}>
									<Grid
										container
										display="flex"
										direction="row"
										alignItems="center"
										justify="space-between"
										className={`${classes.productGridRow} ${classes.headerRow}`}
									>
										<Grid item xs={2}></Grid>
										<Grid item xs={2}>
											GRS PROD
										</Grid>
										<Grid item xs={2}>
											NET PROD
										</Grid>
										<Grid item xs={2}>
											NET REV
										</Grid>
										<Grid item xs={2}>
											AVG PRICE
										</Grid>
										<Grid item xs={2}></Grid>
									</Grid>
								</Grid>
								{productSummaryDetails.map(product => (
									<Grid item xs={12} key={product.key}>
										<Grid
											container
											display="flex"
											direction="row"
											alignItems="center"
											justify="space-between"
											className={`${classes.productGridRow} ${classes.contentRow}`}
										>
											<Grid item xs={2} style={{ fontWeight: 'bold' }}>
												{product.key}
											</Grid>

											<Grid item xs={2}>
												{product.grsProd}
											</Grid>
											<Grid item xs={2}>
												{product.netProd}
											</Grid>
											<Grid item xs={2}>
												{product.netRevenue === '-'
													? product.netRevenue
													: (() => {
															const netRevenueValue = parseFloat(product.netRevenue.replace(/,/g, ''));
															return isNaN(netRevenueValue)
																? 'Invalid value'
																: vf_currency_to_fixed(netRevenueValue, 2);
														})()}
											</Grid>
											<Grid item xs={2}>
												{product.avgPrice === '-'
													? product.avgPrice
													: (() => {
															const avgPriceValue = parseFloat(product.avgPrice.replace(/,/g, ''));
															return isNaN(avgPriceValue) ? 'Invalid value' : vf_currency_to_fixed(avgPriceValue, 2);
														})()}
											</Grid>
											<Grid item xs={2}></Grid>
										</Grid>
									</Grid>
								))}
							</Grid>
						</div>
					</Grid>
				</div>
			)}

			{/* Adjustments */}
			{activeTabId === 2 && (
				<Grid container display="flex" direction="row" alignItems="center" justify="flex-start" spacing={3}>
					<Grid item xs={6}>
						<div className={classes.graphCard} style={{ maxWidth: '100%' }}>
							<PieChartWithLegend type="adjustments" chartData={adjustmentSummaryDetails} />
						</div>
					</Grid>
					<Grid item xs={5}>
						<div className={classes.analyticTable} style={{ width: '285px !important' }}>
							{adjustmentSummaryDetails?.length > 0 &&
								adjustmentSummaryDetails.map(item => (
									<>
										{item.name === 'Total Adjustments' && <Divider />}
										<div
											key={item.name}
											className={`${classes.dataCardWidth} ${classes.dataCardMargin} flex justifyBetween alignCenter w-100`}
										>
											<div className="flex alignCenter justifyStart">
												<Typography varient="h6" className={classes.textTransform}>
													{item.name}
												</Typography>
											</div>

											<div
												className="flex"
												style={{ minWidth: '60px', alignItems: 'center', justifyContent: 'center' }}
											>
												<Typography varient="h6" className={classes.textTransform}>
													{vf_currency_to_fixed(item.value, 2)}
													{/* {item.name === "Total Adjustments" ? Number(item.value).toFixed(2) : wrapWithBrackets(Number(item.value).toFixed(2))} */}
												</Typography>
											</div>
										</div>
									</>
								))}
						</div>
					</Grid>
				</Grid>
			)}
		</div>
	);
};

export default SummarySection;

SummarySection.propTypes = {
	checkId: PropTypes.string,
};
