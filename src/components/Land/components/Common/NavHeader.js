import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Typography, Grid, Breadcrumbs } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { NavigateNext as NavigateNextIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';

// Components
import ProfileMenu from 'components/Profile/ProfileMenu';

import { AppContext } from 'AppContext';

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
	const [, setStateApp] = useContext(AppContext);

	const { activeModule } = useSelector(({ common }) => common);

	return (
		<div className={classes.root}>
			{/**
			 * Detail Header
			 */}
			<div className={classes.navSection}>
				<Grid container alignItems="center" direction="row" display="flex" justify="space-between">
					<Grid item>
						<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
							<Link
								style={{ marginLeft: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}
								color="inherit"
								onClick={() => {
									history.push(activeModule.parent?.link ?? activeModule.link);
									setTimeout(() => {
										setStateApp(stateApp => ({ ...stateApp, landSearchQuery: '' }));
									}, 0);
								}}
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
								{title || '-'}
							</Typography>
							{history.location.pathname.includes('/detailedInformation') && (
								<Typography
									style={{
										color: '#18AADD',
										fontSize: '16px',
										marginLeft: '5px',
									}}
								>
									Detailed Information
								</Typography>
							)}
							{history.location.pathname.includes('/documents') && (
								<Typography
									style={{
										color: '#18AADD',
										fontSize: '16px',
										marginLeft: '5px',
									}}
								>
									Documents
								</Typography>
							)}
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
