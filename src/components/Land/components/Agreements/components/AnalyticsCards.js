import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Card, CardContent, Typography } from '@material-ui/core';
import { Warning as WarningIcon } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
	card: { borderRadius: '8px' },
	cardHeaderTypography: {
		fontWeight: 'bolder',
		marginBottom: '25px',
	},
	cardNumberTypography: {
		fontWeight: 900,
		fontSize: 'xx-large',
	},
	cardContent: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: '160px',
		textAlign: 'left',
	},
	issuesBadges: {
		display: 'flex',
		alignItems: 'center',
		color: '#ff0000',
		height: '20px',
	},
	tooltip: {
		position: 'absolute',
		top: 72,
		color: 'rgb(255, 0, 0)',
		width: 200,
		left: -148,
	},
}));

export default function AnalyticsCards(props) {
	const classes = useStyles();
	const [tooltip, showTooltip] = useState(false);
	return (
		<Grid container direction="row" display="flex" align="center" spacing={4} textAlign="left" className={classes.root}>
			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Total Agreements
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{props.agreementCount}
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Active
						</Typography>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography}>
							{props.activeCount}
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item md={3}>
				<Card variant="outlined" className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Inactive
						</Typography>
						<Typography
							variant="h6"
							component="div"
							className={classes.cardNumberTypography}
							style={{ color: '#b9b908' }}
						>
							{props.inactiveCount}
						</Typography>
					</CardContent>
				</Card>
			</Grid>

			<Grid item md={3} style={{ position: 'relative' }}>
				<Card variant="outlined" className={classes.card}>
					<CardContent
						className={classes.cardContent}
						onMouseOver={() => showTooltip(true)}
						onMouseOut={() => showTooltip(false)}
					>
						<Typography variant="h6" component="div" className={classes.cardHeaderTypography}>
							Unapproved
						</Typography>
						<div className={classes.issuesBadges}>
							<div style={{ marginRight: 6 }}>
								<WarningIcon />
							</div>

							<div>{props.potentialIssues?.length}</div>
							{/* &nbsp; */}
							{/* <div style={{marginRight: 6}}>
                <WarningIcon />
              </div> */}
							{/* <div>1 </div> */}
							{/* &nbsp; */}
							{/* <div style={{marginRight: 6}}>
                <WarningIcon />
              </div>
              <div>7</div> */}
						</div>
						<Typography variant="h6" component="div" className={classes.cardNumberTypography} style={{ color: 'red' }}>
							{props.potentialIssues?.length}
						</Typography>
					</CardContent>
				</Card>

				{tooltip && (
					<div className={classes.tooltip}>
						<p style={{ fontSize: 14, lineHeight: '120%', textAlign: 'left' }}>
							Sum of check details does not match check amount
						</p>
					</div>
				)}
			</Grid>
		</Grid>
	);
}
