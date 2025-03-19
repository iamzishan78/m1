import React, { useState, useEffect, useContext } from 'react';
import { useInView } from 'react-intersection-observer';
import Select, { defaultTheme, components } from 'react-select';
import { Waypoint } from 'react-waypoint';

import { Grid, Tooltip } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';

import PropTypes from 'prop-types';

import { copy } from 'components/Shared/functions';

import { globalStateController } from 'controllers/globalStateController';

import { BulletPointMeta } from 'utils/BulletPointMeta';
import { ChipMeta } from 'utils/ChipMeta';

import { AppContext } from 'AppContext';

const useStyles = makeStyles(() => ({
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

const SelectField = ({
	dropdownOptions,
	value,
	isSingleSelect,
	onCustomKeyChange,
	column,
	onClose,
	dropdownPosition,
}) => {
	const classes = useStyles();
	const [dropDownValues, setDropDownValues] = useState([]);
	const [displayedOptions, setDisplayedOptions] = useState(100);
	const [options, setOptions] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [, setStateApp] = useContext(AppContext);
	const isBulletPointMeta = column?.iconType === 'Bullet Point';

	const defaultValue = {
		label: '--',
		value: '--',
	};

	const { colors } = defaultTheme;

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
							<React.Fragment key={opt.value}>
								{index === props.options.length - 5 && <Waypoint onEnter={handleScroll} />}
								<MyOption setValue={props.setValue} opt={opt} index={index} />
							</React.Fragment>
						);
					})}
				</>
			</components.MenuList>
		);
	};
	CustomMenuList.propTypes = {
		options: PropTypes.array.isRequired,
		setValue: PropTypes.func.isRequired,
	};

	const MyOption = ({ opt, setValue, index }) => {
		const [ref, inView] = useInView();
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
										selectedMeta: column,
									});
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
											{isBulletPointMeta ? (
												<BulletPointMeta
													option={opt}
													key={index}
													index={index}
													bulletValue={opt.value}
													iconType={column?.iconType}
												/>
											) : (
												<ChipMeta
													option={opt}
													key={index}
													index={index}
													chipValue={opt.value}
													iconType={column?.iconType}
													isSingleSelect
												/>
											)}
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

	MyOption.propTypes = {
		opt: PropTypes.object.isRequired,
		setValue: PropTypes.func.isRequired,
		index: PropTypes.number.isRequired,
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
		<div style={{ color: colors.neutral20, height: 24, width: 32 }}>
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
		control: provided => ({
			...provided,
			minWidth: 240,
			margin: 8,
		}),
		menu: provided => ({
			...provided,
			position: 'absolute',
			top: dropdownPosition === 'top' ? 'auto' : '100%',
			bottom: dropdownPosition === 'top' ? '100%' : 'auto',
			boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)',
			zIndex: 9999,
			backgroundColor: 'white',
			maxHeight: '200px',
			overflowY: 'auto',
		}),
		menuPortal: base => ({
			...base,
			zIndex: 9999,
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
SelectField.propTypes = {
	dropdownOptions: PropTypes.array.isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
	isSingleSelect: PropTypes.bool,
	onCustomKeyChange: PropTypes.func.isRequired,
	column: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
	dropdownPosition: PropTypes.string,
	ref: PropTypes.object,
};

export default SelectField;
