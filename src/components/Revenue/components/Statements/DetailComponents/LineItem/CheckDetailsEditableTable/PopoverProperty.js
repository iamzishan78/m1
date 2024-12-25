import { useMutation } from '@apollo/client';
import { Grid, Popover, TextField, Typography, IconButton } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

import CountyField from 'components/Revenue/components/Properties/DetailComponents/County';
import StateField from 'components/Revenue/components/Properties/DetailComponents/State';

import { UPDATE_PROPERTY } from 'graphQL/useMutationUpdateProperty';

import { history } from 'store';

export function PopoverProperty({ anchorEl, onClose, property, onFieldChange, data }) {
	const openPopover = Boolean(anchorEl);
	const [selectedState, setState] = useState('');
	const { control, reset } = useForm();
	const [updateProperty] = useMutation(UPDATE_PROPERTY);

	const updatePropertyData = (key, value) => {
		const d = data.find(r => r?.property?._id === property._id);
		onFieldChange(d._id, `property.${key}`)(value);
		updateProperty({
			variables: {
				property: {
					_id: property._id,
					[key]: value,
				},
			},
			refetchQueries: ['getProperty'],
			awaitRefetchQueries: true,
		});
	};

	const handleUpdate = debounce((key, value) => {
		updatePropertyData(key, value);
	}, 500);

	useEffect(() => {
		reset(property);
	}, [property]);

	return (
		<Popover
			id={'editable-popover-check'}
			open={openPopover}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
		>
			<Grid container direction="column" spacing={1} style={{ padding: '30px', width: '300px' }}>
				<Grid item>
					<Grid container direction="row" display="flex" justify="space-between" style={{ height: '23px' }}>
						<Typography style={{ fontWeight: 'bold', fontSize: '17px' }}> Add New Property </Typography>

						<IconButton
							style={{ top: '-13px' }}
							onClick={() => history.push(`/revenue/property/details/${property._id}?from=revenue`)}
						>
							<LaunchIcon />
						</IconButton>
					</Grid>
				</Grid>
				<Grid item md={12}>
					<Controller
						control={control}
						name="number"
						render={params => (
							<TextField
								{...params}
								label={'Property Number'}
								variant="standard"
								margin="dense"
								type="text"
								fullWidth
								onChange={e => {
									params.onChange(e.target.value);
									handleUpdate('number', e.target.value);
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item>
					<Controller
						control={control}
						name="name"
						render={params => (
							<TextField
								{...params}
								label={'Property Name'}
								variant="standard"
								margin="dense"
								type="text"
								fullWidth
								onChange={e => {
									params.onChange(e.target.value);
									handleUpdate('name', e.target.value);
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item>
					<Controller
						control={control}
						name="state"
						render={params => (
							<StateField
								value={params.value}
								variant="standard"
								label="State"
								onStateChange={state => {
									setState(state.acronym);
									params.onChange(state.acronym);
									handleUpdate('state', state.acronym);
								}}
							/>
						)}
					/>
				</Grid>
				<Grid item>
					<Controller
						control={control}
						name="county"
						state={selectedState}
						render={params => (
							<CountyField
								value={params.value}
								variant="standard"
								state={selectedState}
								label="County"
								onCountyChange={({ county }) => {
									params.onChange(county);
									handleUpdate('county', county);
								}}
							/>
						)}
					/>
				</Grid>
			</Grid>
		</Popover>
	);
}
