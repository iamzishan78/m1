import UnitIcon from 'components/Shared/svgIcons/unit';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import ListChips from 'components/Common/ListChips';
import { CommonSchema } from './common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import Avatar from 'react-avatar';
import MonetizationOnIcon from '@material-ui/icons/LocalAtmOutlined';
import ColumnWithLink from 'components/Common/MRTable/ColumnWithLink';
import FeatureFlag from '../Common/TableCells/FeatureFlagComponent';
import { FEATURES } from 'components/Shared/FeatureFlag/common';

const esIndex = 'shapeowners_flat';

const UnitInterestMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	gridViewSettings: {
		label: 'Unit Interests',
		module: 'UnitInterest',
		Icon: UnitIcon,
		defaultView: {
			name: 'All Unit Interests',
			type: 'Default',
		},
		handleDefaultView: (view, user) => {
			if (view?.name === 'My Unit Interest') {
				view.filters[0].value = user._id;
			}
			return view;
		},
		cssOverride: {
			top: '161px',
			left: '190px',
		},
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'shape.layer.keyword', value: 'unit' }],
	maxTableHeight: 'calc(100vh - 215px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	deletedKeys: {
		mainRecord: { key: '_id' },
		parentRecord: { key: 'shape._id' }
	},
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.HIDDEN,
			name: 'contact._id.keyword',
			accessorKey: 'contact._id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			accessorKey: 'contact.entityDetail.name',
			header: 'Contact Name',
			size: 500,
			Cell: ({ renderedCellValue, row }) => {
				const isPurchased = [true, 'true', 'True'].includes(row?.original?.contact?.isPurchased);
				return (<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					{typeof row?.original?.contact?.entityDetail?.name === 'string' && (
						<Avatar
							color={Avatar.getRandomColor(row?.original?.contact?.entityDetail?.name, ['#b5d2f6', '#ade2e9', '#eaeaea', '#f2c1e2', '#d7d6fb'])}
							fgColor="#000"
							name={row?.original?.contact?.entityDetail?.name.split(' ').splice(0, 2).join(' ')}
							size="35"
							round

						/>
					)}

					<p
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							minWidth: '300px',
							marginLeft: '10px',
						}}
					>
						<ColumnWithLink
							value={row?.original?.contact?.entityDetail?.name}
							link={`/contact/details/${row?.original?.contact?._id}`}
							onClick={e => {
								e.stopPropagation();
							}}
						/>
						{isPurchased && (
							<FeatureFlag feature={FEATURES.IDICORE}>
								<MonetizationOnIcon
									style={{
										marginLeft: '10px',
										color: "gray"
									}}

								/>
							</FeatureFlag>
						)}
					</p>
				</div>)
			}
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.currentAddress.keyword',
			accessorKey: 'contact.entityDetail.currentAddress',
			header: 'Current Address',
			isExportAllowed: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.entityDetail.primaryAddress.keyword',
			accessorKey: 'contact.entityDetail.primaryAddress',
			header: 'Primary Address',
			isExportAllowed: true,
			hidden: true,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uName.keyword',
			accessorKey: 'shape.shapeJson.properties.uName',
			header: 'Unit Name',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uNumber.keyword',
			accessorKey: 'shape.shapeJson.properties.uNumber',
			header: 'Unit #',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uAcres.keyword',
			accessorKey: 'shape.shapeJson.properties.uAcres',
			header: 'Unit Acres',
		},


		{
			...CommonSchema.COMMON_COLUMN,
			name: 'working_interest',
			accessorKey: 'working_interest',
			header: 'WI',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'royalty_interest',
			accessorKey: 'royalty_interest',
			header: 'RI',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'orri',
			accessorKey: 'orri',
			header: 'ORRI',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nri',
			accessorKey: 'nri',
			header: 'NRI',
			isSearchField: false,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'net_acres',
			accessorKey: 'net_acres',
			header: 'Net Acres',
			isSearchField: false
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			isSearchField: false,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'unitTractId.keyword',
			accessorKey: 'unitTractId',
			header: 'Unit Tract ID',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'tractAcres',
			accessorKey: 'tractAcres',
			header: 'Unit Tract Acres',
			isSearchField: false
		},

		// {
		// 	...CommonSchema.COMMON_COLUMN,
		// 	name: 'shape.shapeJson.properties.uUnitPricing.keyword',
		// 	accessorKey: 'shape.shapeJson.properties.uUnitPricing',
		// 	header: 'Price/NRA',
		// },

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Target Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.offer_price, 2)}</p>
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'max_offer_price',
			accessorKey: 'max_offer_price',
			header: 'Max Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.max_offer_price, 2)}</p>
			},
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'actual_offer_price',
			accessorKey: 'actual_offer_price',
			header: 'Actual Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.actual_offer_price, 2)}</p>
			},
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.contactStatus.keyword',
			accessorKey: 'contact.contactStatus',
			header: 'Contact Status',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contactOwners.keyword',
			accessorKey: 'contactOwners',
			header: 'Contact Owner',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'contact.status.keyword',
			accessorKey: 'contact.status',
			header: 'Stage',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignName.keyword',
			accessorKey: 'campaignName',
			header: 'Campaign Name',
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'campaignPriority.keyword',
			accessorKey: 'campaignPriority',
			header: 'Campaign Priority',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.reviewer.name.keyword',
			accessorKey: 'shape.shapeJson.properties.reviewer.name',
			header: 'Reviewer',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.qualifier.name.keyword',
			accessorKey: 'shape.shapeJson.properties.qualifier.name',
			header: 'Qualifier',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'dataSource.keyword',
			accessorKey: 'dataSource',
			header: 'Data Source',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'taxYear',
			type: 'number',
			accessorKey: 'taxYear',
			header: 'Tax Year',
			isSearchField: false
		},


		{
			...CommonSchema.COMMON_COLUMN,
			name: 'deals.name.keyword',
			accessorKey: 'deals.name',
			header: 'Associated Deals',
			Cell: ({ row }) => {
				return (
					<div>
						{(row?.original?.deals && Array.isArray(row?.original?.deals)) ? (
							<div
								style={{
									display: 'flex',
									flexWrap: 'wrap',
								}}
							>
								<ListChips list={row?.original?.deals} />
							</div>
						) : (
							<div />
						)}
					</div>
				);
			},
		},

		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('contact._id');
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'Unit Ownership'} />;
			},
		},
	],
};

export default UnitInterestMeta;
