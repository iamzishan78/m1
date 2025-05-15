import React from 'react';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import { Grid } from '@material-ui/core';

import ColumnWithLink from 'components/MRTTable/Common/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';

import { GET_PROPERTIES_REVENUE } from 'graphQL/useQueryGetPropertiesRevenue';

const baseTableSchema = [
	{
		...CommonSchema.HIDDEN,
		name: 'propertyId',
		id: 'propertyId',
		header: 'Property Id',
		accessorFn: row => row?.node?.propertyId,
	},
	{
		...CommonSchema.INITAIL_PINNED,
		header: 'Property',
		name: 'propertyName',
		id: 'propertyName',
		size: 550, // width of the column
		Cell: ({ row }) => {
			let link = `/revenue/property/details/${row?.original?.propertyId}`;
			const data = { ...row.original };
			delete data.purchaserNumber;
			delete data.propertyName;
			delete data.propertyId;

			return (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						minWidth: '500px',
					}}
				>
					<Grid
						container
						spacing={0}
						direction="row"
						style={{
							flex: 1,
							position: 'absolute',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							textOverflow: 'ellipsis',
							alignItems: 'center',

							'&:hover': {
								'& $actionButtons': {
									display: 'flex',
								},
							},
						}}
					>
						<Grid
							item
							style={{
								display: 'flex',
								justifyContent: 'flex-start',
							}}
						>
							<ColumnWithLink
								value={`${row?.original?.purchaserNumber || ''} - ${row?.original?.propertyName || ''}`}
								link={link}
								onClick={e => {
									e.stopPropagation();
								}}
							/>
						</Grid>
					</Grid>
					{/* sparklines for the data */}
					<div
						style={{
							width: '20%',
							height: 'auto',
							marginLeft: 'auto',
							zIndex: '9999',
						}}
					>
						<Sparklines data={Object.values(data)}>
							<SparklinesLine color="green" />
						</Sparklines>
					</div>
				</div>
			);
		},
	},
];

const PropertiesRevenueMeta = {
	query: GET_PROPERTIES_REVENUE,
	maxTableHeight: 'calc(100vh - 340px)',
	getVariables: tableMeta => {
		const { filters, filterDate, allDates = false } = tableMeta?.customProps || {};

		if (!filters && !filterDate) {
			return;
		}

		return {
			filters,
			filterDate,
			allDates,
		};
	},
	getDataFromRes: res => res?.data?.getPropertiesRevenue || [],
	getIdsFromRows: rows => rows?.map(row => row.node?.propertyId) || [],
	isClientSide: true,
	disableRowSelection: true,
	isDeleteDisabled: true,
	isExportDisabled: true,
	enableFacetedValues: true,
	isInFiniteScroll: true,
	isGeneric: true,
	TableSchema: baseTableSchema,
	generateSchema: (keys, rows) => {
		const baseKeys = ['propertyId', 'propertyName', 'purchaserNumber'];
		const monthKeys = keys.filter(key => !baseKeys.includes(key)) || [];

		const dyamicSchema = monthKeys?.map(month => ({
			...CommonSchema.SELECT_STRING_COLUMN,
			header: month,
			id: month,
			name: month,
			accessorFn: row => {
				const value = row?.[month] === 0 ? '0' : row?.[month] || '0';
				return vf_currency_to_fixed(value, value === '0' ? 0 : 2);
			},
		}));

		return [...baseTableSchema, ...dyamicSchema];
	},
};

export default PropertiesRevenueMeta;
