import React, { Suspense, useContext, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { agreementLayers } from 'components/Shared/functions/shapeLayer';
import { popupController } from 'hookstate/popupStateController';
import { ExpandableCardContext } from 'components/ExpandableCard/ExpandableCardContext';
import { mapControlsController } from 'hookstate/mapControlsController';
import { CUSTOMLAYER } from 'graphQL/useQueryCustomLayer';
import { useLazyQuery } from '@apollo/client';
import { tableGlobalController } from 'hookstate/tableController';
import { formatLayerForMap } from 'utils/helper';

// Lazy load components
const UnitDetailCard = React.lazy(() => import('./Unit/UnitDetailCard'));
const AgreementDetailCard = React.lazy(() => import('./Agreement/AgreementDetailCard'));
const ParcelsDetailCard = React.lazy(() => import('components/ParcelsDetailCard/ParcelsDetailCard'));

const useStyles = makeStyles(() => ({
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

export default function ShapeCardProvider({ type }) {
	const popupState = popupController.useState(['selectedShape']);
	const popupVals = popupState.stateValues;
	const globalState = tableGlobalController.useState(['refetch']);
	const globalStateValues = globalState.stateValues;

	const [stateExpandableCard] = useContext(ExpandableCardContext);
	const classes = useStyles();

	const [getCustomLayer, { data: dataCustomLayer, refetch: refetchCustomLayer }] = useLazyQuery(CUSTOMLAYER);

	useEffect(() => {
		if (dataCustomLayer) {
			refetchCustomLayer();
		}
	}, [globalStateValues?.refetch]);

	useEffect(() => {
		const id = popupVals.selectedShape.id;
		if (id) {
			getCustomLayer({
				variables: {
					id,
				},
			});
		}
	}, [popupVals.selectedShape.id]);

	useEffect(() => {
		if (dataCustomLayer && dataCustomLayer.customLayer) {
			popupController.updateState({
				selectedShape: formatLayerForMap(dataCustomLayer).feature,
			});
		}
	}, [dataCustomLayer]);

	useEffect(() => {
		mapControlsController.updateState({
			mapGridCardActivated: false,
		});
	}, []);

	return (
		<>
			{stateExpandableCard.expanded && (
				<div style={{ height: '100%' }}>
					<Card className={classes.card}>
						<CardContent className={classes.content}>
							<Suspense fallback={<CircularProgress color="secondary" />}>
								{type === 'unit' && (
									<UnitDetailCard id={popupVals?.selectedShape?.id} dataCustomLayer={dataCustomLayer} />
								)}
								{agreementLayers.includes(type) && (
									<AgreementDetailCard id={popupVals?.selectedShape?.id} dataCustomLayer={dataCustomLayer} />
								)}
								{type === 'parcel' && (
									<ParcelsDetailCard
										id={popupVals.selectedShape.id}
										selectTabIndex={popupVals.parcelDetailCardTabIndex}
										dataCustomLayer={dataCustomLayer}
									/>
								)}
							</Suspense>
						</CardContent>
					</Card>
				</div>
			)}
		</>
	);
}
