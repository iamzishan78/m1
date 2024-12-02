import { makeStyles } from '@material-ui/core/styles';

export const usetableStyles = makeStyles(() => ({
	container: {
		padding: '0 !important',
		'& .MuiTableCell-head': {
			paddingLeft: p => (p.isAgreementsTable ? '17px !important' : ' '),
		},

		'& .MuiTableRow-hover': {
			'&:hover': {
				'& .MuiTableCell-root': {
					backgroundColor: '#dfdfdf !important',
				},
			},
		},
		// "& ::-webkit-scrollbar": {
		//   height: "0.7em !important",
		// },
		'& .MuiTableRow-footer': {
			visibility: p => (p.isHideFooter ? 'hidden' : ''),
			display: p => (p.isHideFooter ? 'none' : ''),
		},
	},
	subComponentsClasses: {
		'& .MuiTableHead-root': {
			zIndex: p => (p.isRevenueTable ? 995 : 0),
		},
		'& div': {
			'&>.MuiPaper-root': {
				'&>:nth-child(3)': {
					maxHeight: '67vh',
					minHeight: '67vh',
					'@media (max-height:1600px)': {
						maxHeight: '65vh',
						minHeight: '65vh',
					},
					'@media (max-height:1400px)': {
						maxHeight: '60vh',
						minHeight: '60vh',
					},
					'@media (max-height:1300px)': {
						maxHeight: '56vh',
						minHeight: '56vh',
					},
					'@media (max-height:1200px)': {
						maxHeight: '58vh',
						minHeight: p => (p.isFullHeight ? '75vh' : '58vh'),
					},
					'@media (max-height:1100px)': {
						maxHeight: '51vh',
						minHeight: '51vh',
					},
					'@media (max-height:1000px)': {
						maxHeight: '49vh',
						minHeight: '49vh',
					},
					'@media (max-height:900px)': {
						maxHeight: '44vh',
						minHeight: '44vh',
					},
					'@media (max-height:850px)': {
						maxHeight: '42vh',
						minHeight: '42vh',
					},
					'@media (max-height:800px)': {
						maxHeight: '40vh',
						minHeight: '40vh',
					},
					'@media (max-height:768px)': {
						maxHeight: '37vh',
						minHeight: '37vh',
					},
				},
			},
		},
	},
	// container2: {
	//   width: "100%",
	//   "& .MuiTableCell-paddingCheckbox": {
	//     position: (p) => p.isCheckboxSticky ? 'sticky !important' : '',
	//   },

	//   '& .MuiTableRow-footer': {
	//     visibility: (p) => p.isHideFooter ? 'hidden' : '',
	//     display: (p) => p.isHideFooter ? 'none' : '',
	//   }

	// },

	ESHOCContainer: {
		width: '100%',
		'& .MuiTableCell-paddingCheckbox': {
			position: p => (p.isCheckboxSticky ? 'sticky !important' : ''),
		},

		'& .MuiTableRow-footer': {
			visibility: p => (p.infScrollHeight ? 'hidden' : ''),
			display: p => (p.infScrollHeight ? 'none' : ''),
		},
	},
	ESHOCInfScroll: {
		'& div': {
			'&>.MuiPaper-root': {
				display: 'flex',
				'flex-direction': 'column',
				height: p => p.infScrollHeight,
				position: 'relative',
				'align-items': 'stretch',
				'&>.MuiPaper-root': {
					display: 'contents',
				},
				'&>:nth-child(3)': {
					height: 'inherit !important',
				},
				'&> table': {
					bottom: 0,
				},
			},
		},

		'& .MuiDrawer-paperAnchorRight': {
			overflow: 'hidden',
		},
	},

	multiSelectionTopBarButtons: {
		margin: '0px 5px',
		fontWeight: '600',
		backgroundColor: 'rgba(1, 17, 51, 1)',
		color: '#fff',
		border: '1px solid #B3B3B3',
		'&:hover': {
			backgroundColor: '#263451',
			color: '#fff',
		},
	},
	ZoomIcons: {
		zIndex: '1',
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute !important',
		top: '85% !important',
		bottom: '0 !important',
		left: '15px',
		width: '3.875rem',
	},
	warningCol: {
		display: 'flex',
		color: '#f1af29',
		cursor: 'pointer',
		'& svg': {
			fill: '#f1af29 !important',
		},
		'& div': {
			marginTop: '3px',
			fontSize: 'initial',
		},
	},
	flexAlign: {
		display: 'flex',
		alignItems: 'center',
	},
	activeBadge: {
		background: '#17c10d',
		height: 12,
		width: 12,
		marginRight: 8,
		borderRadius: '50%',
	},
	pendingBadge: {
		background: '#ffa800',
		height: 12,
		width: 12,
		marginRight: 8,
		borderRadius: '50%',
	},
	declinedBadge: {
		background: '#cb0f29',
		height: 12,
		width: 12,
		marginRight: 8,
		borderRadius: '50%',
	},
	statusBtnDiv: {
		display: 'flex',
		alignItems: 'center',
	},
	approveBtn: {
		border: '1px solid grey',
		color: '#17c10d',
		padding: '5px',
		display: 'flex',
		alignItems: 'center',
		maxHeight: '30px',
		cursor: 'pointer',
		fontSize: 'smaller',
		fontWeight: 'bold',
	},
	declineBtn: {
		border: '1px solid grey',
		color: '#cb0f29',
		padding: '5px',
		display: 'flex',
		alignItems: 'center',
		maxHeight: '30px',
		cursor: 'pointer',
		fontWeight: 'bold',
		fontSize: 'smaller',
	},
	docViewSection: {
		overflow: 'scroll',
		height: '96%',
		width: '100%',
	},

	switchButtom: {
		float: 'right',
		width: 'fit-content',
		alignSelf: 'flex-end',
		marginTop: '10px',
		marginRight: '5px',
		'& span.MuiTypography-body1': {
			marginRight: '5px',
			fontSize: '0.9rem',
		},
	},
}));
