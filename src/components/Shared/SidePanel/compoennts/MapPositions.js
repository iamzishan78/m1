import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Grid, Typography, FormControl, InputLabel, InputBase, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

import { globalStateController } from 'hookstate/globalStateController';
import { mapStateController } from 'hookstate/mapStateController';

import { useStyles } from './style';

const BootstrapInput = withStyles(theme => ({
	root: {
		'label + &': {
			marginTop: theme.spacing(3),
		},
	},
	input: {
		borderRadius: 4,
		backgroundColor: '#263451',
		fontSize: 16,
		padding: '10px 12px',
		transition: theme.transitions.create(['border-color', 'box-shadow']),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:focus': {
			borderColor: theme.palette.primary.main,
		},
	},
}))(InputBase);

const StyledTextField = props => (
	<FormControl variant="standard">
		<InputLabel shrink>{props.label}</InputLabel>
		<BootstrapInput type="number" {...props} />
	</FormControl>
);

export default function MapPositions(props) {
	const classes = useStyles();
	const { control, handleSubmit, reset, watch, setValue } = useForm();
	const { stateValues } = mapStateController.useState(['defaultMapVars', 'mapVars']);
	const { mapReady } = globalStateController.useState(['mapReady']);
	const { setMapDefaultPosition } = props;
	const { defaultMapVars, mapVars } = stateValues;
	const [centerError, setCenterError] = useState(false);
	const center = watch('center', '');

	const getVars = mapVars => {
		const vars = {
			...mapVars,
			center: `${mapVars.center.lat}, ${mapVars.center.lng}`,
		};
		return vars;
	};

	useEffect(() => {
		if (defaultMapVars) {
			const vars = getVars(defaultMapVars);
			reset(vars);
		}
	}, [reset, defaultMapVars]);

	useEffect(() => {
		if (mapVars) {
			const vars = getVars(mapVars);
			reset(vars);
		}
	}, [reset, mapVars]);

	useEffect(() => {
		const regExp = /[a-zA-Z]/g;
		if (regExp.test(center)) {
			setCenterError(true);
		} else {
			setCenterError(false);
		}
	}, [center]);

	useEffect(() => {
		const mapRef = window.mapRef;

		if (!mapRef) {
			return null;
		}

		// Update for values
		const updateFormFields = () => {
			setValue('zoom', mapRef.getZoom());
			setValue('bearing', mapRef.getBearing());
			setValue('pitch', mapRef.getPitch());
			setValue('center', `${mapRef.getCenter().lat}, ${mapRef.getCenter().lng}`);
		};

		// Listen to the map events
		mapRef.on('move', updateFormFields);
		mapRef.on('zoom', updateFormFields);
		mapRef.on('rotate', updateFormFields);

		// Initial values update
		updateFormFields();

		// Cleanup on unmount
		return () => {
			mapRef.off('move', updateFormFields);
			mapRef.off('zoom', updateFormFields);
			mapRef.off('rotate', updateFormFields);
		};
	}, [setValue, mapReady]);

	const submitFunc = values => {
		if (values.center) {
			const [lat, lng] = values.center.split(',');
			values.center = {
				lat: parseFloat(lat),
				lng: parseFloat(lng),
			};
		}
		setMapDefaultPosition(values);
	};

	return (
		<div className={classes.mapPositionSection}>
			<hr style={{ border: '1px solid #263451', borderRadius: '5px', marginTop: '20px', marginBottom: '20px' }} />
			<Grid container justifyContent="space-between" alignItems="center">
				<Typography variant="subtitle1">Default Map Position</Typography>
				<Button color="secondary" variant="outlined" onClick={handleSubmit(submitFunc)}>
					Save Default
				</Button>
			</Grid>

			<Grid
				container
				direction="row"
				display="flex"
				justify="space-between"
				alignItems="center"
				spacing={2}
				style={{ padding: '15px 10px' }}
			>
				<Grid item xs={4}>
					<Controller
						control={control}
						name="zoom"
						label="Zoom"
						render={({ field }) => <StyledTextField {...field} />}
					/>
				</Grid>
				<Grid item xs={4}>
					<Controller
						control={control}
						name="bearing"
						label="Bearing"
						render={({ field }) => <StyledTextField {...field} />}
					/>
				</Grid>
				<Grid item xs={4}>
					<Controller
						control={control}
						name="pitch"
						label="Pitch"
						render={({ field }) => <StyledTextField {...field} />}
					/>
				</Grid>
				<Grid item xs={12}>
					<Controller
						control={control}
						name="center"
						label="Center"
						type="text"
						error={centerError}
						helperText={centerError ? 'Invalid Value' : ''} // helper text for errors
						render={({ field }) => <StyledTextField {...field} />}
					/>
				</Grid>
			</Grid>
		</div>
	);
}
