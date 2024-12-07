/* props is just a style object*/
const BulkDataHeadCells = [
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
		label: 'Name',
		esKey: 'name.keyword',
	},
	{
		name: 'type',
		label: 'Type',
		esKey: 'type.keyword',
		options: {
			display: true,
			filter: true,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'progress',
		label: 'Progress',
		options: {
			display: true,
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'on',
		label: 'On',
		esKey: 'ts',
		options: {
			display: true,
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'by',
		label: 'By',
		esKey: 'user',
		options: {
			display: true,
			filter: true,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
		},
	},
	{
		name: 'status',
		label: 'Status',
		options: {
			display: true,
			filter: false,
			searchable: false,
			sort: false,
			download: false,
			print: false,
			viewColumns: false,
			customRender: (value, tableMeta) => {
				return (
					<>
						<span
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								color: value === 'Failed' || value === 'Completed' ? 'white' : '',
								fontWeight: 600,
								backgroundColor: value === 'Failed' ? '#FF7C7F' : value === 'Completed' ? '#A9D18E' : '',
								cursor: 'pointer',
								textDecoration: 'initial',
								padding: '4px 10px',
							}}
						>
							{value}
						</span>
					</>
				);
			},
		},
	},
];

export default BulkDataHeadCells;
