import React, { useContext } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import RootRef from '@material-ui/core/RootRef';

import { AppContext } from 'AppContext';

import LayerItem from './LayerItem';
import { deepEqualObjects } from '../../../functions';


function Layer({ layerMap, type, handleToggle }) {
	const [stateApp, setStateApp] = useContext(AppContext);
	return (
		<>
			{layerMap &&
				layerMap.map((layer, index) => {
					const labelId = `checkbox-list-label-${index}`;
					if (
						type === 'heatMaps' ||
						type === 'base' ||
						(type === 'layer' &&
							layer.layerSettings &&
							layer.layerSettings.showable)
					) {
						return (
							<Draggable key={labelId} draggableId={labelId} index={type === 'layer' ? layer.position : index}>
								{(provided) => (
									<RootRef rootRef={provided.innerRef}>
										<LayerItem
											index={index}
											labelId={labelId}
											provided={provided}
											type={type}
											layer={layer}
											handleToggle={handleToggle}
											stateApp={stateApp}
											setStateApp={setStateApp}
										/>
									</RootRef>
								)}
							</Draggable>
						);
					}
				})}
		</>
	);
}

export default React.memo(Layer, deepEqualObjects);
