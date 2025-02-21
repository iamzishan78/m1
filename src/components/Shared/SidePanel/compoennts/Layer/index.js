import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import RootRef from '@material-ui/core/RootRef';

import PropTypes from 'prop-types';

import LayerItem from './LayerItem';
import { deepEqualObjects } from '../../../functions';

function Layer({ layerMap, type, handleToggle }) {
	return (
		<>
			{layerMap &&
				layerMap.map((layer, index) => {
					const labelId = `checkbox-list-label-${index}`;
					if (
						type === 'heatMaps' ||
						type === 'base' ||
						(type === 'layer' && layer.layerSettings && layer.layerSettings.showable)
					) {
						return (
							<Draggable key={labelId} draggableId={labelId} index={type === 'layer' ? layer.position : index}>
								{provided => (
									<RootRef rootRef={provided.innerRef}>
										<LayerItem
											index={index}
											labelId={labelId}
											provided={provided}
											type={type}
											layer={layer}
											handleToggle={handleToggle}
										/>
									</RootRef>
								)}
							</Draggable>
						);
					}

					return null;
				})}
		</>
	);
}

Layer.propTypes = {
	layerMap: PropTypes.array,
	type: PropTypes.string.isRequired,
	handleToggle: PropTypes.func,
};

export default React.memo(Layer, deepEqualObjects);
