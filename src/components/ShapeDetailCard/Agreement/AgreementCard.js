import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// contexts
import { ExpandableCardContext } from 'components/ExpandableCard/ExpandableCardContext';

import { mapControlsController } from 'hookstate/mapControlsController';
import { popupController } from 'hookstate/popupStateController';

import AgreementDetailCard from './AgreementDetailCard';

const useStyles = makeStyles(theme => ({
	card: {
		borderStyle: 'none',
		height: '100%',
		boxShadow: 'none',
	},
	content: {
		padding: '0 !important',
		height: '100%',
	},
}));

export default function AgreementCard(props) {
	// contexts
	const [stateExpandableCard] = useContext(ExpandableCardContext);

	const { stateValues } = popupController.useState(['selectedShape']);

	const classes = useStyles();
	const dispatch = useDispatch();

	useEffect(() => {
		mapControlsController.updateState({
			mapGridCardActivated: false,
		});
	}, [dispatch]);

	return (
		<>
			{stateExpandableCard.expanded && (
				<div style={{ height: '100%' }}>
					<Card className={classes.card}>
						<CardContent className={classes.content}>
							<AgreementDetailCard id={stateValues.selectedShape.id} />
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
