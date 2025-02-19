import React, { useEffect } from 'react';

import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import RoomIcon from '@material-ui/icons/Room';

import { useLazyQuery } from '@apollo/client';

import { findBoundsMap } from 'components/MapControls/commonHelper';

import { globalStateController } from 'controllers/globalStateController';
import { layerController } from 'controllers/layerStateController';
import { mapControlsController } from 'controllers/mapControlsController';

import { OWNERSLATSLONS } from 'graphQL/useQueryOwnerLatsLonsArray';

const useStyles = makeStyles(() => ({
	icons: {
		backgroundColor: 'transparent',
		marginLeft: 'auto',
		'&:hover': {
			backgroundColor: '#dadbde !important',
		},
	},
}));

const formatIt = mdata => {
	return {
		type: 'FeatureCollection',
		features: mdata
			.filter(feature => (feature.latitude && feature.longitude) || (feature.Latitude && feature.Longitude))
			.map(feature => {
				if (feature.latitude && feature.longitude) {
					return {
						type: 'Feature',
						properties: feature,
						geometry: {
							type: 'Point',
							coordinates: [feature.longitude, feature.latitude],
						},
					};
				} else {
					return {
						type: 'Feature',
						properties: feature,
						geometry: {
							type: 'Point',
							coordinates: [feature.Longitude, feature.Latitude],
						},
					};
				}
			}),
	};
};

export const useTaxOwnerWellFlyto = () => {
	const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(OWNERSLATSLONS);

	const handleFlyto = async ownerId => {
		globalStateController.updateState({ universalLoader: true });
		await getOwnerWells({
			variables: {
				ownerId,
			},
		});
	};

	useEffect(() => {
		if (dataOwnerWells && dataOwnerWells.ownerLatsLonsArray?.length) {
			if (dataOwnerWells.ownerLatsLonsArray.length > 0) {
				findBoundsMap(formatIt(dataOwnerWells.ownerLatsLonsArray)?.features, window.mapRef, {
					top: 50,
					bottom: 50,
					left: 50,
					right: 50,
				});
				mapControlsController.updateState({ mapGridCardActivated: false });
				setTimeout(() => {
					layerController.updateState({ wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray] });
					layerController.toggleLayersActivity('Search', true);
				}, 0);
			}
		}
		globalStateController.updateState({ universalLoader: false });
	}, [dataOwnerWells]);

	return { handleFlyto };
};

const WellFlyToMap = ({ id, disabled = false }) => {
	const classes = useStyles();
	const { handleFlyto } = useTaxOwnerWellFlyto();

	return (
		<Tooltip title="Fly To Map" placement="top" style={{ marginRight: '10px' }}>
			<IconButton
				id={`map-fly-to-${id}`}
				size={'medium'}
				color="secondary"
				className={`${classes.icons}`}
				disabled={disabled}
				onClick={e => {
					e.stopPropagation();
					handleFlyto(id);
				}}
				aria-label="fly"
			>
				<RoomIcon />
			</IconButton>
		</Tooltip>
	);
};

export default WellFlyToMap;
