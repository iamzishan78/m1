import { Box } from '@mui/material';
import MRTTable from 'components/MRTTable';
import React, { useMemo, useState } from 'react';
import DatasetsAutoCompleteFilter from './DatasetsAutoCompleteFilter';
import { generateFileFilters } from 'components/Map/DeckGL/helpers/common';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';
import { tableGlobalController } from 'hookstate/tableController';

const ShapeFile = () => {
	const [dataset, setDataset] = useState(null);

	const {
		stateValues: { tabKey },
	} = simpleTableGlobalController.useState(['tabKey']);

	const subFiles = useMemo(() => {
		if (!dataset) return null;

		const ds = {
			_id: dataset._id,
			fileName: dataset.fileName,
			file: dataset.file,
			originalFile: dataset.originalFile,
		};

		if (!Array.isArray(dataset.categories)) {
			return [ds];
		}

		return dataset.categories.map(category => ({
			...ds,
			layerGeometry: category.layerGeometry,
			layerShapeName: category.layerShapeName,
		}));
	}, [dataset]);

	const shapeFileTableOverride = useMemo(() => {
		const fileLayer = subFiles?.[tabKey];

		if (fileLayer) {
			const fileQuery = generateFileFilters({ fileLayer });

			tableGlobalController.reInitialized();

			return {
				filterLayerType: fileLayer.layerShapeName,
				defaultFilters: fileQuery.variables.filters,
				advanceSearch: fileQuery.variables.search.advanceSearch,
				...(subFiles.length > 1 && { tabLabels: subFiles.map(f => f.layerShapeName) }),
			};
		}

		return {};
	}, [subFiles, tabKey]);

	return (
		<Box
			sx={{
				marginTop: '1rem',
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
