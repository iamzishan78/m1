import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(theme => ({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '15px 30px',
	},

	dialogActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			fill: '#d9d9d9',
			'&:hover': {
				fill: '#b5b2b2',
			},
		},
	},

	btnColor_active: {
		color: 'white',
		backgroundColor: '#4576CF',
	},

	btnColor_disabled: {
		color: 'white !important',
		backgroundColor: 'rgba(69, 118, 207, 0.5)',
	},

	assetsContainer: {
		marginTop: '20px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
	},

	tableWrapper: {
		maxHeight: '500px', // Set the maximum height
		overflowY: 'auto', // Enable vertical scrolling
		width: '80%',
	},

	assetTable: {
		width: '100%',
		borderCollapse: 'collapse',
		'& th, & td': {
			border: '1px solid #ddd',
			padding: '8px',
		},
		'& th': {
			backgroundColor: '#f2f2f2',
			position: 'sticky',
			top: '0', // Stick to the top of the container
		},
	},

	columnContainer: {
		width: '100%',
		marginLeft: '80px',
	},

	entityRow: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
	},

	actionButton: {
		marginLeft: theme.spacing(1),
	},
}));
