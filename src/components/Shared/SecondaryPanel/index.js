import React, { useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import { get } from 'lodash';

import LayerStyling from 'components/MapControls/components/Layer/LayerStyling';
import NewLayerManager from 'components/MapControls/components/Layer/NewLayerManager';
import SourceLayerManager from 'components/MapControls/components/SourceLayerManager';
import TransferDataManager from 'components/MapControls/components/TransferDataManager';

import { mapControlsController } from 'stateManagement/mapControlsController';

const useStyles = makeStyles(theme => ({
	root: props => ({
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		listStyleType: 'none',
		zIndex: '1240',
		left: props.leftPixels,
		width: '525px',
		height: 'calc(100vh - 0px)',
	}),
}));

const Secondarypanel = () => {
	const { mapControlsStateValues } = mapControlsController.useState(
		['manageLayer', 'manageSourceLayer', 'manageTransferData', 'selectedLayer', 'selectedLayerControl'],
		'mapControlsStateValues'
	);

	const leftPixels = useMemo(() => {
		return get(document.getElementById('layer-side-panel'), 'style.minWidth', '0px');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [get(document.getElementById('layer-side-panel'), 'style.minWidth', '0px')]);

	const classes = useStyles({ leftPixels });
	return (
		<div className={classes.root}>
			{mapControlsStateValues.manageLayer && <NewLayerManager />}
			{mapControlsStateValues.manageSourceLayer && <SourceLayerManager />}
			{mapControlsStateValues.manageTransferData && <TransferDataManager />}
			{mapControlsStateValues.selectedLayerControl && <LayerStyling />}
		</div>
	);
};

export default Secondarypanel;
