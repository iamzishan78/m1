const ProductionDetailsHeaders = [
	{
		name: 'Id',
		editable: false,
		options: {
			display: false,
			filter: false,
			searchable: false,
			sort: true,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'propertyNumber',
		label: 'Property Number',
		esKey: 'property.number.keyword',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'propertyName',
		label: 'Property Number',
		esKey: 'property.name.keyword',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'apiNumber',
		label: 'API Number',
		esKey: 'wells.apiNumber.keyword',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'wellName',
		label: 'Well Name',
		esKey: 'wells.wellName.keyword',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'date',
		label: 'Sales Date',
		esKey: 'date',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},
	{
		name: 'product',
		label: 'Product',
		esKey: 'product.keyword',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'reportedVolume',
		label: 'Reported Volume',
		esKey: 'data.allocatedGas',
		options: {
			filter: false,
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'statementVolume',
		label: 'Statement Volume',
		esKey: 'grossPropertyVolume',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'reportDate',
		label: 'Report Date',
		esKey: 'wells.production.data.ReportDate',
		options: {
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
		custom: {
			key_as_string: true,
			isDate: true,
		},
	},
	{
		name: 'oilProduction',
		label: 'Oil Production',
		esKey: 'wells.production.data.allocatedOil',
		options: {
			filter: false,
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'gasProduction',
		label: 'Gas Production',
		esKey: 'wells.production.data.allocatedGas',
		options: {
			filter: false,
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
		},
	},
	{
		name: 'overShort',
		label: 'Over/Short',
		esKey: 'data.allocatedWater',
		options: {
			filter: false,
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
			customRender: (value, tableMeta) => {
				return (
					<p
						style={{
							fontWeight: 600,
							color: value > 0 ? '#177B1E' : '#F4273D',
						}}
					>
						{value > 0 ? value : value * -1}
					</p>
				);
			},
		},
	},
	{
		name: 'difference',
		label: '% Difference',
		esKey: 'data.allocatedWater',
		options: {
			filter: false,
			sort: true,
			searchable: false,
			download: false,
			print: true,
			viewColumns: true,
			selectableRows: false,
			customRender: (value, tableMeta) => {
				return (
					<p
						style={{
							fontWeight: 600,
							color: tableMeta.rowData[tableMeta.columnIndex - 1] > 0 ? '#177B1E' : '#F4273D',
						}}
					>
						{value?.replace('-', '')}
					</p>
				);
			},
		},
	},
];

export default ProductionDetailsHeaders;
