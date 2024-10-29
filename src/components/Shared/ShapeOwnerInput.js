import React, { useContext, useState } from 'react';
import UsersListWithIcon from './UsersListWithIcon';
import { useDispatch } from 'react-redux';
import { showErrorMessage, showInfoMessage, showSuccessMessage } from 'actions';
import { useMutation } from '@apollo/client';
import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';
import { set } from 'lodash';
import { AppContext } from 'AppContext';

function ShapeOwnerInput({ data, shapeType, shapeData }) {
	const dispatch = useDispatch();
	const [stateApp] = useContext(AppContext);

	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER, {
		onCompleted: ({ updateCustomLayer }) => {
			if (updateCustomLayer.success) dispatch(showSuccessMessage(`${shapeType} updated successfully`));
			else dispatch(showErrorMessage('Error while updating'));
		},
	});

	const updateMeta = data => {
		const shape = shapeData.shape;

		Object.keys(data).forEach(field => set(shape, `properties.${field}`, data[field]));

		const customLayer = {};
		customLayer.shape = JSON.stringify(shape);
		customLayer.shapeJson = shape;

		updateCustomLayer({
			variables: {
				customLayerId: shapeData._id,
				customLayer,
				userId: stateApp.user.mongoId,
			},
			refetchQueries: ['customLayer', 'getAllLayerSettingsByUser', 'getMetaData'],
			awaitRefetchQueries: true,
		});
	};

	const [ownerId, setOwnerId] = useState(data.owner || '');
	return (
		<UsersListWithIcon
			label={'Owner'}
			placeholder={'Assign Approver'}
			selectedUserId={ownerId}
			onChangeUser={user => {
				setOwnerId(user?.value);
				dispatch(showInfoMessage(`${shapeType} is being updated`));
				updateMeta({ ownerName: user?.text, owner: user?.value });
			}}
		/>
	);
}

export default ShapeOwnerInput;
