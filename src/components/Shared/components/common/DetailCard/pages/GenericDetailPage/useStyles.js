const { makeStyles } = require('@material-ui/core');

const useStyles = makeStyles(theme => ({
	gridStyling: {
		'& .MuiListItem-container': {
			borderBottom: '1px solid #c7c7c7',
		},
	},
	userName: {
		color: '#919191',
		minWidth: '50%',
		maxWidth: 'calc( 100% - 400px)',
		float: 'left',
		fontWeight: 'bold',
		'& h2': {
			margin: '0',
			color: '#202020',
			fontSize: '1.7em',
			maxWidth: '100%',
		},
		'& p': {
			margin: '0',
			maxWidth: '100%',
		},
		'& h4': { margin: '0' },
		'& a': { color: '#919191 !important' },
	},
	Comments: {
		'& fieldset': {
			border: '2px solid #DADEDF',
		},
		'& textarea': {
			fontSize: '0.85rem',
		},
	},
	addressIcon: { top: '3px', position: 'relative' },
	socialMediaSection: {
		verticalAlign: 'sub',
		'& svg': { fontSize: '1.7rem' },
	},
	twitterIcon: {
		background: '#17AADD',
		color: '#fff',
		height: '21px',
		width: '21px',
		padding: '1px',
		margin: '3px',
		borderRadius: '2px',
	},
	menuIcon: {
		padding: '0px !important',
		margin: '0px 15px !important',
		'& svg': {
			cursor: 'pointer',
			fill: '#808080 !important',
		},
	},

	contactDataButton: {
		margin: '0px 5px',
		fontWeight: '600',
		border: '3px solid #eeebeb',
	},
	titleText: {
		marginLeft: 16,
		width: '100%',
		display: 'flex !important',
		flexDirection: 'column',
	},
	highlighter: {
		background: '#263451',
		padding: '5px 16px',
		borderRadius: 16,
		width: 'max-content',
		transform: 'translateX(5px) translateY(11px)',
		height: '32px',
	},
	highlight: {
		color: '#ffffff',
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	tags: {
		'& fieldset': {
			border: 'none',
		},
		width: 'calc(100vw - 785px)',
	},
	metaActions: {
		position: 'absolute',
		right: '15px',
		'& button': {
			margin: '0px 5px',
			color: 'grey',
			fontWeight: 'bold',
			textTransform: 'capitalize',
			padding: '6px 12px',
		},
	},
}));

export default useStyles;
