import React, { useEffect, useState } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';

import { useLazyQuery } from '@apollo/client';
import moment from 'moment';

//material-ui components

//custom components
import { globalStateController } from 'stateManagement/globalStateController';
import { popupController } from 'stateManagement/popupStateController';

import OilGasIcon from './components/svgIcons/OilGasIcon';
import OwnershipIcon from './components/svgIcons/OwnershipIcon';
import ProductionIcon from './components/svgIcons/ProductionIcon';
import WellIcon from './components/svgIcons/WellIcon';

// queries

// value formatters
import convert_date from '../Shared/valueformatters/convert_date.js';
import formatBOE from '../Shared/valueformatters/format_boe.js';

const useStyles = makeStyles(theme => ({
	card: {
		borderStyle: 'none',
		height: '100%',
	},
	title: {
		fontFamily: 'Poppins',
		color: '#FFFFFF',
		fontSize: '15px',
	},
	subheader: {
		fontFamily: 'Poppins',
		color: '#FFFFFF',
		fontSize: '11px',
	},

	avatar: {
		backgroundColor: 'black',
		color: 'white',
		width: '38px',
		height: '38px',
		margin: '0px',
	},
	content: {
		padding: '0 !important',
		height: '100%',
	},
	cardAction: {
		flexGrow: 1,
		display: 'flex',
		justifyContent: 'space-evenly',
		backgroundColor: '#fff',
	},
	table: {
		width: '100%',
		height: '100%',
		margin: '0px',
		padding: '0px',
		borderStyle: 'none',
	},
	rowGrey: {
		background: '#F6F6F6',
		border: '0px',
	},
	rowWhite: {
		background: '#FFF',
		border: '0px',
	},
	cell1: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#757679',
	},

	link_permit: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#757679',
		padding: '5px',
		alignContent: 'center',
		background: '#F6F6F6',
		border: '0px',
	},

	cell2: {
		border: '0px',
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#75767A',
	},
	text1: {
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#011133',
	},
	text2: {
		fontFamily: 'Poppins',
		fontStyle: 'normal',
		fontWeight: 300,
		fontSize: '12px',
		lineHeight: '18px',
		color: '#000',
	},
	iconContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	loadingWrapper: {
		width: '450px',
	},
	button: {
		height: '110px',
		width: '100px',
	},
}));

