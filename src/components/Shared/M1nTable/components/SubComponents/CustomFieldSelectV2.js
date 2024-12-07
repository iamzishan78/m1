import React, { useState, useEffect, useContext } from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Grid, InputAdornment, Paper, InputBase, ButtonBase } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles, alpha } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/lab/es/internal/svg-icons/ArrowDropDown';
import { colorPallete } from 'components/Table/helpers';
import EditIcon from '@material-ui/icons/Edit';
import Popper from '@material-ui/core/Popper';
import isEmpty from 'lodash/isEmpty';
import { AppContext } from 'AppContext';

const useStyles = makeStyles(theme => ({
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
		'& .MuiInputBase-input': { caretColor: 'black' },
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
	button: {
		textAlign: 'left',
		paddingBottom: 8,
		color: '#586069',
		justifyContent: 'inherit',
		'& svg': {
			width: 16,
			height: 16,
		},
	},
	tag: {
		marginTop: 3,
		height: 20,
		padding: '.15em 4px',
		fontWeight: 600,
		lineHeight: '15px',
		borderRadius: 2,
	},
	popper: {
		border: '1px solid rgba(27,31,35,.15)',
		boxShadow: '0 3px 12px rgba(27,31,35,.15)',
		borderRadius: 3,
		zIndex: 1,
		fontSize: 13,
		color: '#586069',
		backgroundColor: '#f6f8fa',
	},
	header: {
		borderBottom: '1px solid #e1e4e8',
		padding: '8px 10px',
		fontWeight: 600,
	},
	inputBase: {
		padding: 10,
		width: '220px',
		borderBottom: '1px solid #dfe2e5',
		'& input': {
			borderRadius: 4,
			backgroundColor: theme.palette.common.white,
			padding: 8,
			transition: theme.transitions.create(['border-color', 'box-shadow']),
			border: '1px solid #ced4da',
			fontSize: 14,
			'&:focus': {
				boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
				borderColor: theme.palette.primary.main,
			},
		},
	},
	option: {
		minHeight: 'auto',
		width: '220px',
		alignItems: 'flex-start',
		padding: 8,
		'&[aria-selected="true"]': {
			backgroundColor: 'transparent',
		},
		'&[data-focus="true"]': {
			backgroundColor: theme.palette.action.hover,
		},
	},
	popperDisablePortal: {
		position: 'relative',
	},
}));

const CustomFieldSelectV2 = ({
	index,
	value,
	onCustomKeyChange,
	dropdownOptions,
	column,
	fullWidth,
	variant,
	valueMarginLeft,
}) => {
	const classes = useStyles();
	const [options, setOptions] = useState([]);
	const [, setStateApp] = useContext(AppContext);
	const defaultValue = {
		label: '--',
		value: '--',
	};
	const [showIcon, setShowIcon] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(() => {
		onFilterChange('');
	}, [dropdownOptions]);

	const onFilterChange = search => {
		const options = JSON.parse(
			JSON.stringify(dropdownOptions.filter(op => op.value?.toLowerCase()?.includes(search.toLowerCase())))
		);
		options.unshift(defaultValue);
		options.push({ label: 'edit', value: 'editOption' });
		setOptions(options);
	};

	const onChange = (e, act, reason) => {
		if (reason === 'clear') {
			e.stopPropagation();
		}
		if (act?.value === 'search') e.stopPropagation();
		else if (act?.value !== 'editOption') {
			onCustomKeyChange(act?.value !== defaultValue.value ? act?.value : null);
		}
	};

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
				document.getElementById(`colorText_${index}_${column.name}`).innerHTML = `<span class='colorText'>--</span>`;
			}
		} else {
			document.getElementById(`colorText_${index}_${column.name}`).innerHTML = `<span class='colorText'>--</span>`;
		}
	}, [index, value, dropdownOptions]);

	const open = Boolean(anchorEl);
	const id = open ? 'custom-field-select-popper' : undefined;

	return (
		<div
			style={{
				padding: '0px',
				width: '100%',
				borderBottom: fullWidth ? '1px solid' : 'none',
				borderRadius: 5,
				border: variant === 'outlined' ? '1px solid rgba(0, 0, 0, 0.23)' : 'none',
			}}
			onClick={e => e.stopPropagation()}
			onMouseLeave={e => {
				setShowIcon(false);
			}}
			onMouseEnter={() => setShowIcon(true)}
		>
			<ButtonBase
				disableRipple
				className={classes.button}
				aria-describedby={id}
				onClick={event => setAnchorEl(event.currentTarget)}
			>
				<span
					style={{ whiteSpace: 'nowrap', marginLeft: valueMarginLeft ? valueMarginLeft : 0 }}
					id={`colorText_${index}_${column.name}`}
				></span>
				{showIcon && <ArrowDropDownIcon />}
			</ButtonBase>
			<Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start" className={classes.popper}>
				<Autocomplete
					open={true}
					className={classes.search}
					style={{
						height: '100%',
						margin: 0,
					}}
					classes={{
						paper: classes.paper,
						option: classes.option,
						popperDisablePortal: classes.popperDisablePortal,
					}}
					onClose={() => setAnchorEl(null)}
					PaperComponent={props => {
						return (
							<Paper
								className={props.className}
								style={{
									width: fullWidth ? 'none' : 'fit-content',
									'max-width': fullWidth ? 'none' : '400px',
								}}
							>
								{props.children}
							</Paper>
						);
					}}
					defaultValue={defaultValue.value}
					value={value}
					disableListWrap
					options={options
						.filter(op => typeof op.value === 'string')
						.map(op => ({
							...op,
							label: op.value,
							value: op.value,
						}))}
					getOptionLabel={option => (option?.label ? option.label : '')}
					getOptionSelected={option => {
						return option.value === value || option.value === value?.value;
					}}
					filterOptions={(options, params) => {
						return options;
					}}
					renderOption={option => {
						const pallete = colorPallete.find(pallete => pallete.id === option.palleteId);
						return option.value === 'editOption' ? (
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
									setStateApp(stateApp => ({
										...stateApp,
										selectedMeta: isEmpty(column) ? null : column,
										showFieldModal: true,
									}));
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
									style={{ 'flex-grow': 1, width: 'fit-content', fontSize: 14, 'white-space': 'nowrap' }}
									container
									item
									xs={10}
									alignItems="center"
								>
									Edit options
								</Grid>
							</Grid>
						) : (
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
								<Grid style={{ 'flex-grow': 1, width: 'fit-content' }} container item xs={10} alignItems="center">
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
											{option.label}
										</span>
									</Grid>
								</Grid>
							</Grid>
						);
					}}
					renderInput={params => (
						<InputBase
							ref={params.InputProps.ref}
							inputProps={params.inputProps}
							autoFocus
							className={classes.inputBase}
							onChange={event => onFilterChange(event.target.value)}
						/>
					)}
					onChange={onChange}
				/>
			</Popper>
		</div>
	);
};

export default CustomFieldSelectV2;
