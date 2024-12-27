import React from 'react';
import { useHistory } from 'react-router-dom';

import { ErrorOutline } from '@material-ui/icons';

import { formatDate } from 'components/Shared/functions';
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink.js';

import GlobalSettings, { GlobalStickyStyles } from 'GlobalSettings';

import WellIcon from '../../../components/Shared/svgIcons/well.js';

const ComponentPropertyName = ({ value, tableMeta }) => {
	const history = useHistory();
	const wellApiIndex = RevenuePropertiesHeadCells().findIndex(rp => rp.name === 'wellApiNumber'),
		wellName = RevenuePropertiesHeadCells().findIndex(rp => rp.name === 'wellName');

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
			}}
			// style={{borderRight: 'solid red'}}
		>
			<ColumnWithLink
				onClick={e => {
					e.stopPropagation();
					history.push(`/revenue/property/details/${tableMeta.rowData[0]}`);
				}}
				value={value?.split('_')?.[0] ? `${value?.split('_')?.[0]} - ${tableMeta?.rowData[2]}` : tableMeta?.rowData[2]}
				link={`/revenue/property/details/${tableMeta.rowData[0]}`}
			/>
			{/* <Button/> */}
			{!(tableMeta?.rowData[wellApiIndex] && tableMeta?.rowData[wellName]) && (
				<div
					style={{ marginLeft: '15px', cursor: 'pointer' }}
					onClick={e => {
						e.stopPropagation();
						history.push(`/revenue/property/details/${tableMeta.rowData[0]}`, { focusOnWellSearch: true });
					}}
				>
					<WellIcon size={'18'} opacity={'1'} color="gray" />
					<ErrorOutline
						style={{
							width: '17px',
							height: '17px',
							color: 'gray',
						}}
					/>
				</div>
			)}
		</div>
	);
};

// sort: true,
// filter: true,
// stickyColumn: true,
// viewColumns: false,
// display: true,

const RevenuePropertiesHeadCells = (isReportingGroup = false) => [
	{
		name: '_id',
		options: { filter: false, display: false, sort: false, viewColumns: false },
	},
	{
		/// this is the control column for properties
		name: 'purchaserNumber',
		label: 'Property',
		esKey: 'purchaserNumber.keyword',
		options: {
			...GlobalStickyStyles({ isReportingGroup }),
			filter: true,

			// setCellProps: () => ({
			//   style: {
			//     minWidth: "150px",
			//     whiteSpace: "nowrap",
			//     position: "sticky",
			//     left: "77px",
			//     background: "white",
			//     zIndex: 200,
			//     boxShadow: 'inset -1px 0px 0px 0px lightgrey',
			//   }
			// }),
			// setCellHeaderProps: () => ({
			//   style: {
			//     position: "sticky",
			//     minWidth: "150px",
			//     left: "77px",
			//     zIndex: 201,
			//     // boxShadow: 'inset -1px 0px 0px 0px lightgrey',
			//   }
			// }),

			customRender: (value, tableMeta) => <ComponentPropertyName value={value} tableMeta={tableMeta} />,
		},
	},
	{
		name: 'name',
		label: 'Property Name',
		esKey: 'name.keyword',
		options: {
			sort: true,
			filter: true,
			display: false,
		},
		// options: {
		//   ...GlobalSettings.muiGridStandardOptions,
		//   display: false,
		// }
	},
	{
		name: 'system_id',
		label: 'M1neral System ID',
		options: {
			filter: true,
			sort: true,
			display: false,
			setCellProps: () => ({
				style: {
					padding: '0px 16px',
				},
			}),
		},
		esKey: '_id.keyword',
	},

	{
		name: 'wellApiNumber',
		label: 'Well API',
		esKey: 'wells.apiNumber.keyword',
	},
	{
		name: 'wellName',
		label: 'Well Name',
		esKey: 'wells.wellName.keyword',
	},
	{
		name: 'purchaserNumber',
		label: 'Payor Prop #',
		esKey: 'purchasernumber.keyword',
		options: {
			sort: true,
			filter: true,
			display: true,
		},
	},
	{
		name: 'purchaserName',
		label: 'Purchaser',
		esKey: 'purchaser.name.keyword',
	},
	{
		name: 'number',
		label: 'Operator Prop #',
		esKey: 'number.keyword',
		options: {
			sort: true,
			filter: true,
			display: true,
		},
	},
	{
		name: 'payorName',
		label: 'Operator',
		esKey: 'operator.name.keyword',
	},
	{
		name: 'state',
		label: 'State',
		esKey: 'state.keyword',
		options: {
			sort: true,
			filter: true,
		},
		// options: {
		//   ...GlobalSettings.muiGridStandardOptions,
		// }
	},
	{
		name: 'county',
		label: 'County',
		esKey: 'county.keyword',
	},
	{
		name: 'description',
		label: 'Property description',
		esKey: 'description.keyword',
	},
	{
		name: 'status',
		label: 'Pay Status',
		esKey: 'status.keyword',
	},
	{
		name: 'checkNumber',
		label: 'Last Check #',
		esKey: 'lastCheck.checkNumber.keyword',
	},
	{
		name: 'lastChecked',
		label: 'Last Check',
		esKey: 'lastCheck.checkDate',
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},
	{
		name: 'prospectID',
		label: 'Prospect',
		esKey: 'prospectID.keyword',
	},
	{
		name: 'acquisitionID',
		label: 'Acquisition ID',
		esKey: 'acquisitionID.keyword',
	},
	{
		name: 'internalID',
		label: 'Accounting Ref ID',
		esKey: 'internalID.keyword',
		options: {
			customHeadLabelRender: () => (
				<>
					<div style={{ minWidth: 100 }}>Accounting Ref ID</div>
				</>
			),
			sort: true,
			filter: true,
		},
		style: { minWidth: 100 },
	},
	{
		name: 'internalCompany',
		label: 'Internal Company',
		esKey: 'internalCompany.keyword',
	},
	{
		name: 'source',
		label: 'Source',
		esKey: 'source.keyword',
	},
	{
		name: 'approvalStatus',
		label: 'Status',
		esKey: 'approvalStatus.keyword',
	},

	{
		name: 'createBy',
		label: 'Created By',
		esKey: 'createBy',
		options: {
			display: true,
			customRender: value => {
				return <>{value?.name}</>;
			},
		},
	},

	{
		name: 'createAt',
		label: 'Created Date',
		esKey: 'createAt',
		options: {
			display: true,
			customRender: value => {
				return <>{formatDate(value)}</>;
			},
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},

	{
		name: 'lastUpdateBy',
		label: 'Last Updated By',
		esKey: 'lastUpdateBy',
		options: {
			display: true,
			customRender: value => {
				return <>{value?.name}</>;
			},
		},
	},

	{
		name: 'lastUpdateAt',
		label: 'Last Updated Date',
		esKey: 'lastUpdateAt',
		options: {
			display: true,
			customRender: value => {
				return <>{formatDate(value)}</>;
			},
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},

	{
		name: 'tags',
		label: 'Tags',
		esKey: 'tags.tag.keyword',
		options: {
			ignoreGlobal: true,
		},
	},
	{
		name: 'commentsCounter',
		label: ' ',
		options: {
			ignoreGlobal: true,
			dbName: 'comments.comment',
			filter: false,
			searchable: false,
			sort: true,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
];

export default RevenuePropertiesHeadCells;
