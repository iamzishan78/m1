import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useMutation } from '@apollo/client';
import { set } from 'lodash';

import { UPDATECUSTOMLAYER } from 'graphQL/useMutationUpdateCustomLayer';

import { showErrorMessage, showInfoMessage, showSuccessMessage } from 'actions';
import { AppContext } from 'AppContext';

import UsersListWithIcon from './UsersListWithIcon';

function ShapeOwnerInput({ data, shapeType, shapeData, onBlur, label = '' }) {
	const dispatch = useDispatch();
	const [stateApp] = useContext(AppContext);

	const [ownerId, setOwnerId] = useState(data.owner || '');

	const [updateCustomLayer] = useMutation(UPDATECUSTOMLAYER, {
		onCompleted: ({ updateCustomLayer }) => {
			if (updateCustomLayer.success) {
				dispatch(showSuccessMessage(`${shapeType} updated successfully`));
			} else {
				dispatch(showErrorMessage('Error while updating'));
			}
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
	// change owner on card change
	useEffect(() => {
		setOwnerId(data.owner || '');
	}, [shapeData, data]);

	return (
		<UsersListWithIcon
			label={label}
			placeholder={'Assign Approver'}
			selectedUserId={ownerId}
			onChangeUser={user => {
				setOwnerId(user?.value);
				dispatch(showInfoMessage(`${shapeType} is being updated`));
				updateMeta({ ownerName: user?.text, owner: user?.value });
			}}
			onBlur={onBlur}
		/>
	);
}

export default ShapeOwnerInput;
