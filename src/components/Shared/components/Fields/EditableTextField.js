import React, { useEffect, useState } from 'react';

import { Edit as EditIcon, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Grid, IconButton } from '@mui/material';
import { styled } from '@mui/system';

import PropTypes from 'prop-types';

import CustomTextField from 'components/Shared/FormsFieldsData/Fields/CustomTextField';

import NameWithTooltip from '../../SidePanel/compoennts/Common/NameWithTooltip';

const StyledGrid = styled(Grid)(({ type }) => ({
	'& .editIcon': {
		top: type === 'group' ? '10px' : '7px',
		left: '7px',
		position: 'relative',
	},
	'& .expandIcon': {
		margin: '9px 0px 0px 9px',
	},
	'& .textField': {
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
	'& .textFieldInput': {
		height: '40px',
	},
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

	useEffect(() => {
		if (typeof openEditField !== 'undefined') {
			setEdit({ ...isEdit, mode: openEditField });
		}
	}, [openEditField]);

	return (
		<StyledGrid
			id={'editable-field-' + item.sourceName}
			container
			onMouseOver={() => !isEdit.mode && setEdit({ ...isEdit, able: true })}
			onMouseLeave={() => setEdit({ ...isEdit, able: false })}
			type={item.type}
		>
			<Grid
				item
				sx={
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
						}}
						fieldConfig={{
							variant: 'outlined',
							autoFocus: true,
							required: true,
							customStyleClass: 'textField',
						}}
						fieldAttributes={{
							name: 'projectName',
							value: name,
							placeholder: 'Project Name...',
							label: 'Project Name',
							InputProps: { disableUnderline: true, className: 'textFieldInput' },
							helperText: 'Return to save',
						}}
					/>
				)}
			</Grid>
			{/* Hover Edit Icon */}
			<Grid item className="editIcon">
				{typeof openEditField === 'undefined' && isEdit.able && isEditable && (
					<IconButton
						size="small"
						onClick={e => {
							e.stopPropagation();
							setEdit({ able: false, mode: true });
						}}
					>
						<EditIcon fontSize="small" />
					</IconButton>
				)}
			</Grid>
			{showExpandIcon && (
				<Grid item className="expandIcon">
					{openUd ? <ExpandLess /> : <ExpandMore />}
				</Grid>
			)}
		</StyledGrid>
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
