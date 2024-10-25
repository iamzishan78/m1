import React, { memo, useEffect, useMemo, useRef } from 'react';
import Portal from '@material-ui/core/Portal';
import { useMutation } from '@apollo/client';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import ExpandableCardProvider from 'components/ExpandableCard/ExpandableCardProvider';
import WellCardProvider from 'components/WellCard/WellCardProvider';
import PortalD from 'components/Map/components/Portal';
import PermitCardProvider from 'components/PermitCard/PermitCardProvider';
import ShapeDetailCard from 'components/ShapeDetailCard';
import UdLayerCardProvider from 'components/UdLayerCard/UdLayerCardProvider';
import LayerSelectionPopup from 'components/Map/components/popup/LayerSelectionPopup';
import { popupController } from 'hookstate/popupStateController';
import { globalStateController } from 'hookstate/globalStateController';
import { drawController } from 'hookstate/drawStateController';
import WellClick from './WellClick';
import PermitClick from './PermitClick';
import { layerController } from 'hookstate/layerStateController';

function Portals({ hideShape }) {
	const container = useRef(null);
	const modalContainer = useRef(null);

	const popupState = popupController.useState([
		'selectedWell',
		'selectedShape',
		'selectedPermit',
		'selectedParcel',
		'expandedCard',
		'popupOpen',
		'selectedUserDefinedLayer',
		'layerSelectionPopup',
		'selectionLayers',
	]);

	const popupVals = popupState.stateValues;

	const drawState = drawController.useState(['shapeEdit']);

	// Set the shape subtitle
	const commonSahpeSubTitle = useMemo(() => {
		let shapeSubtitle = '';
		if (popupVals.selectedShape) { // For agreemennt and unit
			shapeSubtitle = `${popupVals.selectedShape.originalProperties.County || ''}, ${popupVals.selectedShape.originalProperties.State || ''}`;
		} else if (popupVals.selectedParcel) { // For parcel
			shapeSubtitle = `${popupVals.selectedParcel.originalProperties.County || ''}, ${popupVals.selectedParcel.originalProperties.State || ''}`;
		}
		return shapeSubtitle;
		},[popupVals.selectedShape, popupVals.selectedParcel]);

	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER);

	const deleteCustomLayer = (id, layer) => {
		updateCustomLayer({
			variables: {
				customLayerId: id,
				customLayer: {
					IsDeleted: true,
				},
			},
			refetchQueries: ['getCustomLayers'],
			awaitRefetchQueries: true,
			onCompleted: () => {
				globalStateController.updateState({ reFetchLayer: layer });
			},
		}).then((res) => {
			layerController.resetBounds(res?.data?.updateCustomLayer?.customLayer?.layer)
		});
	};

	// useLayoutEffect(() => {
	// 	if (popupVals.popupOpen) return;

	// 	const popUps = document.getElementsByClassName('mapboxgl-popup');
	// 	if (popUps[0]) {
	// 		popUps[0].remove();
	// 	}
	// }, [popupState.popupOpen]);

	// useEffect(() => {
	// 	if (!window.mapRef) return;

	// 	if (!popupVals.popupOpen || drawState.stateValues.shapeEdit) return;

	// 	drawBoundary(popupVals.selectedShape || popupVals.selectedParcel || popupVals.selectedUserDefinedLayer);

	// 	if (popupVals.selectedWell)
	// 		drawWellBoundary([
	// 			popupVals.selectedWell.longitude,
	// 			popupVals.selectedWell.latitude,
	// 		]);
	// }, [popupState.popupOpen, popupState.selectedWell, popupState.selectedUserDefinedLayer, drawState.shapeEdit]);

	useEffect(() => {
		if (
			!popupVals.selectedWell &&
			// !popupVals.selectedShape &&
			// !popupVals.selectedPermit &&
			// !popupVals.selectedParcel &&
			!popupVals.selectedUserDefinedLayer
		)
			return;

		if (popupVals.expandedCard) return;

		popupController.updateState({
			popupOpen: true,
		});
	}, [
		popupState.selectedWell,
		// popupState.selectedShape,
		// popupState.selectedPermit,
		// popupState.selectedParcel,
		popupState.selectedUserDefinedLayer,
	]);

	return (
		<>
			{/* -------------------- Click Effects ------------------- */}
			<WellClick />
			<PermitClick />

			{popupVals.selectedWell && popupVals.expandedCard && (
				<div /* className={classes.draggable} */>
					<ExpandableCardProvider
						expanded
						handleCloseExpandableCard={popupController.reset}
						component={<WellCardProvider />}
						title={popupVals.selectedWell.wellName}
						subTitle={popupVals.selectedWell.api}
						parent="map"
						cardTop={0}
						cardLeft={0}
						position="relative"
						zIndex={99}
						cardWidthExpanded="50vw"
						cardHeightExpanded="calc(100vh - 0px)"
						targetSourceId={popupVals.selectedWell.id}
						targetLabel="well"
					/>
				</div>
			)}
			{(popupVals.selectedShape?.shapeLabel || popupVals.selectedParcel?.shapeLabel) && popupVals.expandedCard && !hideShape && (
				<div /* className={classes.draggable} */>
					<ExpandableCardProvider
						expanded
						handleCloseExpandableCard={popupController.reset}
						component={<ShapeDetailCard type={popupVals?.selectedShape?.type || popupVals?.selectedParcel?.type} />}
						title={popupVals?.selectedShape?.shapeLabel || popupVals.selectedParcel?.shapeLabel}
						subTitle={commonSahpeSubTitle}
						parent="map"
						position="relative"
						cardTop={0}
						cardLeft={0}
						zIndex={99}
						cardWidthExpanded="50vw"
						cardHeightExpanded="calc(100vh - 64px)"
						targetSourceId={popupVals.selectedShape?.id || popupVals.selectedParcel?.id}
						targetLabel={popupVals.selectedShape?.type || "parcel"}
						deleteCustomLayer={deleteCustomLayer}
					/>
				</div>
			)}
			{popupVals.selectedPermit && popupVals.selectedPermit.hasOwnProperty('Lease') && (
				<PortalD id="popupContainer">
					{!popupVals.expandedCard && (
						<ExpandableCardProvider
							handleCloseExpandableCard={popupController.reset}
							component={<PermitCardProvider />}
							title={popupVals.selectedPermit.Lease}
							subTitle={popupVals.selectedPermit.ApiNumber}
							parent="map"
							mouseX={0}
							mouseY={0}
							position="relative"
							cardLeft={0}
							cardTop={0}
							zIndex={3000}
							cardWidth="375px"
							cardWidthExpanded="50vw"
							cardHeightExpanded="calc(100vh - 0px)"
							targetSourceId={popupVals.selectedPermit.Id}
							targetLabel="recent_submitted_permits"
						/>
					)}
				</PortalD>
			)}

			<div id="modalHolder" ref={modalContainer} />
			<Portal container={modalContainer.current} />

			<Portal container={container.current}>
				{popupVals.popupOpen === true ? (
					<div>
						{popupVals.selectedWell && (
							<PortalD id="popupContainer">
								{!popupVals.expandedCard && (
									<ExpandableCardProvider
										handleCloseExpandableCard={popupController.reset}
										component={<WellCardProvider />}
										title={popupVals.selectedWell.wellName}
										subTitle={popupVals.selectedWell.api}
										parent="map"
										mouseX={0}
										mouseY={0}
										position="relative"
										cardLeft={0}
										cardTop={0}
										zIndex={3000}
										cardWidth="350px"
										cardWidthExpanded="50vw"
										cardHeightExpanded="calc(100vh - 0px)"
										targetSourceId={popupVals.selectedWell.id}
										targetLabel="well"
									/>
								)}
							</PortalD>
						)}
						{(popupVals?.selectedUserDefinedLayer?.file) && (
							<PortalD id="popupContainer">
								<UdLayerCardProvider
									parent="map"
									handleCloseExpandableCard={popupController.reset}
									selectedUserDefinedLayer={popupVals.selectedUserDefinedLayer}
									zIndex={3000}
									cardWidth="350px"
									mouseX={0}
									mouseY={0}
									position="relative"
								/>
							</PortalD>
						)}

						{popupVals.layerSelectionPopup && (
							<PortalD id="popupContainer">
								<LayerSelectionPopup
									parent="map"
									handleCloseExpandableCard={popupController.reset}
									selectionLayers={popupVals.selectionLayers}
									zIndex={3000}
									cardWidth="450px"
									mouseX={0}
									mouseY={0}
									position="relative"
								/>
							</PortalD>
						)}
					</div>
				) : null}
			</Portal>
		</>
	);
}

export default memo(Portals);
