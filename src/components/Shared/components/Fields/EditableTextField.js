import React, { useEffect, useState } from 'react';


import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import PropTypes from 'prop-types';

import CustomTextField from 'components/Shared/FormsFieldsData/Fields/CustomTextField';

import NameWithTooltip from '../../SidePanel/compoennts/Common/NameWithTooltip';

const useStyles = makeStyles(() => ({
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
			<Grid
				item
				style={
					isEdit.mode
						? { width: '89%' }
						: {
								textAlign: 'left',
								display: 'flex',
								flexDirection: 'row',
							}
				}
			>
				{!isEdit.mode ? (
					<NameWithTooltip
						title={name}
						style={{
							width: '300px', // Approximate ellipsis width
						}}
						height={'100%'}
					/>
				) : (
					<CustomTextField
						fieldEvents={{
							onKeyDown: e => {
								if (e.key === 'Enter') {
									e.preventDefault();
									onChange(item, e.target.value);
									setEdit({ able: false, mode: false });
								}
							},
							onBlur: () => setEdit({ able: false, mode: false }),
							// onClick: e => e.stopPropagation(),
						}}
						fieldConfig={{
							variant: 'outlined',
							autoFocus: true,
							required: true,
							customStyleClass: classes.textField,
						}}
						fieldAttributes={{
							name: 'projectName',
							value: name,
							placeholder: 'Project Name...',
							label: 'Project Name',
							InputProps: { disableUnderline: true, className: classes.textFieldInput },
							helperText: 'Return to save',
						}}
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

EditableTextField.propTypes = {
	item: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	isEditable: PropTypes.bool,
	showExpandIcon: PropTypes.bool,
	openUd: PropTypes.bool,
	openEditField: PropTypes.bool,
};

export default EditableTextField;
