import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';

import { FEATURES } from 'components/Shared/FeatureFlag/common';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="left" ref={ref} {...props} />;
});

export default function AlertDialogSlide(props) {
	const useStyles = makeStyles(theme => ({
		dialog: ({ quickActionsPanelState }) => ({
			'& .MuiDialog-paper': {
				position: 'fixed',
				top: props.top ? props.top : '',
				left: props.useLeftKey
					? `${props.left || '0px'}`
					: quickActionsPanelState
						? `calc(485px + ${props.left || '0px'}) !important`
						: `calc(60px + ${props.left || '0px'}) !important`,
				width: props.width ? String(props.width) : null,
				maxHeight: props.maxHeight ? props.maxHeight : '',
				maxWidth: '100% !important',
				margin: '0 !important',
				borderTopRightRadius: '0 !important',
				overflowX: 'hidden',
				overflowY: props.hiddenOverflow ? 'hidden' : 'auto',
				transition: 'width 0.5s',
			},
			'& .MuiBackdrop-root': {
				// display: "none"
				backgroundColor: 'transparent',
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
		}),
	}));
	const { quickActionsPanelState, activeModule } = useSelector(state => state.common);
	const { user } = useSelector(state => state.app);
	const {
		location: { pathname },
	} = useSelector(state => state.router);

	const isLeftMargin = useMemo(() => {
		const isPadding =
			quickActionsPanelState &&
			(pathname.includes('/revenue') || !!user?.features?.find(f => f.name === FEATURES[activeModule.featureFlag]));
		return isPadding;
	}, [quickActionsPanelState, activeModule.featureFlag, pathname, user]);

	const classes = useStyles({
		...props,
		quickActionsPanelState: pathname !== '/documents' ? isLeftMargin : false,
	});

	return (
		<Dialog
			className={classes.dialog}
			open={props.open}
			TransitionComponent={Transition}
			keepMounted
			onClose={props.handleClickDialogClose}
			aria-labelledby="alert-dialog-slide-title"
			aria-describedby="alert-dialog-slide-description"
			style={{ zIndex: props.zIndex || 1301, border: '4px solid green', inset: 'unset' }}
		>
			{props.header && <DialogTitle id="alert-dialog-slide-title">{props.header}</DialogTitle>}

			{props.children}
		</Dialog>
	);
}