export default function PermitCard() {
	// function state
	const [source, setSource] = useState(null);

	// theme / styles
	const theme = useTheme();
	const classes = useStyles();

	const { user, stateValues } = globalStateController.useState(['user']);
	const { popupStateValues } = popupController.useState(['expandedCard', 'selectedPermit'], 'popupStateValues');

	useEffect(() => {
		if (!source) {
			setSource({
				sourceId: stateValues.user.id,
				label: 'user',
				name: stateValues.user.name,
				type: 'vertex',
				properties: [],
			});
		}
	}, [user, source]);

	const selectedPermit = popupStateValues?.selectedPermit;

	return selectedPermit ? (
		!popupStateValues.expandedCard ? (
			<div>
				<Card className={classes.card}>
					<CardActions
						classes={{
							root: classes.cardAction,
						}}
					>
						<div className={classes.iconContainer}>
							<WellIcon htmlColor="black" viewBox="0 0 32 31" fontSize="large" />

							<Typography align="center" className={classes.text1} variant="subtitle2">
								Permit Status
							</Typography>
							<Typography align="center" className={classes.text2} variant="caption">
								{selectedPermit.PermitPurpose ? selectedPermit.PermitPurpose : '--'}
							</Typography>
						</div>

						<div className={classes.iconContainer}>
							<Avatar variant="circle" className={classes.avatar}>
								{selectedPermit.WellBoreProfile ? selectedPermit.WellBoreProfile.substring(0, 1) : 'H'}{' '}
							</Avatar>
							<Typography align="center" className={classes.text1} variant="subtitle2">
								Profile
							</Typography>
							<Typography align="center" className={classes.text2} variant="caption">
								{selectedPermit.WellBoreProfile ? selectedPermit.WellBoreProfile : '--'}
							</Typography>
						</div>

						<div className={classes.iconContainer}>
							<OilGasIcon htmlColor="black" fontSize="large" />

							<Typography align="center" className={classes.text1} variant="subtitle2">
								Well Type
							</Typography>
							<Typography align="center" className={classes.text2} variant="caption">
								{selectedPermit.WellType ? selectedPermit.WellType.toUpperCase() : 'UNKNOWN'}
							</Typography>
						</div>
					</CardActions>
					<CardContent className={classes.content}>
						<Table className={classes.table} size="small" aria-label="well table">
							<TableBody>
								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										Permit #
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.PermitId ? selectedPermit.PermitId : '--'}
									</TableCell>
								</TableRow>

								<TableRow className={classes.rowGray}>
									<TableCell className={classes.cell1} align="left">
										Lease Name
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.Lease ? selectedPermit.Lease : '--'}
									</TableCell>
								</TableRow>

								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										Well Number
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.WellNumber ? selectedPermit.WellNumber.padStart(3, '0') : '--'}
									</TableCell>
								</TableRow>

								<TableRow className={classes.rowGray}>
									<TableCell className={classes.cell1} align="left">
										API #
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.ApiNumber ? selectedPermit.ApiNumber : '--'}
									</TableCell>
								</TableRow>

								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										County/Parish
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.County ? selectedPermit.County + ' (' + selectedPermit.State + ')' : '--'}
									</TableCell>
								</TableRow>

								<TableRow className={classes.rowGray}>
									<TableCell className={classes.cell1} align="left">
										Operator
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.OperatorName ? selectedPermit.OperatorName : '--'}
									</TableCell>
								</TableRow>

								{/* <TableRow className={classes.rowGrey}>
                  <TableCell className={classes.cell1} align="left">
                    Well Type
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {selectedPermit.WellType
                      ? selectedPermit.WellType
                      : 'UNKNOWN'}
                  </TableCell>
                </TableRow> */}

								<TableRow className={classes.rowGrey}>
									<TableCell className={classes.cell1} align="left">
										Submitted Date
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{convert_date(selectedPermit.SubmittedDate)}
									</TableCell>
								</TableRow>

								<TableRow className={classes.rowGray}>
									<TableCell className={classes.cell1} align="left">
										Permit Depth
									</TableCell>
									<TableCell className={classes.cell2} align="right">
										{selectedPermit.TotalDepth ? formatBOE(selectedPermit.TotalDepth) : '--'}
									</TableCell>
								</TableRow>

								{/* <TableRow className={classes.rowWhite}>
                  <TableCell className={classes.cell1} align="left">
                    Completed Depth [ft]
                  </TableCell>
                  <TableCell className={classes.cell2} align="right">
                    {selectedPermit.CompletionDepth
                      ? formatBOE(selectedPermit.CompletionDepth)
                      : '--'}
                  </TableCell>
                </TableRow> */}
							</TableBody>
						</Table>
						<div>
							{selectedPermit?.State === 'TX' ? (
								<Link
									href={
										'http://webapps2.rrc.texas.gov/EWA/drillingPermitDetailAction.do?methodToCall=searchByUniversalDocNo&universalDocNo=' +
										selectedPermit.UniversalDocNumber +
										'&rrcActionMan=H4sIAAAAAAAAAL1Qu27DMAz8mnQUJPkBLxyMop37CJrByKDYhCNAtgxK7gPQx5d2USB1OmfS8Y4ij5eUlKCTkgrUHVFbt9H68aWlrpFHWPkPPJlpClqwLCJ-miB6_77L6kqyrmGnHx8ONcNsgR1Z5-zYPyENNobnGenrZ6joPDflMGA8-27v741zTBRAGGca9_4VDbVnpiqQV16asKo19UFMhszwZtyMq0X2WJVZLqsFF3DC3o7hYOMyimf9qZXe1Jf9m6XqVgGE38NLmEyPdHHgv2moY7PtW6yCShqUTBmDHGQq-C2ZuP59gyy_AXdh05tZAgAA'
									}
									variant="body2"
									target="_blank"
								>
									<Typography align="center" variant="subtitle2" className={classes.link_permit}>
										RRC Permit Search Tool
									</Typography>
								</Link>
							) : (
								''
							)}

							{selectedPermit?.State === 'LA' ? (
								<Link
									href={
										'https://sonlite.dnr.state.la.us/sundown/cart_prod/cart_con_wellinfo2?p_wsn=' +
										selectedPermit?.PermitId
									}
									onClick={() => {}}
									variant="body2"
									target="_blank"
								>
									<Typography align="center" variant="subtitle2" className={classes.link_permit}>
										SONRIS Search Tool
									</Typography>
								</Link>
							) : (
								''
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		) : (
			<div style={{ height: '100%' }}>
				<Card className={classes.card}>
					<CardContent className={classes.content}></CardContent>
				</Card>
			</div>
		)
	) : (
		<CircularProgress color="secondary" />
	);
}
