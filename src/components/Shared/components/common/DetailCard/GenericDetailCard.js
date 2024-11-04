import React, { useContext, useState, useEffect, useMemo, memo } from 'react';

import { AppContext } from 'AppContext';

import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

// import RightDialog from './RightDialog';
// import AddDealDialog from 'components/Transact/components/DealDialog/AddDealDialog';
import DetailLayout from 'components/Shared/components/common/DetailCard/DetailLayout';
// import AddActivityDialog from 'components/ContactDetailCard/components/AddActivityDialog';
import ConfirmationDialog from 'components/ContactDetailCard/components/ConfirmationDialog';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';

import { GET_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';
import { GET_RECORD_FROM_RUN_TIME_MODEL } from 'graphQL/useQueryRunTimeModel';

import NavHeader from 'components/Land/components/Common/NavHeader';
import { replaceUnderscoreAndCapitalize } from 'components/MRTTable/utils/helper';

function GenericDetailCard(props) {
	const [stateApp, setStateApp] = useContext(AppContext);

	const { id, tableName, paramId, type } = useParams();

	const [openDialog, setOpenDialog] = useState(false);
	const [assetRecord, setAssetRecord] = useState(null);
	const [controlColumn, setControlColumn] = useState({});
	const [showActivityDialog, setActivityDialog] = useState(null);

	const [getAsset] = useLazyQuery(GET_CUSTOM_ASSET_INFO, {
		onCompleted: data => {
			const assetInfo = data?.getCustomAssetInfo?.asset;
			const controlledColumn = assetInfo?.modelKeys?.find(key => !!key.isControlColumn);
			setControlColumn(controlledColumn);
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
		let assetName = tableName ?? type;
		const assetId = id ?? paramId;

		assetName = replaceUnderscoreAndCapitalize(assetName);

		if (assetName && assetId) {
			getAsset({
				variables: { tableName: assetName },
			});

			getRecordFromAsset({
				variables: { _id: assetId, tableName: assetName },
			});
		}
	}, [id, tableName, paramId, type, getAsset, getRecordFromAsset]);

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
			<NavHeader title={assetRecord?.[controlColumn?.mappingKey]}>
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
			</NavHeader>
		</>
	);
}

export default memo(GenericDetailCard);
