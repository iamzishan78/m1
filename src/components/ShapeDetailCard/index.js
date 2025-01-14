import React from 'react';

import { drawBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import ParcelCard from 'components/ParcelsDetailCard/ParcelCard';
import AgreementCard from 'components/ShapeDetailCard/Agreement/AgreementCard';
import UnitCard from 'components/ShapeDetailCard/Unit/UnitCard';
import GenericDetailCard from 'components/Shared/components/common/DetailCard/Cards/GenericDetail';
import { agreementLayers } from 'components/Shared/functions/shapeLayer';

import { popupController } from 'hookstate/popupStateController';

export default function ShapeCardProvider(props) {
	const popupState = popupController.useState(['selectedShape', 'selectedParcel']);

	const popupVals = popupState.stateValues;
	const handleCloseCard = () => {
		props.closeUnitCard();
		drawBoundary();
	};
	return (
		<>
			{popupVals?.selectedShape?.type === 'unit' && (
				<UnitCard closeCard={handleCloseCard} selectedShape={popupVals.selectedShape} />
			)}
			{popupVals.selectedParcel?.shapeLabel && <ParcelCard selectedParcel={popupVals.selectedParcel} />}
			{agreementLayers.includes(popupVals?.selectedShape?.type) && (
				<AgreementCard closeCard={handleCloseCard} selectedShape={popupVals.selectedShape} />
			)}

			{popupVals?.selectedShape?.isGenericAssetShape && <GenericDetailCard />}
		</>
	);
}
