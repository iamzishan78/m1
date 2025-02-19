import React, { useState } from 'react';
import { TextField, Switch, Button, Typography, makeStyles } from '@material-ui/core';
import DialpadIntegrationIcon from 'components/Shared/svgIcons/dialpad-integration';
import { Grid } from '@mui/material';
import { EXTERNAL_TOOL_EXISTS } from 'graphQL/useQueryExternalToolExists';
import { useLazyQuery } from '@apollo/client';

const useStyles = makeStyles(() => ({
	textField: {
		'& .MuiFormHelperText-contained': {
			justifyContent: 'flex-end',
			display: 'flex',
			marginTop: '-20px',
		},
	},
	textGreen: {
		color: 'green',
		fontSize: '0.7rem',
		marginBottom: '-10px',
	},
	textRed: {
		color: 'red',
		fontSize: '0.7rem',
		marginBottom: '-10px',
	},
	connectionButton: {
		marginBottom: '-10px',
	},
}));

const DialpadIntegration = ({ apiKeyExists = false, handleSync, handleSave, apikey, onChange }) => {
	const [helperText, setHelperText] = useState('');
	const [connected, setConnected] = useState(null);
	const classes = useStyles();

	const [externalToolExists] = useLazyQuery(EXTERNAL_TOOL_EXISTS);

	const onTestConnection = async () => {
		const { data } = await externalToolExists({ variables: { toolName: 'dialpad' } });

		if (data?.externalToolExists?.success) {
			setConnected(true);
		} else {
			setConnected(false);
		}
	};

	return (
		<Grid container alignItems={'center'} flexDirection={'row'}>
			<Grid item md={2}>
				<DialpadIntegrationIcon />
			</Grid>
			<Grid item md={4}>
				<TextField
					className={classes.textField}
					label="Dialpad API Key"
					variant="outlined"
					fullWidth
					value={apikey}
					helperText={helperText}
					onFocus={() => {
						setHelperText('Return to save');
					}}
					onBlur={() => {
						setHelperText('');
					}}
					onKeyDown={event => {
						event.stopPropagation();
						if (event.key === 'Enter') {
							event.preventDefault();
							handleSave();
							event.target.blur();
						}
					}}
					placeholder="************"
					onChange={onChange}
				/>
			</Grid>
			<Grid item alignItems="center" justifyItems={'center'} flexDirection={'column'} md={2}>
				<Typography variant="body2">Configuration Status</Typography>
				<Switch color="secondary" disableRipple checked={apiKeyExists} />
			</Grid>
			<Grid item alignItems="center" justifyItems={'center'} flexDirection={'column'} md={2}>
				<Button
					variant="outlined"
					onClick={onTestConnection}
					className={connected !== null && classes.connectionButton}
				>
					Test Connection
				</Button>
				{connected !== null && (
					<p className={`${connected ? classes.textGreen : classes.textRed}`}>
						{connected ? 'Connection Successful' : 'Connection Failed'}
					</p>
				)}
			</Grid>
			<Grid item md={2}>
				<Button variant="contained" color="primary" onClick={handleSync}>
					Sync All Contacts
				</Button>
			</Grid>
		</Grid>
	);
};

export default DialpadIntegration;
