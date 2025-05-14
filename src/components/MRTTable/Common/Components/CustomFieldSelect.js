import React, { useState, useEffect } from 'react';


import { Grid, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';

import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import CustomAutoComplete from 'components/Shared/components/Fields/CustomAutoComplete';

import { globalStateController } from 'stateManagement/globalStateController';

import { colorPallete } from 'utils/consts';

const useStyles = makeStyles(() => ({
	noBorder: {
		border: 'none',
	},
	search: {
		'& .MuiOutlinedInput-notchedOutline': {
			border: 'none',
		},
		'& .MuiOutlinedInput-root': {
			paddingRight: '0px !important',
		},
		'& .MuiInputBase-input': {
			color: 'red',
			caretColor: 'black',
		},
	},
	textDiv: {
		fontSize: '14px',
	},
	paper: {
		'min-width': '125px',
		'& .MuiAutocomplete-option': {
			padding: '0px !important',
		},
	},
	myClass: {
		padding: '6px 6px',
	},
}));

const CustomFieldSelect = ({
	index,
	value,
	onCustomKeyChange,
	dropdownOptions,
	column,
	fullWidth,
	variant,
	valueMarginLeft,
	isOptionsEditable,
}) => {
	const classes = useStyles();
	const [options, setOptions] = useState([]);
	const [search, setSearch] = useState('');
	const defaultValue = {
		label: '--',
		value: '--',
	};
	const [showOptions, setShowOptions] = useState(false);
	const [showIcon, setShowIcon] = useState(false);

	const onFilterChange = search => {
		const options = JSON.parse(
			JSON.stringify(dropdownOptions.filter(op => op.value?.toLowerCase()?.includes(search.toLowerCase())))
		);
		options.unshift(defaultValue);
		options.unshift({ label: 'search', value: 'search' });
		if (isOptionsEditable) {
			options.push({ label: 'edit', value: 'editOption' });
		}
		setOptions(options);
		setSearch(search);
	};

	const onChange = ({ event, value, reason }) => {
		if (reason === 'clear') {
			event.stopPropagation();
		}
		if (value === 'search') {
			event.stopPropagation();
		} else if (value !== 'editOption') {
			onCustomKeyChange(value !== defaultValue.value ? value : null);
		}
	};

	useEffect(() => {
		onFilterChange('');
	}, [dropdownOptions]);

	useEffect(() => {
		if (value) {
			let data = JSON.parse(JSON.stringify(value));
			if (typeof value !== 'string' && value?.label) {
				data = JSON.parse(JSON.stringify(value.label));
			}
			const opt = dropdownOptions.find(opt => opt.value === data);
			if (opt) {
				const pallete = colorPallete.find(pallete => pallete.id === opt.palleteId);
				if (column.iconType === 'Bullet Point') {
					document.getElementById(`colorText_${index}_${column.name}`).innerHTML = `
	      <div style="display:flex;">
	        <div class='colorText' style="background-color: ${pallete?.color}; color: ${pallete?.textColor}; margin-right:5px;"></div>
	        <span>${data}</span>
	      </div>`;
				} else {
					document.getElementById(`colorText_${index}_${column.name}`).innerHTML =
						`<span class='colorText' style="background-color: ${pallete?.color}; color: ${pallete?.textColor}">${data}</span>`;
				}
			} else {
				document.getElementById(`colorText_${index}_${column.name}`).innerHTML = "<span class='colorText'>--</span>";
			}
		} else {
			document.getElementById(`colorText_${index}_${column.name}`).innerHTML = "<span class='colorText'>--</span>";
		}
	}, [index, value, dropdownOptions]);

	return (
		<div
			style={{
				padding: '0px',
				height: '50px',
				width: '100%',
				border: variant === 'outlined' ? '1px solid rgba(0, 0, 0, 0.23)' : 'none',
				borderBottom: fullWidth ? '1px solid rgba(0, 0, 0, 0.23)' : 'none',
				borderRadius: '6px',
				display: 'flex',
				alignItems: 'center',
			}}
			onClick={e => e.stopPropagation()}
			onMouseLeave={() => {
				setShowOptions(false);
				setShowIcon(false);
			}}
			onMouseEnter={() => setShowIcon(true)}
		>
			<CustomAutoComplete
				open={showOptions}
				popupIcon={<ArrowDropDownIcon visibility={fullWidth || showIcon ? 'visible' : 'hidden'} />}
				fieldAttributes={{
					value: value,
					defaultValue: defaultValue.value,
					optionArray: options,
				}}
				fieldEvents={{
					onChange: onChange,
					onTextFieldChange: onFilterChange,
				}}
				fieldConfig={{
					size: 'small',
					variant: 'standard',
					disabled: false,
					allowNewOptions: false,
					renderOptionComp: ({ option }) => {
						const pallete = colorPallete.find(pallete => pallete.id === option.palleteId);
						if (option.value === 'editOption') {
							return (
								<Grid
									style={{
										'flex-wrap': 'nowrap',
										marginTop: '5px',
										borderTop: '1px solid #959595',
										padding: '8px 6px 2px 6px',
									}}
									container
									spacing={0}
									onClick={() => {
										setShowOptions(false);
										globalStateController.updateState({
											showFieldModal: true,
											selectedMeta: isEmpty(column) ? null : column,
										});
									}}
								>
									<Grid
										style={{ 'flex-grow': 1, width: 'fit-content', 'max-width': 'max-content' }}
										container
										item
										xs={2}
										alignItems="center"
									>
										<EditIcon style={{ alignSelf: 'center', fontSize: 18, marginRight: 5 }} />
									</Grid>
									<Grid
										container
										item
										xs={10}
										alignItems="center"
										style={{
											fontSize: 14,
											'white-space': 'nowrap',
											'flex-grow': 1,
											width: 'fit-content',
										}}
									>
										Edit options
									</Grid>
								</Grid>
							);
						} else if (option.value === 'search') {
							return (
								<div style={{ display: 'flex', padding: '10px', width: '100%' }}>
									<TextField
										variant="outlined"
										size="small"
										placeholder="Search"
										fullWidth
										autoFocus
										value={search}
										defaultValue={search}
										onChange={e => onFilterChange(e.target.value)}
									/>
								</div>
							);
						} else {
							return (
								<Grid
									style={{ 'flex-grow': 1, width: 'fit-content', 'flex-wrap': 'nowrap' }}
									className={classes.myClass}
									container
									spacing={0}
								>
									<Grid
										style={{ 'flex-grow': 1, width: 'fit-content', 'max-width': 'max-content' }}
										container
										item
										xs={2}
										alignItems="center"
									>
										<CheckIcon
											style={{
												fontSize: 13,
												marginRight: 5,
												visibility:
													(typeof value === 'string' && option.value === value) ||
													option.value === value?.label ||
													(!value && option.value === defaultValue.label)
														? 'visible'
														: 'hidden',
											}}
										/>
									</Grid>
									<Grid
										style={{ 'flex-grow': 1, width: 'fit-content' /*"max-width": "max-content"*/ }}
										container
										item
										xs={10}
										alignItems="center"
									>
										<Grid style={{ 'flex-grow': 1, width: 'fit-content' }} item xs>
											<span
												style={{
													width: '100%',
													fontWeight: 400,
													backgroundColor: pallete?.color,
													color: pallete?.textColor,
													padding: '3px 10px',
													borderRadius: 26,
													fontSize: 14,
													overflow: 'hidden',
													'white-space': 'nowrap',
													'text-overflow': 'ellipsis',
												}}
											>
												{option.value}
											</span>
										</Grid>
									</Grid>
								</Grid>
							);
						}
					},
				}}
				//This Render Input method is used and CustomAutoComplete's own method
				// is ignored since it is overriden by following renderInput method
				renderInput={params => (
					<>
						<div
							style={{
								height: '100%',
								display: 'flex',
								'align-items': 'center',
							}}
							ref={params.InputProps.ref}
							className={`${classes.textDiv}`}
							onClick={() => setShowOptions(!showOptions)}
						>
							<Grid container spacing={0} {...params.inputProps}>
								<Grid container item xs={10}>
									<span
										style={{ 'white-space': 'nowrap', marginLeft: valueMarginLeft ? valueMarginLeft : 0 }}
										id={`colorText_${index}_${column.name}`}
									></span>
								</Grid>
							</Grid>
							<InputAdornment
								style={{ 'margin-left': -4, 'margin-right': 8 }}
								position="end"
								visibility={showIcon ? 'visible' : 'hidden'}
							>
								{params.InputProps.endAdornment.props.children[1]}
							</InputAdornment>
						</div>
					</>
				)}
			/>
		</div>
	);
};

CustomFieldSelect.propTypes = {
	index: PropTypes.number,
	value: PropTypes.any,
	onCustomKeyChange: PropTypes.func,
	dropdownOptions: PropTypes.array,
	column: PropTypes.object,
	fullWidth: PropTypes.bool,
	variant: PropTypes.string,
	valueMarginLeft: PropTypes.number,
	isOptionsEditable: PropTypes.bool,
};

export default CustomFieldSelect;
