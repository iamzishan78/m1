import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useState, useEffect } from 'react';

import { AppContext } from '../../../AppContext';

const useStyles = makeStyles({
	table: {
		//minWidth: 650,
		// paddingRight: "20px",
		minHeight: '466.556px !important',
	},
	tableContainer: {
		overflowX: 'unset',
		margin: '8px',

		'&::-webkit-scrollbar': {
			width: '0.75em',
			height: '0.75em',
		},
		// "&:hover::-webkit-scrollbar": {
		//     width: "1.0em",
		// },
		// "&::-webkit-scrollbar-track": {
		//     "-webkitBoxShadow": "inset 0 0 6px rgba(0,0,0,0.00)",
		// },
		//paddingRight: '20px'
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: '#929292',
		borderRadius: 10,
	},
	rowCell: {
		width: '25%',
	},
	rowName: {
		fontWeight: 'bold',
		background: '#ebebeb',
		width: '25%',
	},

	tableRow: {
		'& > td': {
			padding: '4px 10px !important',
			border: '2px solid #e3e3e3',
		},
	},
});

function formatFT(ft) {
	let ftNum = ft ? ft : 0;
	ftNum = Math.round(ftNum);
	return ftNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function TableSummary(props) {
	const classes = useStyles();
	const [summary, setSummary] = useState(null);

	useEffect(() => {
		if (props.summary) {
			setSummary(props.summary);
		}
	}, [props.summary, setSummary]);

	function getStyledApiNumber(summary) {
		const states = ['TX', 'NM', 'LA', 'OK', 'CO', 'WY', 'UT', 'KS'];
		const links = [
			'http://webapps2.rrc.texas.gov/EWA/leaseDetailAction.do?searchType=apiNo&selTab=1&apiNo=' +
				summary.ApiNumber.substring(2) +
				'&methodToCall=displayLeaseDetail&rrcActionMan=H4sIAAAAAAAAALWPT0vDQBDFP009LjObbRoPcwii51aLIsHDNhlSYdsNs4lV2A_vtFIQ_5zE0zzeY2Z-LyMA2YyAhBcibd2Oz3F_20rXwBOd_ANv_DAkazQ2I7_6ZPr4MivqCjS3NLM31w-1yuIoDxzCJgqvJpa3j2umi5o62vG4jd06XvkQ1JiT8DjJfh3v2Eu7Vasi-AbRpFNaS5_M4MXv7n2YWNkW5ErMFTmEhcuX9PhlFf-dP525SzqvLX3P8onzx1L4l1LNb6-OdQmzJYRcqHAEea6zVOMdFVf0QucBAAA',
			'https://wwwapps.emnrd.state.nm.us/ocd/ocdpermitting/data/WellDetails.aspx?api=' +
				summary.ApiNumber.substring(0, 2) +
				'-' +
				summary.ApiNumber.substring(2, 5) +
				'-' +
				summary.ApiNumber.substring(5),
			'https://sonlite.dnr.state.la.us/sundown/cart_prod/cart_con_wellinfo2?p_wsn=' + summary.StateWellId,
			'https://occpermit.com/WellBrowse/Home.aspx',
			'https://cogcc.state.co.us/cogisdb/Facility/FacilityDetail?api=' + summary.ApiNumber.substring(2),
			'https://pipeline.wyo.gov/Wellapino.cfm?napino=' + summary.ApiNumber.substring(3) + '&s1=Y',
			'https://dataexplorer.ogm.utah.gov/DataMining.html?EntityType=Well&EntityKeyName=API&EntityKeyValue=' +
				summary.ApiNumber +
				'&DETAILSONLY=True',
			'https://chasm.kgs.ku.edu/ords/qualified.well_page.DisplayWell?f_kid=' + summary.StateWellId,
		];
		if (summary.ApiNumber && states.includes(summary.State)) {
			return (
				<Link href={links[states.indexOf(summary.State)]} variant="body2" target="_blank">
					<Typography variant="subtitle2">
						<span style={{ padding: 0 }}>{summary.ApiNumber}</span>
					</Typography>
				</Link>
			);
		} else {
			return summary.ApiNumber ? summary.ApiNumber : '--';
		}
	}

	return (
		<TableContainer className={classes.tableContainer}>
			{summary && (
				<Table aria-label="simple table" className={classes.table} loading={!summary}>
					<TableBody>
						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								API Number
							</TableCell>
							<TableCell className={classes.tableRow}>{getStyledApiNumber(summary)}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								Well Name
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.WellName ? summary.WellName : '--'}</TableCell>
						</TableRow>
						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Lease Number
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.LeaseId ? summary.LeaseId : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								Lease Name
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.Lease ? summary.Lease : '--'}</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Current Operator
							</TableCell>
							<TableCell className={classes.rowCell}>
								{summary.CurrentOperator ? summary.CurrentOperator : '--'}
							</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								Original Operator
							</TableCell>
							<TableCell className={classes.rowCell}>
								{summary.OriginalOperator ? summary.OriginalOperator : '--'}
							</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Basin
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.Basin ? summary.Basin : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								Formation
							</TableCell>
							<TableCell className={classes.rowCell}>
								{summary.PrimaryFormation ? summary.PrimaryFormation : '--'}
							</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Play
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.Play ? summary.Play : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								Field
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.Field ? summary.Field : '--'}</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Permit Number
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.PermitNumber ? summary.PermitNumber : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								MD(ft)
							</TableCell>
							<TableCell className={classes.rowCell}>
								{summary.MeasuredDepth ? formatFT(summary.MeasuredDepth) : '--'}
							</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Lateral Length(ft)
							</TableCell>
							<TableCell className={classes.rowCell}>
								{summary.LateralLength ? formatFT(summary.LateralLength) : '--'}
							</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								TVD(ft)
							</TableCell>
							<TableCell className={classes.rowCell}>
								{summary.TrueVerticalDepth ? formatFT(summary.TrueVerticalDepth) : '--'}
							</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								Surface Lat/Long
							</TableCell>
							<TableCell className={classes.rowCell}>
								{/* {summary.Latitude ? summary.Latitude : "--" } */}
								{summary.Latitude + ',' + summary.Longitude}
							</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								BH Lat/Long
							</TableCell>
							<TableCell className={classes.rowCell}>
								{/* {summary.BHLatitude ? summary.BHLatitude : "--"} */}
								{summary.BHLatitude + ',' + summary.BHLongitude}
							</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								State
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.State ? summary.State : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								County
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.County ? summary.County : '--'}</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								{summary.State === 'TX' ? 'Survey' : 'Meridian'}
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.GrId1 ? summary.GrId1 : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								{summary.State === 'TX' ? 'Block' : 'Township'}
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.GrId2 ? summary.GrId2 : '--'}</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								{summary.State === 'TX' ? 'Section' : 'Range'}
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.GrId3 ? summary.GrId3 : '--'}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								{summary.State === 'TX' ? 'Abstract' : 'Section'}
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.GrId4 ? summary.GrId4 : '--'}</TableCell>
						</TableRow>

						<TableRow className={classes.tableRow}>
							<TableCell scope="row" className={classes.rowName}>
								{summary.State === 'TX' ? 'Alt Survey' : ''}
							</TableCell>
							<TableCell className={classes.rowCell}>{summary.Grid5 || ''}</TableCell>
							<TableCell scope="row" className={classes.rowName}>
								{summary.State === 'TX' ? '' : ''}
							</TableCell>
							<TableCell className={classes.rowCell}>{'' || ''}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			)}
		</TableContainer>
	);
}
