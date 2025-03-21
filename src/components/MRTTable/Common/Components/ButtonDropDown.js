import React from 'react';

import { Tooltip } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import PropTypes from 'prop-types';

const ButtonDropDown = ({
	options,
	children,
	onClick,
	buttonStyles = {},
	sideButtonStyles = {},
	data_test_id,
	startIcon,
	tooltipText,
	...rest
}) => {
	const [open, setOpen] = React.useState(false);
	const anchorRef = React.useRef(null);
	const selectedIndex = 0;

	const handleClick = event => {
		options[selectedIndex].action(event);
		if (onClick) {
			onClick();
		}
	};

	const handleMenuItemClick = (event, index) => {
		options[index].action(event);
		// setSelectedIndex(index);
		setOpen(false);
	};

	const handleToggle = () => {
		setOpen(prevOpen => !prevOpen);
	};

	const handleClose = event => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	return (
		<>
			<ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button" {...rest}>
				<Tooltip title={tooltipText || ''} placement="top-start">
					<Button
						onClick={handleClick}
						id="addButton"
						style={buttonStyles}
						data-testid={data_test_id}
						startIcon={startIcon}
					>
						<>{children}</>
						{options[selectedIndex].text}
					</Button>
				</Tooltip>
				{options?.length > 1 && (
					<Button
						color="primary"
						size="small"
						{...rest}
						aria-controls={open ? 'split-button-menu' : undefined}
						aria-expanded={open ? 'true' : undefined}
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={handleToggle}
						style={sideButtonStyles}
					>
						<ArrowDropDownIcon id="addButtonArrowIcon" />
					</Button>
				)}
			</ButtonGroup>

			<Popper id="popper-1" open={open} anchorEl={anchorRef.current} role={undefined} transition>
				{({ TransitionProps, placement }) => (
					<Grow
						{...TransitionProps}
						style={{
							transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
						}}
					>
						<Paper>
							<ClickAwayListener onClickAway={handleClose}>
								<MenuList id="split-button-menu">
									{options.map((option, index) => {
										if (option.isShow) {
											return (
												<MenuItem
													id={`menu-item-${option.text}`}
													key={option.text}
													selected={index === selectedIndex}
													onClick={event => handleMenuItemClick(event, index)}
												>
													{option.text}
												</MenuItem>
											);
										} else {
											return null;
										}
									})}
								</MenuList>
							</ClickAwayListener>
						</Paper>
					</Grow>
				)}
			</Popper>
		</>
	);
};

ButtonDropDown.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			action: PropTypes.func.isRequired,
			text: PropTypes.string.isRequired,
			isShow: PropTypes.bool,
		})
	).isRequired,
	children: PropTypes.node,
	onClick: PropTypes.func,
	buttonStyles: PropTypes.object,
	sideButtonStyles: PropTypes.object,
	data_test_id: PropTypes.string,
	startIcon: PropTypes.string,
	tooltipText: PropTypes.string,
};

export default ButtonDropDown;
