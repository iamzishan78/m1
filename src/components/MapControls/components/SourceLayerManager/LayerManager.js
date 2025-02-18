import React, { useEffect } from 'react';

import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

import { layerController } from 'hookstate/layerStateController';

import CategorySection from './CategorySection';

const useStyles = makeStyles(() => ({
	contentRoot: {
		padding: '15px',
		height: 'calc(100% - 111px)',
		position: 'absolute',
		overflow: 'overlay',
	},
}));

export default function LayerManager({ search }) {
	const classes = useStyles();

	useEffect(() => {
		if (layerController.getValue('projectedLayers').length === 0) {
			layerController.getProjectedLayers();
		}
	}, []);

	return (
		<div style={{ height: '100%', display: 'flex', width: '100%' }}>
			<div>
				<div className={classes.contentRoot}>
					<Typography
						varient="h5"
						style={{ textAlign: 'start', paddingBottom: '20px', fontWeight: 'bolder', fontFamily: 'sans-serif' }}
						onClick={e => e.stopPropagation()}
					>
						Add Layers to Map View
					</Typography>

					<Typography
						varient="h6"
						style={{ textAlign: 'start', marginBottom: '10px' }}
						onClick={e => e.stopPropagation()}
					>
						Select one or more of the available layers below to add them to your current map view
					</Typography>

					<div onClick={e => e.stopPropagation()}>
						<CategorySection search={search} title="M1neral Platform Layers" layerCategory="M1 Layer" />

						<CategorySection search={search} title="Client Specific Layers" layerCategory="UD layer" />
					</div>
				</div>
			</div>
		</div>
	);
}

LayerManager.propTypes = {
	search: PropTypes.string,
};
