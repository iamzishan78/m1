import React, { useContext, useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import OwnershipIcon from './components/svgIcons/OwnershipIcon';
import { AppContext } from '../../AppContext';

const useStyles = makeStyles(theme => ({
	iconContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	tex1: {
		colorPrimary: 'white',
	},
}));

export default function OwnerNumCard(props) {
	let classes = useStyles();
	const [stateApp, setStateApp] = useContext(AppContext);
	const [summary, setSummary] = useState(null);

	useEffect(() => {
		if (props.summary) {
			setSummary(props.summary);
		}
	}, [props.summary, setSummary]);

	return (
		<div>
			{summary && (
				<div className={classes.iconContainer}>
					<OwnershipIcon htmlColor="black" viewBox="0 0 45 31" fontSize="large" />

					<Typography
						//classes={classes.text1}
						align="center"
						variant="subtitle2"
					>
						Owners
					</Typography>

					<Typography
						align="center"
						//className={classes.text2}
						variant="caption"
					>
						{summary.OwnerCount ? summary.OwnerCount : '--'}
					</Typography>
				</div>
			)}
		</div>
	);
}
