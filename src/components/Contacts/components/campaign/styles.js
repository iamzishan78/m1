import { makeStyles } from '@material-ui/styles';

const getDealNameFieldHeight = title => {
	const lineLength = Math.ceil(title.length / 53);
	return `${24 * lineLength}px !important`;
};

export const useStyles = makeStyles(() => ({
	header: {
		borderBottom: '1px solid rgba(224, 224, 224, 1)',
		backgroundColor: '#F2F2F2',
		minHeight: '64px',
		display: 'flex',
		position: 'relative',
		alignItems: 'center',
	},
	heading: {
		padding: '10px 20px 20px 30px',
		fontWeight: '600',
		fontSize: '20px',
	},
	detailHeader: {
		backgroundColor: '#fff',
		marginTop: '7px',
	},
	title: {
		width: '100%',
		display: 'flex',
	},
	titleText: {
		width: '100%',
	},
	tagsContainer: {
		display: 'flex',
		flexDirection: 'row',
	},
	highlighter: {
		background: '#263451',
		padding: '5px 16px',
		borderRadius: 4,
		width: 'max-content',
		transform: 'translateX(5px) translateY(11px)',
		height: '32px',
	},
	highlight: {
		color: '#ffffff',
		textTransform: 'uppercase',
		fontWeight: 'bold',
	},
	menuIcon: {
		background: 'transparent',
		align: 'center',
		'& svg': {
			fill: '#808080 !important',
		},
	},
	tags: {
		'& fieldset': {
			border: 'none',
		},
		width: '74%',
	},
	menu: {
		'& .MuiListItem-gutters': {
			paddingLeft: '10px !important',
			paddingRight: '10px !important',
		},
		'& .MuiListItem-root': {
			'& .MuiListItemIcon-root': {
				minWidth: '25px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
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
	inputFieldDealName: props => ({
		width: '542px',
		'& .MuiTextField-root': {
			'& .MuiInputBase-multiline': {
				'& .MuiInputBase-inputMultiline': {
					height: props.name.length > 0 ? getDealNameFieldHeight(props.name) : 'auto !important',
				},
			},
		},
	}),
	dealNameRoot: {
		fontWeight: 'bold',
		paddingLeft: 0,
		textAlign: 'left',
		fontSize: '1.2rem',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			border: '1px solid black',
		},
	},
	notchedOutline: {
		border: 0,
	},
	metaButton: ({ metaCollapse }) => ({
		backgroundColor: !metaCollapse ? '#eceded' : '#fff',
		'&:hover': {
			backgroundColor: !metaCollapse ? '#eceded' : '#fff',
		},
	}),
	tabsDetailContainer: ({ metaCollapse }) => ({
		paddingTop: '5px',
		width: !metaCollapse ? 'calc(100% - 627px)' : '100%',
	}),
	actionsContainer: {
		display: 'flex',
		direction: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	tabsHeader: {
		background: '#ffffff',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
	},
	tabsSection: {},
	tabDetailSection: {
		padding: 20,
		background: '#ffffff',
	},
}));

export const headerStyles = makeStyles(theme => ({
	cardHeaderTypography: {
		whiteSpace: 'nowrap', // Prevents text from wrapping
		overflow: 'hidden', // Hides any overflow
		textOverflow: 'ellipsis', // Show ellipsis (...) when text overflows
		maxWidth: '100%', // Ensure the text does not overflow its container
		display: 'inline-block', // Ensures that the Typography component is displayed as an inline-block element
	},
	dateRoot: {
		border: '1px solid #EBEBEB',
		backgroundColor: '#fff',
		'&.Mui-focused fieldset': {
			border: '1px solid black',
			backgroundColor: 'transparent',
		},
		'&:hover': {
			backgroundColor: '#EBEBEB',
		},
		'&:active': {
			border: '1px solid black',
			backgroundColor: '#fff',
		},
	},
	cardsWrapper: {
		display: 'flex',
		marginLeft: '8%',
	},
	card: {
		width: '25%',
		height: '150px',
		borderRadius: '0px',
	},
	leftCard: {
		border: '2px solid #17aae0',
		backgroundColor: '#cceefb',
		'border-top-left-radius': '8px',
		'border-bottom-left-radius': '8px',
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		justifyContent: 'space-between',
		'& .MuiTypography-root': {
			fontWeight: 'bold',
			fontSize: '1.75rem',
		},
	},
	statusControl: {
		justifyContent: 'space-between',
		margin: '16px 10px 16px 5px',
		'& .MuiTypography-root': {
			color: '#19a9dd',
			fontSize: '1.50rem',
		},
	},
	addDataButton: {
		backgroundColor: 'white',
		color: 'black',
		textTransform: 'capitalize',
		'&:hover': {
			backgroundColor: theme.palette.common.white,
			opacity: 0.15,
		},
	},
}));
