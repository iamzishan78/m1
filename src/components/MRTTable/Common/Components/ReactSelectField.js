import React, { useState, useEffect, useRef } from 'react';

import { Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/lab/es/internal/svg-icons/ArrowDropDown';

import PropTypes from 'prop-types';

import { BulletPointMeta } from 'utils/BulletPointMeta';
import { ChipMeta } from 'utils/ChipMeta';
import { getMetaCss } from 'utils/getMetaCss';

import SelectField from './SelectField';

const useStyles = makeStyles(() => ({
	root: {
		'&:hover': {
			borderBottom: ({ showUnderline }) => (showUnderline ? '2px solid rgba(0, 0, 0, 0.87) !important' : 'inherit'),
		},
	},
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
		'& .MuiInputBase-input': { color: 'red', caretColor: 'black' },
	},
	textDiv: {
		fontSize: '14px',
	},
	paper: {
		// width: "fit-content",
		'min-width': '125px',
		// "max-width": fullWidth ? "400px" : "none",
		'& .MuiAutocomplete-option': {
			padding: '0px !important',
		},
		'& .MuiAutocomplete-listbox': {
			padding: '8px 10px',
		},
	},
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

const ReactSelectField = ({
	isSingleSelect,
	onCustomKeyChange,
	dropdownOptions,
	column,
	value,
	fullWidth,
	showUnderline,
	showChevron,
	variant,
	tooltipView,
	minHeight = '50px',
	...rest
}) => {
	if (!isSingleSelect && !Array.isArray(value) && value) {
		value = [value];
	}
	const classes = useStyles({ showUnderline, showChevron });
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef(null);
	const [showIcon, setShowIcon] = useState(showChevron);

	const dropdownRef = useRef(null);
	const [dropdownPosition, setDropdownPosition] = useState('bottom');

	useEffect(() => {
		if (wrapperRef.current && dropdownRef.current) {
			const wrapperRect = wrapperRef.current.getBoundingClientRect();
			const windowHeight = window.innerHeight;
			const spaceBelow = windowHeight - wrapperRect.bottom;
			const spaceAbove = wrapperRect.top;

			// Set dropdown position based on available space
			setDropdownPosition(spaceBelow < 200 && spaceAbove > 200 ? 'top' : 'bottom');
		}
	}, [wrapperRef, dropdownRef, isOpen]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [wrapperRef]);

	const Menu = props => {
		const shadow = 'hsla(218, 50%, 10%, 0.1)';
		return (
			<div
				style={{
					backgroundColor: 'white',
					borderRadius: 4,
					boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
					marginTop: 8,
					position: 'absolute',
					zIndex: 2,
				}}
				{...props}
			/>
		);
	};
	const Blanket = props => (
		<div
			style={{
				bottom: 0,
				left: 0,
				top: 0,
				right: 0,
				position: 'fixed',
				zIndex: 1,
			}}
			{...props}
		/>
	);
	const Dropdown = ({ children, isOpen, target, onClose }) => (
		<div style={{ position: 'relative' }}>
			{target}
			{isOpen ? <Menu>{children}</Menu> : null}
			{isOpen ? <Blanket onClick={onClose} /> : null}
		</div>
	);

	Dropdown.propTypes = {
		children: PropTypes.node,
		isOpen: PropTypes.bool.isRequired,
		target: PropTypes.node.isRequired,
		onClose: PropTypes.func.isRequired,
	};

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	return (
		<>
			<div
				id={'reactSelectField'}
				ref={wrapperRef}
				className={classes.root}
				style={{
					padding: '0px',
					minHeight,
					width: '100%',
					border: variant === 'outlined' ? '1px solid rgba(0, 0, 0, 0.42)' : 'none',
					borderBottom: fullWidth ? '1px solid rgba(0, 0, 0, 0.42)' : 'none',
				}}
				onMouseLeave={() => {
					// setIsOpen(false);
					setShowIcon(showChevron || false);
				}}
				onMouseEnter={() => {
					setShowIcon(true);
				}}
				onClick={e => e.stopPropagation()}
			>
				<Dropdown
					isOpen={isOpen}
					onClose={() => toggleOpen()}
					target={
						<div
							onClick={() => toggleOpen()}
							style={{
								width: '100%',
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							<span className="colorText" id={rest.id || 'selectedValues'}>
								<MultSelectValues
									tooltipView={tooltipView}
									value={value}
									dropdownOptions={dropdownOptions}
									onCustomKeyChange={onCustomKeyChange}
									isSingleSelect={isSingleSelect}
									column={column}
								/>
							</span>
							<>
								{showIcon && (
									<>
										{isOpen ? (
											<ArrowDropUpIcon style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} />
										) : (
											<ArrowDropDownIcon style={{ cursor: 'pointer', color: 'rgba(0, 0, 0, 0.54)' }} />
										)}
									</>
								)}
							</>
						</div>
					}
				>
					<SelectField
						dropdownOptions={dropdownOptions}
						dropdownPosition={dropdownPosition}
						ref={dropdownRef}
						value={value}
						isSingleSelect={isSingleSelect}
						onCustomKeyChange={onCustomKeyChange}
						column={column}
						onClose={() => setIsOpen(false)}
					/>
				</Dropdown>
			</div>
		</>
	);
};
ReactSelectField.propTypes = {
	isSingleSelect: PropTypes.bool.isRequired,
	onCustomKeyChange: PropTypes.func,
	dropdownOptions: PropTypes.array,
	column: PropTypes.object,
	value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	fullWidth: PropTypes.bool,
	showUnderline: PropTypes.bool,
	showChevron: PropTypes.bool,
	variant: PropTypes.string,
	tooltipView: PropTypes.bool,
	minHeight: PropTypes.string,
};

export default ReactSelectField;

const MultSelectValues = ({ value, dropdownOptions, onCustomKeyChange, isSingleSelect, tooltipView, column }) => {
	let tooltipValues = value?.slice(1) || [];
	const isBulletPointMeta = column.iconType === 'Bullet Point';

	const ToolTipView = () => {
		const option = dropdownOptions.find(opt => opt.value === value[0]);
		return (
			<>
				{isBulletPointMeta ? (
					<BulletPointMeta option={option} index={0} bulletValue={value[0]} iconType={column?.iconType} />
				) : (
					<ChipMeta
						index={0}
						chipsArray={value}
						chipValue={value[0]}
						option={option}
						iconType={column?.iconType}
						onCustomKeyChange={onCustomKeyChange}
						isSingleSelect={isSingleSelect}
					/>
				)}
				{value?.slice(1).length > 0 && (
					<Tooltip
						title={
							<React.Fragment>
								{tooltipValues.map(v => (
									<Typography key={v} color="inherit">
										{v}
									</Typography>
								))}
							</React.Fragment>
						}
					>
						<span
							className="colorText"
							style={{
								borderRadius: '20px',
								whiteSpace: 'nowrap',
								backgroundColor: '#c5c2c2',
								color: 'black',
								display: 'flex',
								padding: '5px 10px 5px 5px',
							}}
						>
							+{tooltipValues.length}
						</span>
					</Tooltip>
				)}
			</>
		);
	};

	const MultiSelectView = () => (
		<>
			{value.map((v, index) => {
				const option = dropdownOptions.find(opt => opt.value === v);

				return isBulletPointMeta ? (
					<BulletPointMeta
						key={option.value}
						index={index}
						option={option}
						bulletValue={v}
						iconType={column.iconType}
					/>
				) : (
					<ChipMeta
						key={option.value}
						index={index}
						chipsArray={value}
						chipValue={v}
						option={option}
						iconType={column?.iconType}
						onCustomKeyChange={onCustomKeyChange}
					/>
				);
			})}
		</>
	);

	return (
		<span
			style={{
				display: 'flex',
				width: 'fit-content',
				flexWrap: 'wrap',
				maxWidth: '380px',
				gap: '5px',
			}}
		>
			{value && value.length > 0 && Array.isArray(value) ? (
				<>{tooltipView ? <ToolTipView /> : <MultiSelectView />}</>
			) : (
				<>
					{value && typeof value === 'string' ? (
						isBulletPointMeta ? (
							<BulletPointMeta
								index={0}
								option={dropdownOptions.find(opt => opt.value === value)}
								bulletValue={value}
								iconType={column.iconType}
							/>
						) : (
							<span
								className="colorText"
								style={getMetaCss({
									option: dropdownOptions.find(opt => opt.value === value),
									iconType: column.iconType,
								})}
							>
								<span>{value}</span>
							</span>
						)
					) : (
						<span className="colorText">--</span>
					)}
				</>
			)}
		</span>
	);
};

MultSelectValues.propTypes = {
	value: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
	dropdownOptions: PropTypes.array.isRequired,
	onCustomKeyChange: PropTypes.func,
	isSingleSelect: PropTypes.bool,
	tooltipView: PropTypes.bool,
	column: PropTypes.object.isRequired,
};
