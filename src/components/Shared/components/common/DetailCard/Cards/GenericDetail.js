import React, { useContext, useState, useEffect, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useLazyQuery } from '@apollo/client';

// import RightDialog from './RightDialog';
// import AddDealDialog from 'components/Transact/components/DealDialog/AddDealDialog';
import ConfirmationDialog from 'components/ContactDetailCard/components/ConfirmationDialog';
import DetailLayout from 'components/Shared/components/common/DetailCard/DetailLayout';
// import AddActivityDialog from 'components/ContactDetailCard/components/AddActivityDialog';

import { GET_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';
import { GET_RECORD_FROM_RUN_TIME_MODEL } from 'graphQL/useQueryRunTimeModel';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';


import { AppContext } from 'AppContext';

function GenericDetailCard() {
	const [stateApp, setStateApp] = useContext(AppContext);

	const { id, tableName, paramId, type } = useParams();

	const { activeModule } = useSelector(({ common }) => common);

	const [openDialog, setOpenDialog] = useState(false);
	const [assetRecord, setAssetRecord] = useState(null);
	const [showActivityDialog, setActivityDialog] = useState(null);

	const [getAsset] = useLazyQuery(GET_CUSTOM_ASSET_INFO, {
		onCompleted: data => {
			const assetInfo = data?.getCustomAssetInfo?.asset;
			globalStateController.updateState({ currentAsset: assetInfo });
		},
	});

	const [getRecordFromAsset] = useLazyQuery(GET_RECORD_FROM_RUN_TIME_MODEL, {
		onCompleted: data => {
			const record = data?.getRecordFromRunTimeModel?.asset;
			setAssetRecord(record);
			detailCardController.updateState({ currentAssetRecord: record });
		},
	});

	useEffect(() => {
		let assetName = tableName ?? type ?? activeModule?.name;
		const assetId = id ?? paramId;

		if (assetName && assetId) {
			getAsset({
				variables: { tableName: assetName },
			});

			getRecordFromAsset({
				variables: { _id: assetId, tableName: assetName },
			});
		}
	}, [id, tableName, activeModule, paramId, type, getAsset, getRecordFromAsset]);

	useEffect(() => {
		detailCardController.updateState({ loading: true });
	}, []);

	useEffect(() => {
		setActivityDialog(!!stateApp.activitySideDialog);
	}, [stateApp.activitySideDialog]);

	useEffect(() => {
		if (!showActivityDialog) {
			setStateApp(stateApp => ({ ...stateApp, selectedActivity: null, activitySideDialog: false }));
		}
	}, [showActivityDialog, setStateApp]);

	useEffect(() => {
		return () => {
			setStateApp(stateApp => ({
				...stateApp,
				dealDialog: false,
				activeDeal: { cardId: null, laneId: null },
			}));
		};
	}, [setStateApp]);

	const detailProps = useMemo(
		() => ({
			purchaseData: [],
			openDialog: null,
		}),
		[]
	);

	return (
		<>
			<div>
				<DetailLayout loading={!assetRecord} page="GenericDetailPage" props={detailProps} />
			</div>

			{openDialog === 'deleteConfirmation' && (
				<ConfirmationDialog openDialog={openDialog} handleDialogClose={setOpenDialog} id={assetRecord?._id} />
			)}

			{/* {showActivityDialog && (
				<RightDialog open={true} handleClickDialogClose={() => setActivityDialog(false)} width="700px">
					<AddActivityDialog
						onClose={() => setActivityDialog(false)}
						id={props.id}
						contactData={assetRecord}
						selectedActivity={stateApp.selectedActivity}
					/>
				</RightDialog>
			)}
			{stateApp.dealDialog && (
				<AddDealDialog
					open={stateApp.dealDialog ? true : false}
					width="450px"
					onClose={() =>
						setStateApp(stateApp => ({
							...stateApp,
							dealDialog: false,
							activeDeal: { cardId: null, laneId: null },
						}))
					}
					contactId={assetRecord?._id}
				/>
			)} */}
		</>
	);
}

export default memo(GenericDetailCard);
