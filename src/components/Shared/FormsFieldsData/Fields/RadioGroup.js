import React from 'react';
import { Controller } from 'react-hook-form';

import { Grid, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';

import { sideDialogController } from 'hookstate/sideDialogController';

function RadioComponent({ control, item, dialogKey }) {
	const { name, label, options = [] } = item;
	const formState = sideDialogController(dialogKey).useState(['depthBoth']);
	const formStateValues = formState.stateValues;

	return (
		<Grid item xs={12}>
			<h3>{label}</h3>

			<Controller
				control={control}
				name={name}
				defaultValue={options.length && options[0]?.value}
				render={props => (
					<RadioGroup
						row
						value={props.value}
						onChange={event => {
							const value = item.type === 'boolean' ? event.target.value === 'true' : event.target.value;
							props.onChange(value);
							sideDialogController(dialogKey).updateState({ [item.name]: value });
						}}
					>
						{options.map((option, index) => (
							<FormControlLabel key={index} value={option.value} control={<Radio />} label={option.label} />
						))}
					</RadioGroup>
				)}
			/>

			{!!(formStateValues?.depthBoth === 'false') && (
				<>
					<Grid item xs={12}>
						<h3>Depth From</h3>
						<Controller
							control={control}
							name={'depthFrom'}
							render={props => (
								<TextField
									size="small"
									multiline
									value={props.value}
									fullWidth
									variant="standard"
									onChange={e => {
										props.onChange(e.target.value);
										sideDialogController(dialogKey).updateState({ depthFrom: e.target.value });
									}}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<h3>Depth To</h3>
						<Controller
							control={control}
							name={'depthTo'}
							render={props => (
								<TextField
									size="small"
									multiline
									value={props.value}
									fullWidth
									variant="standard"
									onChange={e => {
										props.onChange(e.target.value);
										sideDialogController(dialogKey).updateState({ depthTo: e.target.value });
									}}
								/>
							)}
						/>
					</Grid>
				</>
			)}
		</Grid>
	);
}

export default RadioComponent;
