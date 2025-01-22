import React from 'react';

import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Contacts from 'components/FlowDrawer/Contacts';

import { slidoutStateController } from 'hookstate/slidoutStateController';

import CommentComponent from '../CommentComponent';
import Documents from '../Documents';

const useStyles = makeStyles(theme => ({
	homeRoot: {
		padding: '15px 25px 0px',
	},
	otherViewRoot: {
		padding: '15px 25px 0px',
	},
}));

function DialogContent(props) {
	const classes = useStyles();
	const { view, parentId, loader } = slidoutStateController.useState(['view', 'parentId', 'loader']);
	const { name, Component } = view;
	const { consts, functions } = view.props;

	if (loader) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center' }}>
				<CircularProgress size="40px" />
			</div>
		);
	}

	if (name === 'Home') {
		return (
			<div
				style={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-between',
					height: ' calc(100vh - 120px)',
				}}
			>
				<Component />
				<div>
					<CommentComponent targetLabel={'activity'} targetSourceId={parentId} />
				</div>
			</div>
		);
	} else if (name === 'Documents') {
		return <Documents id={parentId} isTransactPage={true} />;
	} else if (name === 'Contacts') {
		if (consts && functions) {
			const { loading, stateAppKey } = consts;
			const { gotoContact, getRemoveDescriptorResponse, addSelectedContact, refetchData } = functions;
			return (
				<Contacts
					stateAppKey={stateAppKey}
					gotoContact={gotoContact}
					getRemoveDescriptorResponse={getRemoveDescriptorResponse}
					addSelectedContact={addSelectedContact}
					loading={loading}
					getData={refetchData}
				/>
			);
		}
	} else if (Component) {
		return <Component />;
	}

	return <div className={classes.otherViewRoot}>other views {name}</div>;
}

export default DialogContent;
