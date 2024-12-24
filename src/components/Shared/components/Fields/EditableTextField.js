import { TextField, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import React, { useEffect, useState } from 'react';

import { truncate } from 'components/Shared/functions';

const useStyles = makeStyles(theme => ({
	heading: ({ type }) => ({
		marginTop: type === 'group' ? '8px' : '6px',
	}),
	textField: {
		height: '100%',
		width: '100%',
		paddingTop: '15px',
		'& .MuiFilledInput-input': {
			padding: '12px 12px 10px',
		},
		'& .MuiFormHelperText-contained': {
			justifyContent: 'flex-end',
			display: 'flex',
		},
	},
	editIcon: type => ({
		top: type === 'group' ? '10px' : '7px',
		left: '7px',
		position: 'relative',
	}),
	expandIcon: {
		margin: '9px 0px 0px 9px',
	},
	textFieldInput: {
		height: '40px',
	},
	textFieldLabel: {},
}));

function EditableTextField({
	item,
	onChange,
	name,
	isEditable = true,
	showExpandIcon = false,
	openUd = false,
	openEditField,
}) {
	const [isEdit, setEdit] = useState({});
	const classes = useStyles({ isEdit, type: item.type });

	useEffect(() => {
		if (typeof openEditField !== 'undefined') {
			setEdit({ ...isEdit, mode: openEditField });
		}
	}, [openEditField]);

	useEffect(() => {
		//  console.log(isEdit)
	}, [isEdit]);
	return (
		<Grid
			id={'editable-field-' + item.sourceName}
			container
			onMouseOver={() => !isEdit.mode && setEdit({ ...isEdit, able: true })}
			onMouseLeave={() => setEdit({ ...isEdit, able: false })}
		>
			<Grid item style={isEdit.mode ? { width: '89%' } : { textAlign: 'left' }}>
				{!isEdit.mode ? (
					<Typography className={classes.heading}>{`${truncate(name, 35)}`}</Typography>
				) : (
					<TextField
						fullWidth={true}
						placeholder="Project Name..."
						className={classes.textField}
						variant="outlined"
						id="reddit-input"
						defaultValue={name}
						autoFocus
						required
						helperText={'Return to save'}
						InputProps={{
							className: classes.textFieldInput,
							disableUnderline: true,
						}}
						onClick={e => e.stopPropagation()}
						InputLabelProps={{ className: classes.textFieldLabel }}
						onKeyDown={e => {
							if (e.keyCode === 13) {
								e.preventDefault();
								onChange(item, e.target.value);
								setEdit({ able: false, mode: false });
							}
						}}
						onBlur={() => setEdit({ able: false, mode: false })}
					/>
				)}
			</Grid>
			{/* Hover Edit Icon */}
			<Grid item className={classes.editIcon}>
				{typeof openEditField === 'undefined' && isEdit.able && isEditable && (
					<EditIcon
						fontSize="small"
						onClick={e => {
							e.stopPropagation();
							setEdit({ able: false, mode: true });
						}}
					/>
				)}
			</Grid>
			{showExpandIcon && (
				<Grid item className={classes.expandIcon}>
					{openUd ? <ExpandLess /> : <ExpandMore />}
				</Grid>
			)}
		</Grid>
	);
}

export default EditableTextField;
