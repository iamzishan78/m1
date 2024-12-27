import React, { useContext } from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

// contexts
import { ExpandableCardContext } from 'components/ExpandableCard/ExpandableCardContext';

import { popupController } from 'hookstate/popupStateController';

import { AppContext } from 'AppContext';

import UnitDetailCard from './UnitDetailCard';

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

export default function UnitCard(props) {
	// contexts
	const [stateExpandableCard] = useContext(ExpandableCardContext);

	const { stateValues } = popupController.useState(['selectedShape']);

	const classes = useStyles();

	return (
		<>
			{stateExpandableCard.expanded && (
				<div style={{ height: '100%' }}>
					<Card className={classes.card}>
						<CardContent className={classes.content}>
							<UnitDetailCard id={stateValues.selectedShape.id} />
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
