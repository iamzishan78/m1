import GlobalSettings from 'GlobalSettings';
import vf_number from 'components/Shared/valueformatters/vf_number';

const unitsColumnHeaders = [
	{
		name: 'id',
		options: {
			display: false,
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: '_id',
		options: {
			display: false,
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'name',
		label: 'Unit Name',
		esKey: 'name.keyword',
		options: {
			...GlobalSettings.muiGridControlOptions,
			sort: true,
			filter: true,
			customRender: (value, tableMeta) => {
				return (
					<a
						href={`/map/units/${tableMeta.rowData[0]}?tenant=${window.sessionStorage.getItem('tenantName')}`}
						style={{ fontWeight: 600, color: '#17aadd', cursor: 'pointer', textDecoration: 'initial' }}
						rel="noreferrer"
					>
						{value}
					</a>
				);
			},
		},
		style: { minWidth: 185 },
	},
	{
		name: 'uNumber',
		label: 'Unit #',
		esKey: 'shapeJson.properties.uNumber.keyword',
		options: {
			sort: true,
			filter: true,
			setCellProps: () => ({ style: { minWidth: '125px' } }),
		},
	},
	{
		name: 'State',
		label: 'State',
		esKey: 'shapeJson.properties.originalProperties.State.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'County',
		label: 'County',
		esKey: 'shapeJson.properties.originalProperties.County.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'SurveyMeridian',
		label: 'Survey/ Meridian',
		esKey: [
			'shapeJson.properties.originalProperties.Survey.keyword',
			'shapeJson.properties.originalProperties.PrincipalMeridian.keyword',
		],
		options: {
			dbName: 'shapeJson.properties.originalProperties.0?.Survey?.PrincipalMeridian?',
			sort: true,
			filter: true,
		},
	},
	{
		name: 'BlockTownship',
		label: 'Block/ Township',
		esKey: [
			'shapeJson.properties.originalProperties.Block.keyword',
			'shapeJson.properties.originalProperties.Township.keyword',
		],
		options: {
			dbName: 'shapeJson.properties.originalProperties.0?.Block?.Township?',
			sort: true,
			filter: true,
		},
	},
	{
		name: 'SectionRange',
		label: 'Section/ Range',
		esKey: [
			'shapeJson.properties.originalProperties.Section.keyword',
			'shapeJson.properties.originalProperties.Range.keyword',
		],
		options: {
			dbName: 'shapeJson.properties.originalProperties.0?.Section?.Range?',
			sort: true,
			filter: true,
		},
	},
	{
		name: 'AbstractSection',
		label: 'Abstract/ Section',
		esKey: [
			'shapeJson.properties.originalProperties.AbstractName.keyword',
			'shapeJson.properties.originalProperties.ShortName.keyword',
		],
		options: {
			dbName: 'shapeJson.properties.originalProperties.0?.AbstractName?.ShortName?',
			sort: true,
			filter: true,
		},
	},
	// {
	//   name: "Block",
	//   label: "Block",
	//   esKey: "shapeJson.properties.originalProperties.Block.keyword",
	//   options: {
	//     sort: true,
	//     filter: true,
	//   },
	// },
	// {
	//   name: "Section",
	//   label: "Section",
	//   esKey: "shapeJson.properties.originalProperties.Section.keyword",
	//   options: {
	//     sort: true,
	//     filter: true,
	//   },
	// },
	{
		name: 'uAcres',
		label: 'Unit Acres',
		esKey: 'shapeJson.properties.uAcres.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'uUnitPricing',
		label: 'Target Price/Acre',
		esKey: 'shapeJson.properties.uUnitPricing.keyword',
		options: {
			sort: true,
			filter: true,
			customRender: value => <p>{value ? `$${vf_number(value)}` : ''}</p>,
		},
	},
	{
		name: 'uMaxUnitPricing',
		label: 'Max Price/Acre',
		esKey: 'shapeJson.properties.uMaxUnitPricing.keyword',
		options: {
			sort: true,
			filter: true,
			customRender: value => <p>{value ? `$${vf_number(value)}` : ''}</p>,
		},
	},
	{
		name: 'uStatus',
		label: 'Status',
		esKey: 'shapeJson.properties.uStatus.keyword',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'ownersCount',
		label: 'Owner Count',
		esKey: 'interestSummary.unitInterestCount',
		options: {
			sort: true,
			filter: true,
		},
	},
	{
		name: 'netRoyalityAcres',
		label: 'Unit NRA',
		esKey: 'shapeJson.properties.netRoyalityAcres.unitNra',
		options: {
			sort: true,
			filter: true,
			customRender: value => {
				return vf_number(Math.round(value?.unitNra));
			},
		},
	},
	{
		name: 'campaignName',
		label: 'Campaign Name',
		esKey: 'shapeJson.properties.campaignName.keyword',
		options: {
			customRender: value => {
				return typeof value !== 'string' ? value.join(', ') : value;
			},
			setCellProps: () => ({ style: { minWidth: '200px' } }),
			sort: true,
			filter: true,
		},
	},
	{
		name: 'qualifier',
		label: 'Qualifier',
		esKey: 'shapeJson.properties.qualifier.name.keyword',
		options: {
			sort: true,
			filter: true,
			setCellProps: () => ({ style: { minWidth: '125px' } }),
		},
	},
	//hiding temporarily until we get the chart fixed -kc 20220327
	// {
	//   name: "unitStatus",
	//   label: "Unit Status",
	//   options: {
	//     sort: true,
	//     filter: false,
	//   },
	// },
	{
		name: 'lastUpdated',
		label: 'Last Updated',
		esKey: '_ts',
		options: {
			sort: true,
			filter: true,
		},
		custom: {
			key_as_string: true,
			isDateTime: true,
		},
	},
	{
		name: 'tags',
		label: 'Tags ',
		esKey: 'tags.tag.keyword',
		options: {
			ignoreGlobal: true,
			dbName: 'tags.tag',
			sort: true,
			download: false,
			print: false,
			filter: true,
			filterOptions: {
				names: [],
			},
		},
	},
	{
		name: 'commentsCounter',
		label: ' ',
		options: {
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
];

export default unitsColumnHeaders;
