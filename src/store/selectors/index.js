import { createSelector } from 'reselect';

export const getShapeOwners = state => state.owner.shapeOwners;

export const getShapeOwnersSelectors = createSelector([getShapeOwners], shapeOwners => {
	return shapeOwners?.map(owner => owner.node);
});
