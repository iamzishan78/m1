import ColumnWithLink from 'components/Shared/M1nTable/components/SubComponents/ColumnWithLink';
import { CommonSchema } from 'components/MRTTable/Schema/common_schema';
import TagCell from 'components/MRTTable/Common/TableCells/Tag';
import CommentCell from 'components/MRTTable/Common/TableCells/Comment';
import CampaignNameField from 'components/ContactDetailCard/components/FieldContent/CampaignNameField';
import vf_currency from 'components/Shared/valueformatters/vf_currency';
import Loader from 'components/Loaders';
import { globalStateController } from 'hookstate/globalStateController';
import { UPDATECUSTOMLAYER } from "graphQL/useMutationUpdateCustomLayer";
import { tableGlobalController } from 'hookstate/tableController';
import { copy } from "utils/helper";

const esIndex = 'shapes_flat';


const onCustomKeyChange = async (client, row, value, item) => {
	const loaderId = `upadting-${row?._id}`;

	try {
		Loader.createToast(loaderId, 'Updation in Progress');
		const user = globalStateController.getValue('user')

		const customData = copy(row?.shapeJson?.properties?.custom_data) ?? {};
		const filteredCustomData = _.pickBy(customData, (value) => value !== "" && !_.isEmpty(value));

		const shapeJson = {
			...row?.shapeJson,
			properties: {
				...row?.shapeJson?.properties,
				custom_data: {
					...filteredCustomData,
					[item.name]: value,
				}
			},
		}

		await client.mutate({
			variables: {
				customLayerId: row?._id,
				userId: user?._id,
				customLayer: {
					shape: JSON.stringify(shapeJson),
					shapeJson,
				},
			},
			mutation: UPDATECUSTOMLAYER,
		});
		Loader.successToast(loaderId, 'Updation Complete');
		tableGlobalController.refetch();
	} catch (err) {
		Loader.errorToast(loaderId, 'Updation in Complete');
	}
};

const TractMeta = {
	esIndex,
	pageSize: 50,
	pagination: {
		pageIndex: 0,
		pageSize: 50,
	},
	defaultSort: { field: '_ts', order: 'desc' },
	defaultFilters: [{ field: 'layer.keyword', value: 'parcel' }],
	maxTableHeight: 'calc(100vh - 550px)',
	isInFiniteScroll: true,
	columnVirtualization: true,
	onCustomKeyChange,
	TableSchema: [
		{
			...CommonSchema.HIDDEN,
			name: 'id',
			accessorKey: 'id',
		},

		{
			...CommonSchema.HIDDEN,
			name: '_id',
			accessorKey: '_id',
		},

		{
			...CommonSchema.INITAIL_PINNED,
			name: 'name.keyword',
			accessorKey: 'name',
			header: 'Tract Name',
			Cell: ({ renderedCellValue, row }) => (
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<ColumnWithLink value={renderedCellValue || row.getValue('shapeJson.properties.originalProperties.State')} link={`/map/parcels/${row.getValue('_id')}`} />
				</div>
			),
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.State.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.State,
			id: 'shapeJson.properties.originalProperties.State',
			header: 'State',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.County.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.County,
			id: 'shapeJson.properties.originalProperties.County',
			header: 'County',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.surveyMerdian.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.surveyMerdian,
			id: 'shapeJson.properties.originalProperties.surveyMerdian',
			header: 'Survey/ Meridian',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.blockTownship.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.blockTownship,
			id: 'shapeJson.properties.originalProperties.blockTownship',
			header: 'Block/ Township',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.rangeSection.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.rangeSection,
			id: 'shapeJson.properties.originalProperties.rangeSection',
			header: 'Section/ Range',
		},

		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.originalProperties.abstractNameShortName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.originalProperties?.abstractNameShortName,
			id: 'shapeJson.properties.originalProperties.abstractNameShortName',
			header: 'Abstract/ Section',
		},


		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.sdGrossAcres.keyword',
			accessorFn: row => row?.shapeJson?.properties?.sdGrossAcres,
			id: 'shapeJson.properties.sdGrossAcres',
			header: 'Gross Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.shapeArea.keyword',
			accessorFn: row => row?.shapeJson?.properties?.shapeArea,
			id: 'shapeJson.properties.shapeArea',
			header: 'Calc Acres',
		},
		// Added tract NRA column
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.netRoyalityAcres.calculatedNra.keyword',
			accessorFn: row => row?.shapeJson?.properties?.netRoyalityAcres?.calculatedNra,
			id: 'shapeJson.properties.netRoyalityAcres.calculatedNra',
			header: 'Tract NRA',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.execNetAcres.keyword',
			accessorFn: row => row?.shapeJson?.properties?.execNetAcres,
			id: 'shapeJson.properties.execNetAcres',
			header: 'Exec Net Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.nonExecNetAcres.keyword',
			accessorFn: row => row?.shapeJson?.properties?.nonExecNetAcres,
			id: 'shapeJson.properties.nonExecNetAcres',
			header: 'Non-Exec Net Acres',
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uUnitPricingNMA',
			accessorKey: 'uUnitPricingNMA',
			header: 'Target Pricing (per NMA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uUnitPricingNMA)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uMaxUnitPricingNMA',
			accessorKey: 'uMaxUnitPricingNMA',
			header: 'Max Pricing (per NMA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uMaxUnitPricingNMA)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uUnitPricing',
			accessorKey: 'uUnitPricing',
			header: 'Target Pricing (per NRA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uUnitPricing)}</>,
		},
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'uMaxUnitPricing',
			accessorKey: 'uMaxUnitPricing',
			header: 'Max Pricing (per NRA)',
			isSearchField: false,
			type: 'number',
			Cell: ({ row }) => <>{vf_currency(row?.original?.uMaxUnitPricing)}</>,
		},
		// {
		// 	...CommonSchema.COMMON_COLUMN,
		// 	name: 'shapeJson.properties.department.keyword',
		// 	accessorFn: row => row?.shapeJson?.properties?.department,
		// 	id: 'shapeJson.properties.department',
		// 	header: 'Department',
		// },
		{
			...CommonSchema.COMMON_COLUMN,
			name: 'shapeJson.properties.campaignName.keyword',
			accessorFn: row => row?.shapeJson?.properties?.campaignName,
			id: 'shapeJson.properties.campaignName',
			header: 'Campaign Name',
			size: 270,
			Cell: ({ renderedCellValue }) => <CampaignNameField value={renderedCellValue} fullWidth disabled />,
		},
		{
			...CommonSchema.TAGS,
			Cell: ({ row }) => {
				const targetSourceId = row.getValue('_id');
				const targetLabel = 'parcel';
				return <TagCell id={targetSourceId} targetSourceId={targetSourceId} tags={row?.original?.tags} targetLabel={targetLabel} />;
			},

		},
		{
			...CommonSchema.COMMENTS,
			Cell: ({ renderedCellValue, row }) => {
				const id = row.getValue('_id');
				const targetLabel = 'parcel';
				return <CommentCell id={id} value={renderedCellValue.length} targetLabel={targetLabel} />;
			},

		}
	],
};

export default TractMeta;
