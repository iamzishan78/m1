import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography, Grid, Breadcrumbs } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

import queryString from 'query-string';

// Components
import ProfileMenu from 'components/Profile/ProfileMenu';

const useStyles = makeStyles(theme => ({
	root: {
		minHeight: '100vh',
		backgroundColor: '#f3f3f3',
		width: '100%',
	},
	navSection: {
		minHeight: 56,
		padding: '10px 20px',
		backgroundColor: '#fff',
	},
	title: {
		color: '#18AADD',
		fontSize: '16px',
		marginLeft: '5px',
		cursor: 'pointer',
	},
}));

export default function DetailComponents(props) {
	const history = useHistory();
	const classes = useStyles(props);
	const { title, onClickFunc } = props;

	const { activeModule } = useSelector(({ common }) => common);
	const { statements } = useSelector(({ Revenue }) => Revenue);
	const freezNavigationOn = useSelector(({ app }) => app.freezNavigationOn);

	const search = queryString.parse(window.location.search);

	return (
		<div className={classes.root}>
			{/**
			 * Detail Header
			 */}
			<div className={classes.navSection}>
				<Grid container alignItems="center" direction="row" display="flex" justify="space-between">
					<Grid item>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							{search.from === 'revenue' && (
								<Link
									style={{
										marginLeft: '5px',
										fontSize: '16px',
										cursor: 'pointer',
										fontWeight: 'bold',
									}}
									color="inherit"
									onClick={() => history.push('/revenue/statements')}
								>
									Revenue Statements
								</Link>
							)}
							{search.from === 'revenue' && (
								<Link
									style={{
										marginLeft: '5px',
										fontSize: '16px',
										cursor: 'pointer',
									}}
									color="inherit"
									onClick={() => {
										!freezNavigationOn && history.push(history.pathHistory[1]);
									}}
								>
									{`${statements?.activeStatement?.checkNumber} - ${statements?.activeStatement?.payor?.['name']}`}
								</Link>
							)}
							<Link
								style={{
									marginLeft: '5px',
									fontSize: '16px',
									cursor: 'pointer',
									fontWeight: 'bold',
								}}
								color="inherit"
								onClick={() => !freezNavigationOn && history.push(activeModule.link)}
							>
								{activeModule.title}
							</Link>
							<Typography
								className={classes.title}
								onClick={() => {
									if (onClickFunc) {
										onClickFunc();
									}
								}}
							>
								{title}
							</Typography>
						</Breadcrumbs>
					</Grid>
					<Grid item>
						<ProfileMenu />
					</Grid>
				</Grid>
			</div>
			{props.children}
		</div>
	);
}
