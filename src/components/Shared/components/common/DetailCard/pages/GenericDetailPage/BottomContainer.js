import React, { useMemo, memo, useCallback, useState, useEffect } from 'react';

import { useQuery } from '@apollo/client';

import AssetAssociationToolbar from 'components/MRTTable/TablesOverride/AssetCustomEntities/Toolbars/AssetAssoication';
import DetailCardBottom from 'components/Shared/components/common/DetailCard/DetailCardBottom';
import ContactInformationIcon from 'components/Shared/svgIcons/ContactPhone';
import UnitIcon from 'components/Shared/svgIcons/unit';

import { ALL_CUSTOM_ASSET_INFO } from 'graphQL/useQueryAllCustomAssetInfo';

import { detailCardController } from 'stateManagement/detailCardController';
import { globalStateController } from 'stateManagement/globalStateController';

import DetailInfo from './DetailInfoSection';

const tableHeight = 'calc(70vh - 100px)';

const BottomContainer = () => {
	const [associatedModels, setAssoicatedModels] = useState([]);

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord']);

	const { data: associatedAssetsData } = useQuery(ALL_CUSTOM_ASSET_INFO, {
		variables: { ids: currentAsset?.associatedModels?.map(model => model._id) },
	});

	useEffect(() => {
		if (associatedAssetsData) {
			let associatedModels = associatedAssetsData?.getAllCustomAssetInfo?.res || [];
			associatedModels = associatedModels.map(model => {
				let matchedModel = currentAsset?.associatedModels?.find(associatedModel => associatedModel._id === model._id);
				return {
					...model,
					useDescriptorKey: matchedModel?.useDescriptorKey,
					associationModelName: matchedModel?.associationModelName,
				};
			});
			setAssoicatedModels(associatedModels);
		}
	}, [associatedAssetsData]);

	const transformAssociatedModels = useCallback(
		models => {
			return models?.map((model, index) => {
				const associationKey = model?.useDescriptorKey ? 'descriptorObject' : 'relatedObject';
				const mrtDataMappingKey = model?.useDescriptorKey ? 'relatedObject' : 'descriptorObject';
				return {
					index: index + 1,
					value: model.tableName,
					associatedModel: model,
					Icon: UnitIcon,
					label: `Related ${model.name}`,
					showCounts: true,
					isMRTTable: true,
					tableKey: 'DynamicAssoicationTable',
					props: {
						overrideMeta: {
							modelName: model.associationModelName,
							assetName: currentAsset?.name,
							associatedAssetName: model.name,
							maxTableHeight: tableHeight,
							CustomToolBar: AssetAssociationToolbar,
							defaultFilters: [
								{ field: associationKey, value: currentAssetRecord?._id, useDescriptorKey: model?.useDescriptorKey },
							],
							fetchDynamicSchema: {
								variables: { tableName: currentAsset?.tableName },
								name: currentAsset?.name,
								tableName: currentAsset?.tableName,
								isAssociatedModel: true,
								associatedModel: model,
								associationKey: mrtDataMappingKey,
							},
							deletedKeys: {
								mainRecord: { key: '_id' },
								assetTableName: {
									value: currentAsset.tableName,
								},
								associatedAssetName: {
									value: model.tableName,
								},
							},
						},
					},
				};
			});
		},
		[currentAsset, currentAssetRecord, tableHeight]
	);

	const assetAssociatedData = useMemo(() => {
		const associatedModelsConfig = transformAssociatedModels(associatedModels) || [];
		return [
			{
				index: 0,
				value: 'assetInformation',
				Icon: ContactInformationIcon,
				label: `${currentAsset?.name} Info`,
				showCounts: false,
				component: <DetailInfo />,
			},
			...associatedModelsConfig,
		];
	}, [currentAsset, associatedModels, transformAssociatedModels]);

	return <DetailCardBottom data={assetAssociatedData} />;
};

export default memo(BottomContainer);
