import React from 'react';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import InitializeProfile from 'components/Profile/InitializeProfileContext';
import { ProfileContextProvider } from 'components/Profile/ProfileContext';

import CardGrid from './components/CardsGrid';
import DateBar from './components/WeatherCard';

const useStyles = makeStyles(theme => ({
	root: {
		backgroundColor: '#efefef',
		height: '100vh',
		'& .MuiList-padding': {
			padding: '10px !important',
		},
	},
	header: {
		paddingTop: '25px',
		paddingBottom: '40px',
		paddingLeft: '20px',
	},
}));

const Dashboard = () => {
	const classes = useStyles();

	return (
		<ProfileContextProvider>
			<InitializeProfile />
			<div className={classes.root}>
				<Container
					maxWidth="false"
					style={{ overflow: 'auto', height: 'calc(100vh - 65px)', top: '65px', position: 'relative' }}
				>
					<div className={classes.header}>
						<DateBar />
					</div>
					<CardGrid />
				</Container>
			</div>
		</ProfileContextProvider>
	);
};

export default Dashboard;
