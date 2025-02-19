import React, { useMemo, useState } from 'react';

import { Box } from '@mui/material';

import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';
import MRTTable from 'components/MRTTable';
import useTabedTablesUnmount from 'components/MRTTable/Hooks/useTabedTablesUnmount';

import { tableGlobalController } from 'controllers/tableController';

import DatasetsAutoCompleteFilter from './DatasetsAutoCompleteFilter';

const ShapeFile = () => {
	const [dataset, setDataset] = useState(null);

	const {
		stateValues: { tabKey },
	} = tableGlobalController.useState(['tabKey']);

	useTabedTablesUnmount();

	const subFiles = useMemo(() => {
		if (!dataset) {
			return null;
		}

		tableGlobalController.setSelectedTab(0);

		const ds = {
			_id: dataset._id,
			fileName: dataset.fileName,
			file: dataset.file,
		};

		if (!Array.isArray(dataset.categories)) {
			return [ds];
		}

		return dataset.categories.map(category => ({
			...ds,
			layerGeometry: category.layerGeometry,
			layerIdentifier: category.layerIdentifier,
		}));
	}, [dataset]);

	const shapeFileTableOverride = useMemo(() => {
		const fileLayer = subFiles?.[tabKey];

		if (fileLayer) {
			const fileQuery = generateFileFilters({ fileLayer });

			tableGlobalController.reInitialized();

			return {
				filterLayerType: fileLayer.layerIdentifier,
				defaultFilters: fileQuery.variables.filters,
				advanceSearch: fileQuery.variables.search.advanceSearch,
				...(subFiles.length > 1 && { tabLabels: subFiles.map(f => f.layerIdentifier) }),
			};
		}

		return {};
	}, [subFiles, tabKey]);

	return (
		<Box
			sx={{
				marginTop: '4rem',
			}}
		>
			<Box>
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-evenly',
					}}
				>
					<DatasetsAutoCompleteFilter sx={{ width: '35%' }} value={dataset} setValue={setDataset} />
				</Box>
			</Box>

			<Box
				sx={{
					margin: '1rem',
				}}
			>
				{dataset && (
					<MRTTable
						name={'ShapesFilesGenericTable'}
						overrideMeta={{
							maxTableHeight: 'calc(100vh - 350px)',
							...shapeFileTableOverride,
						}}
					/>
				)}
			</Box>
		</Box>
	);
};

export default ShapeFile;
