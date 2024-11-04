import React from 'react';
import UnitCard from 'components/ShapeDetailCard/Unit/UnitCard';
import ParcelCard from 'components/ParcelsDetailCard/ParcelCard';
import AgreementCard from 'components/ShapeDetailCard/Agreement/AgreementCard';
import { agreementLayers } from 'components/Shared/functions/shapeLayer';
import { popupController } from 'hookstate/popupStateController';
import { drawBoundary } from 'components/MapControls/components/DrawShapes/drawShapesHelpers';
import GenericDetailCard from 'components/Shared/components/common/DetailCard/Cards/GenericDetail';

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
