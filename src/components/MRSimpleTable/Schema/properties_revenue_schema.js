import { Grid } from '@material-ui/core';
import { Sparklines, SparklinesLine } from 'react-sparklines';

import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import PropertiesRevenueToolbar from '../TablesOverride/PropertiesRevenue/PropertiesRevenueToolbar';

import { GET_PROPERTIES_REVENUE } from 'graphQL/useQueryGetPropertiesRevenue';

export const propertiesRevenueTableKey = 'PropertiesRevenue';

const PropertiesRevenueMeta = {
	query: GET_PROPERTIES_REVENUE,
	maxTableHeight: 'calc(100vh - 340px)',
	getVariables: tableMeta => {
		const { filters, filterDate, allDates = false } = tableMeta?.customProps || {};

		if (!filters && !filterDate) return;

		return {
			filters,
			filterDate,
			allDates,
		};
	},
	getDataFromRes: res => res?.data?.getPropertiesRevenue || [],
	getIdsFromRows: rows => rows?.map(row => row.node?.propertyId) || [],
	CustomToolBar: PropertiesRevenueToolbar,
	isSelectAllAllowed: false,
	isDeleteAllowed: false,
	isExportAllowed: false,
	isInFiniteScroll: true,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'propertyId',
			accessorKey: 'propertyId',
			accessorFn: row => row?.node?.propertyId,
		},
		{
			...CommonSchema.INITAIL_PINNED,
			header: 'Property',
			name: 'propertyName',
			accessorKey: 'propertyName',
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
	],
};

export default PropertiesRevenueMeta;
