import UnitIcon from 'components/Shared/svgIcons/unit';
import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { vf_currency_to_fixed } from 'components/Shared/valueformatters/vf_currency';
import ListChips from 'components/Common/ListChips';
import { CommonSchema } from './common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';

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
			left: '115px',
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
			...CommonSchema.INITAIL_PINNED,
			name: 'contact.entityDetail.name.keyword',
			accessorKey: 'contact.entityDetail.name',
			header: 'Contact Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink
						value={renderedCellValue}
						link={`/contact/details/${row?.original?.contactId}`}
						onClick={e => {
							e.stopPropagation();
						}}
					/>
				</div>
			),
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
			name: 'taxYear',
			accessorKey: 'taxYear',
			header: 'Tax Year',
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
			name: 'nra',
			accessorKey: 'nra',
			header: 'NRA',
			isSearchField: false,
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shape.shapeJson.properties.uUnitPricing.keyword',
			accessorKey: 'shape.shapeJson.properties.uUnitPricing',
			header: 'Price/NRA',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'offer_price',
			accessorKey: 'offer_price',
			header: 'Offer Price',
			isSearchField: false,
			Cell: ({ row }) => {
				return <p>{vf_currency_to_fixed(row?.original?.offer_price, 2)}</p>
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
				const targetSourceId = row.getValue('_id');
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={'unit'} />;
			},
		},
	],
};

export default UnitInterestMeta;
