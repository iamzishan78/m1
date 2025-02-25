import { CREATE_JOB } from 'graphQL/useMutationCreateJob';
import { INITIALIZE_EXPORT_JOB } from 'graphQL/useMutationinitializeExportJob';

import { jobController } from 'stateManagement/jobStateController';

const random_rgb = () => {
	var o = Math.round,
		r = Math.random,
		s = 255;
	return 'rgb(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ')';
};

export const getDefaultSettings = (type, layerName, bbox) => {
	const idColor = random_rgb();
	let paintProps = {};
	if (type === 'Point' || type === 'MultiPoint') {
		type = 'circle';
	} else if (type === 'LineString' || type === 'Feature' || type === 'MultiLineString') {
		type = 'line';
	} else {
		type = 'fill';
	}

	if (type === 'circle') {
		paintProps = {
			'circle-radius': 5,
			'circle-color': idColor,
			'circle-stroke-width': 2,
			'circle-stroke-color': '#fff',
		};
	} else if (type === 'line') {
		paintProps = {
			'line-color': idColor,
			'line-opacity': 1,
			'line-width': 1,
		};
	} else {
		paintProps = {
			'fill-color': idColor,
			'fill-opacity': 0.4,
			'fill-outline-color': '#1C1C1C',
		};
	}

	let layerPaintProps = [
		{
			id: layerName,
			paintType: type,
			paintProps: paintProps,
		},
	];

	const layerSettings = {
		interaction: {
			interactionAble: true,
			interactionDetail: {
				hover: true,
				click: true,
			},
		},
		colorable: true,
		showable: true,
		visiable: true,
	};
	return { layerPaintProps, layerSettings, bbox };
};

export const SimpleOrShapeFileImport = async params => {
	const { user, client, fileId } = params;
	// const isShapeFileImport = stateApp?.user?.features?.find(f => f.name === 'ShapeFileImport')
	// if (isShapeFileImport) {
	const jobInitialization = await client.mutate({
		mutation: INITIALIZE_EXPORT_JOB,
		variables: {
			jobName: 'Shape File Import',
			jobType: 'SHAPEFILEIMPORT',
			requestPayload: {
				fileId,
			},
			userId: user.mongoId,
		},
	});

	await client.mutate({
		mutation: CREATE_JOB,
		variables: {
			jobId: jobInitialization?.data?.initializeExportJob?.job?._id,
			sendEmail: true,
		},
	});
	jobController.toggleBulkUpload();
};
