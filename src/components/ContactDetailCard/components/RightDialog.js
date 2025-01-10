import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const Transition = React.forwardRef((props, ref) => {
	return <Slide direction="left" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

function AlertDialogSlide(props) {
	const useStyles = makeStyles(() => ({
		dialog: {
			'& .MuiDialog-paper': {
				position: 'fixed',
				top: props.top ?? '0 !important',
				right: '0px !important',
				width: props.width ? String(props.width) : null,
				maxWidth: '100% !important',
				minHeight: props.height ?? '100vh !important',
				height: props.height ?? '100vh !important',
				margin: '0 !important',
				borderTopRightRadius: '0 !important',
				overflowX: 'hidden',
				overflowY: props.hiddenOverflow ? 'hidden' : 'auto',
				transition: 'width 0.5s',
			},
			'& .MuiBackdrop-root': {
				backgroundColor: props.noBorder ? 'transparent !important' : '',
			},
			'& .MuiListItem-container': {
				borderBottom: '1px solid #c7c7c7',
			},
			'& .MuiListItemText-primary': {
				color: '#c8c8c8',
			},
			'& .MuiListItemText-secondary': {
				color: '#c7c7c7!important',
			},
			'& .MuiList-padding': {
				padding: '23px 23px 8px',
			},
			'& svg': {
				fill: '#c8c8c8',
			},
		},
	}));

	const classes = useStyles(props);
	return (
		<Dialog
			className={classes.dialog}
			open={props.open}
			disableEnforceFocus={props.disableEnforceFocus}
			TransitionComponent={Transition}
			keepMounted
			onClose={props.handleClickDialogClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			style={{ zIndex: 1300, border: '4px solid green', inset: 'unset' }}
			hideBackdrop={!!props.hideBackdrop}
		>
			{props.header && <DialogTitle id="alert-dialog-slide-title">{props.header}</DialogTitle>}

			{props.children}
		</Dialog>
	);
}

AlertDialogSlide.propTypes = {
	top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	hiddenOverflow: PropTypes.bool,
	noBorder: PropTypes.bool,
	open: PropTypes.bool,
	disableEnforceFocus: PropTypes.bool,
	handleClickDialogClose: PropTypes.func,
	hideBackdrop: PropTypes.bool,
	header: PropTypes.node,
	children: PropTypes.node,
};

export default AlertDialogSlide;
