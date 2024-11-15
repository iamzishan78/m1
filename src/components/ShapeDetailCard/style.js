import { makeStyles } from '@material-ui/core/styles';

export const detailCardStyles = makeStyles(theme => ({
	summaryCard: {
		backgroundColor: 'white',
		paddingLeft: '10px',
		paddingRight: '10px',
		paddingTop: '8px',
		paddingBottom: '60px',
	},
	summaryDetailCard: {
		paddingLeft: '18px',
		paddingTop: '8px',
	},
	summaryValue: {
		display: 'inline-flex',
		bottom: '5px',
		position: 'relative',
		marginRight: '5px',
		fontWeight: 'bold',
		color: '#848484',
	},
	documentHeader: {
		'& svg': {
			transform: 'translate(-4%, 22%)',
		},
	},
	descriptionInput: {
		width: '100%',
		'& .MuiTextField-root': {
			backgroundColor: '#fffcdc',
		},
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
	},
	tags: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
	},

	///////////////////////
	gridWidthScroll: {
		maxHeight: '100%',
		overflowX: 'auto',
		overflowY: 'hidden',
		// overflow: "auto",

		'& .MuiTabs-indicator': {
			// marginLeft: "14px !important",
			bottom: '10px !important',
		},
		'& .MuiTab-root': {
			padding: '15px 12px !important',
		},
		'& .MuiAppBar-root': {
			height: '60px',
		},

		'&::-webkit-scrollbar': {
			height: '0.4em',
			width: '0.4em',
		},
		'&::-webkit-scrollbar-track': {
			'-webkitBoxShadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: '#929292',
			borderRadius: 5,
		},
	},
	agreementSubContent: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 675px) !important',
				},
			},
		},
	},
	subContent: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 443px) !important',
					'& .MuiTableCell-paddingCheckbox': {
						position: 'sticky',
					},
				},
			},
		},
	},
	subContent3: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 483px) !important',
					'& .MuiTableCell-paddingCheckbox': {
						position: 'sticky',
					},
				},
			},
		},
	},
	subContent2: {
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					height: 'calc(100vh - 35vh ) !important',
					'& .MuiTableCell-paddingCheckbox': {
						position: 'unset',
					},
				},
			},
		},
	},
	parcelDocument: {
		'& .MuiTableRow-root': {
			'&>:nth-child(2) ': {
				'& .fileName': {
					width: '375px !important',
				},
			},
		},
	},
	maxWidth: {
		width: '100%',
	},
	toogleButtons: {
		zIndex: '9999',
		padding: '0.5rem 0.75rem 0.5rem 1.25rem',
	},
}));

export const summaryStyles = makeStyles(theme => ({
	provisionCard: {
		backgroundColor: '#F6F8F9',
		padding: '10px',
		'& .heading': {
			fontWeight: 'bold',
			paddingBottom: '20px',
			fontSize: 'larger',
		},
		'& .text': {
			fontWeight: 'bold',
		},
		'& .MuiSvgIcon-root': {
			marginRight: '10px',
		},
		'& .uncheck': {
			opacity: 0.5,
		},
		'& .provisionRow': {
			paddingBottom: '10px',
		},
	},
	summaryCard: {
		paddingLeft: '10px',
		paddingRight: '10px',
		paddingTop: '8px',
		paddingBottom: '60px',
	},
	summaryDetailCard: {
		marginLeft: 0,
		paddingTop: '8px',
		height: '53px',
	},
	summaryValue: {
		display: 'inline-flex',
		bottom: '5px',
		position: 'relative',
		marginRight: '2px',
		fontWeight: 'bold',
		color: '#848484',
	},
	descriptionInput: {
		width: '100%',
		padding: '8px 0px !important',
		'& .MuiTextField-root': {
			backgroundColor: '#fffcdc',
		},
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
		'& textarea': {
			maxHeight: '130px',
		},
	},
	commentSection: {
		padding: '0px !important',
	},
	icon: {
		color: '#757575',
		fontSize: '26px',
	},
	tags: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
	},

	///////////////////////
	grid: {
		width: 'auto',
	},
	foodText: {
		position: 'absolute',
		bottom: '20px',
		// zIndex: "51",
		right: '0px',
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0 !important',
		textAlign: 'right',
		height: '0',
		paddingRight: '10px',
		'& span': {
			fontWeight: 'bold',
		},
	},
	documentHeader: {
		display: 'flex',
		'& span': {
			marginTop: '2px',
			marginLeft: '5px',
		},
	},
	parcelDocument: {
		'& .MuiTableRow-root': {
			'&>:nth-child(2) ': {
				'& .fileName': {
					width: '375px !important',
				},
			},
		},
	},

	search: {
		position: 'relative',

		borderRadius: theme.shape.borderRadius,
		'&:hover': {
			backgroundColor: theme.palette.common.white,
			// opacity: 0.15,
		},
		marginLeft: 0,
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: theme.spacing(1),
			width: 'auto',
		},
	},
	searchIcon: {
		padding: theme.spacing(0, 2),
		height: '100%',
		position: 'absolute',
		// pointerEvents: 'none',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	inputRoot: {
		cursor: 'pointer',
		color: 'inherit',
	},
	inputInput: {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: props => (props.search.length > 0 ? '37ch' : '0.9px'),
			'&:focus': {
				backgroundColor: theme.palette.common.white,
				opacity: 0.75,
				width: '37ch',
			},
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
	paddingLeft: {
		paddingRight: '20px',
	},
}));

export const summaryTableStyles = makeStyles(theme => ({
	table: {
		width: '100%',
		height: '100%',
		margin: '0px',
		padding: '0px',
		border: '1px solid rgba(224, 224, 224, 1)',
		// borderStyle: "none",
	},
	rowGrey: {
		background: '#f7f8f9',
		border: '0px',
	},
	rowWhite: {
		background: '#FFF',
		border: '0px',
	},
	nraHighLight: {
		fontWeight: '900',
		fontSize: '14px',
		lineHeight: '18px',
		color: 'dodgerblue',
	},
	nraText: {
		fontSize: '14px',
	},
	cell1: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		width: '43%',
		fontWeight: 'bolder',
		fontSize: '13px',
		lineHeight: '18px',
		color: 'black',
		borderRight: '1px solid rgba(224, 224, 224, 1)',
	},
	cell2: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '14px',
		lineHeight: '18px',
		color: '#75767A',
		height: '55px',
		// display: 'flex',
		// justifyContent: "center",
	},

	select: {
		height: '38px',
		// "& .MuiOutlinedInput-root": {
		//   height: "38px",
		// },
	},
	positionRenewIcon: {
		position: 'absolute',
		right: '17%',
		bottom: '0px',
		top: '0px',
	},
	baseValueChanged: {
		width: '100%',
		'& .MuiInputBase-input': {
			color: 'dodgerblue',
			fontWeight: 'bold',
			fontSize: '14px',
		},
	},
	foodText: {
		position: 'absolute',
		bottom: '20px',
		right: '0px',
		fontSize: '10px',
		color: '#6e6e6e',
		margin: '0 !important',
		textAlign: 'right',
		height: '0',
		paddingRight: '10px',
		'& span': {
			fontWeight: 'bold',
		},
	},
	linkTooltip: {
		position: 'absolute',
		top: '0',
		left: '0',
		backgroundColor: '#fff',
		border: '1px solid #ccc',
		padding: '8px',
		borderRadius: '4px',
		zIndex: 1,
		boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
	},
}));
