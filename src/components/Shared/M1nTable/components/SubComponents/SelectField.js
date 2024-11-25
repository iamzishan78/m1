import React, { useState, useEffect, useContext, useCallback } from 'react';
import Select, { defaultTheme, components } from 'react-select';
import { Waypoint } from 'react-waypoint';
import { useInView } from 'react-intersection-observer';
import { colorPallete } from 'components/Table/helpers';
import { Grid, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import { copy } from 'components/Shared/functions';
import EditIcon from '@material-ui/icons/Edit';
import { AppContext } from 'AppContext';
import { globalStateController } from 'hookstate/globalStateController';

const useStyles = makeStyles(theme => ({
	myClass: {
		padding: '6px 6px',
		'& .MuiIconButton-root': {
			padding: '0px !important',
		},
	},
	reactSelect: {
		'& .react-select__option': { backgroundColor: 'red' },
	},
}));

const SelectField = ({ dropdownOptions, value, isSingleSelect, onCustomKeyChange, column, onClose }) => {
	const classes = useStyles();
	const [dropDownValues, setDropDownValues] = useState([]);
	const [displayedOptions, setDisplayedOptions] = useState(100);
	const [options, setOptions] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [, setStateApp] = useContext(AppContext);

	const defaultValue = {
		label: '--',
		value: '--',
	};

	const { colors } = defaultTheme;

	useEffect(() => {
		onFilterChange('');
	}, [dropdownOptions]);

	const CustomMenuList = props => {
		const handleScroll = () => {
			if (props.options.length >= dropDownValues.length) {
				return;
			}

			const updateArray = props.options.slice(0, props.options.length - 1);
			const startIndex = updateArray.length;
			const endIndex = Math.min(startIndex + 100, dropDownValues.length);
			setDisplayedOptions(endIndex);
			const nextOptions = dropDownValues.slice(startIndex, endIndex);
			const updatedOptions = updateArray.concat(nextOptions);

			setOptions([...updatedOptions, { label: 'edit', value: 'editOption' }]);
			const waypointElement = document.getElementById(`waypoint-${startIndex - 5}`);
			if (waypointElement) {
				waypointElement.scrollIntoView();
			}
		};

		return (
			<components.MenuList {...props}>
				<>
					{props.options.map((opt, index) => {
						return (
							<React.Fragment key={index}>
								{index === props.options.length - 5 && <Waypoint onEnter={handleScroll} />}
								<MyOption setValue={props.setValue} opt={opt} index={index} />
							</React.Fragment>
						);
					})}
				</>
			</components.MenuList>
		);
	};

	const MyOption = ({ opt, setValue, index }) => {
		const [ref, inView] = useInView();
		const pallete = colorPallete.find(pallete => pallete.id === opt.palleteId);
		return (
			<div ref={ref} id={`waypoint-${index}`}>
				{inView ? (
					<>
						{opt.value === 'editOption' ? (
							<Grid
								id={opt.value}
								style={{
									flexWrap: 'nowrap',
									marginTop: '5px',
									borderTop: '1px solid #959595',
									padding: '8px 6px 2px 6px',
									cursor: 'pointer',
								}}
								container
								spacing={0}
								onClick={e => {
									e.stopPropagation();
									setIsOpen(false);
									onClose();
									globalStateController.updateState({
										showFieldModal: true,
									});
									setStateApp(stateApp => ({
										...stateApp,
										selectedMeta: column,
										showFieldModal: true,
									}));
								}}
							>
								<Grid
									style={{
										flexGrow: 1,
										width: 'fit-content',
										maxWidth: 'max-content',
									}}
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
										whiteSpace: 'nowrap',
									}}
								>
									Edit options
								</Grid>
							</Grid>
						) : (
							<Grid
								style={{
									'flex-grow': 1,
									width: 'fit-content',
									'flex-wrap': 'nowrap',
								}}
								className={classes.myClass}
								container
								spacing={0}
							>
								<Grid
									style={{
										'flex-grow': 1,
										width: 'fit-content',
										maxWidth: 'max-content',
									}}
									container
									item
									xs={2}
									alignItems="center"
								>
									<Checkbox
										checked={value?.includes(opt.value) || (!value && opt.value === defaultValue.label)}
										onChange={e => {
											if (e.target.checked) {
												setValue(opt, 'select-option');
											} else {
												setValue(opt, 'deselect-option');
											}
										}}
										color="default"
										style={{ marginRight: 5 }}
										inputProps={{
											'aria-label': 'checkbox with default color',
										}}
									/>
								</Grid>
								<Grid
									style={{
										'flex-grow': 1,
										width: 'fit-content' /*"max-width": "max-content"*/,
									}}
									container
									item
									xs={10}
									alignItems="center"
								>
									<Grid style={{ 'flex-grow': 1, width: 'fit-content' }} item xs>
										<Tooltip title={opt.value} placement="top">
											<Typography
												style={{
													width: '100%',
													fontWeight: 400,
													backgroundColor: pallete?.color,
													color: pallete?.textColor,
													padding: '3px 10px',
													borderRadius: 26,
													fontSize: 14,
													overflow: 'hidden',
													whiteSpace: 'nowrap',
													textOverflow: 'ellipsis',
													maxWidth: '187px',
												}}
											>
												{opt.value}
											</Typography>
										</Tooltip>
									</Grid>
								</Grid>
							</Grid>
						)}
					</>
				) : (
					<div style={{ height: '30px' }}></div>
				)}
			</div>
		);
	};

	const onFilterChange = search => {
		const filteroptions = JSON.parse(
			JSON.stringify(dropdownOptions.filter(op => op.value?.toLowerCase()?.includes(search.toLowerCase())))
		);
		filteroptions.unshift(defaultValue);
		setDropDownValues(filteroptions);
		const endIndex = Math.min(displayedOptions, filteroptions.length);
		const initialOptions = filteroptions.slice(0, endIndex);
		setOptions([...initialOptions, { label: 'edit', value: 'editOption' }]);
	};

	const handleKeyDown = e => {
		if (e.key === 'Escape' && isOpen) {
			e.stopPropagation();
			onClose();
			setIsOpen(!isOpen);
		}
	};

	const Svg = p => <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation" {...p} />;

	const DropdownIndicator = () => (
		<div css={{ color: colors.neutral20, height: 24, width: 32 }}>
			<Svg>
				<path
					d="M16.436 15.085l3.94 4.01a1 1 0 0 1-1.425 1.402l-3.938-4.006a7.5 7.5 0 1 1 1.423-1.406zM10.5 16a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11z"
					fill="currentColor"
					fillRule="evenodd"
				/>
			</Svg>
		</div>
	);

	const onSelectChange = act => {
		// toggleOpen();
		if (act?.value !== 'editOption' && act?.value !== 'search') {
			if (isSingleSelect) {
				onCustomKeyChange(act?.value !== defaultValue.value ? act?.value : null);
				onClose();
				setIsOpen(false);
			} else {
				let newValue = value ? copy(value) : [];
				const selectedValue = act?.value !== defaultValue.value ? act?.value : null;
				if (!Array.isArray(newValue) || newValue?.length === 0) {
					newValue = [selectedValue];
				} else if (newValue.includes(selectedValue)) {
					const index = newValue.findIndex(v => v === selectedValue);
					newValue.splice(index, 1);
				} else {
					newValue.push(selectedValue);
				}
				onCustomKeyChange(newValue);
			}
		}
	};

	const selectStyles = {
		control: provided => ({ ...provided, minWidth: 240, margin: 8 }),
		menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
		menuPortal: base => ({
			...base,
			zIndex: 9999,
			backgroundColor: 'white',
			position: 'fixed',
			maxHeight: '150px',
			overflowY: 'auto',
		}),
	};

	const filterOptions = (candidate, input) => {
		if (candidate.value === 'editOption') {
			return true;
		}
		return candidate.value.toLowerCase().includes(input?.toLowerCase());
	};

	const onSearchChange = value => {
		if (value) {
			setDisplayedOptions(100);
			const filterOptions = dropdownOptions.filter(op => {
				return op.value?.toLowerCase()?.includes(value?.toLowerCase());
			});
			setDropDownValues(filterOptions);
			const endIndex = Math.min(100, filterOptions.length);
			setOptions([...filterOptions.slice(0, endIndex), { label: 'edit', value: 'editOption' }]);
		} else {
			setDisplayedOptions(100);
			onFilterChange('');
		}
	};

	return (
		<Select
			captureMenuScroll={false}
			classNamePrefix="react-select"
			className="react-select-container"
			autoFocus
			backspaceRemovesValue={false}
			controlShouldRenderValue={false}
			hideSelectedOptions={false}
			isClearable={false}
			id="searchForValue"
			menuIsOpen
			onKeyDown={handleKeyDown}
			onChange={e => onSelectChange(e)}
			options={options
				.filter(op => typeof op.value === 'string')
				.map(op => ({
					...op,
					value: op.value,
					label: op.value,
				}))}
			onInputChange={input => {
				onSearchChange(input);
			}}
			filterOption={filterOptions}
			components={{ DropdownIndicator, IndicatorSeparator: null, MenuList: CustomMenuList }}
			placeholder="Search for value"
			styles={selectStyles}
			tabSelectsValue={false}
			// value={value}
			menuPortalTarget={document.body}
		/>
	);
};

export default SelectField;
