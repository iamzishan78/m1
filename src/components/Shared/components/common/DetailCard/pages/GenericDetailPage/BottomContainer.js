import React, { useMemo, memo, useCallback } from 'react';

import AssetAssociationToolbar from 'components/MRTTable/TablesOverride/AssetCustomEntities/Toolbars/AssetAssoication';
import DetailCardBottom from 'components/Shared/components/common/DetailCard/DetailCardBottom';
import ContactInformationIcon from 'components/Shared/svgIcons/ContactPhone';
import UnitIcon from 'components/Shared/svgIcons/unit';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';

import DetailInfo from './DetailInfoSection';

const BottomContainer = () => {
	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { currentAssetRecord },
	} = detailCardController.useState(['currentAssetRecord']);

	const tableHeight = 'calc(70vh - 200px)';

	const transformAssociatedModels = useCallback(
		models => {
			return models?.map((model, index) => {
				const associationKey = model?.useDescriptorKey ? 'descriptorObject' : 'relatedObject';
				const mrtDataMappingKey = model?.useDescriptorKey ? 'relatedObject' : 'descriptorObject';
				return {
					index: index + 1,
					value: model.modelName,
					associatedModel: model,
					Icon: UnitIcon,
					label: `Related ${model.modelName}`,
					showCounts: true,
					isMRTTable: true,
					tableKey: 'DynamicAssoicationTable',
					props: {
						overrideMeta: {
							esIndex: model.associationflatModel,
							assetName: currentAsset?.tableName,
							associatedAssetName: model.modelName,
							maxTableHeight: tableHeight,
							CustomToolBar: AssetAssociationToolbar,
							defaultFilters: [{ field: `${associationKey}._id.keyword`, value: currentAssetRecord?._id }],
							fetchDynamicSchema: {
								variables: { tableName: currentAsset?.tableName },
								tableName: currentAsset?.tableName,
								isAssociatedModel: true,
								associatedModel: model.modelName,
								associationKey: mrtDataMappingKey,
							},
						},
					},
				};
			});
		},
		[currentAsset, currentAssetRecord, tableHeight]
	);

	const assetAssociatedData = useMemo(() => {
		const associatedModels = transformAssociatedModels(currentAsset?.associatedModels) || [];
		return [
			{
				index: 0,
				value: 'assetInformation',
				Icon: ContactInformationIcon,
				label: `${currentAsset?.tableName} Info`,
				showCounts: false,
				component: <DetailInfo />,
			},
			...associatedModels,
		];
	}, [currentAsset, transformAssociatedModels]);

	return <DetailCardBottom data={assetAssociatedData} />;
};

export default memo(BottomContainer);
