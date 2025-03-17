import React, { memo } from 'react';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import { MyLocation } from '@material-ui/icons';

import { useMutation } from '@apollo/client';

import { TOGGLETRACK } from 'graphQL/useMutationToggleCreateRemoveTrack';

import { globalStateController } from 'stateManagement/globalStateController';
import { tableGlobalController } from 'stateManagement/tableController';

function IsTracked({ id, targetLabel, isTracked }) {
	const [toggleCreateRemoveTrack] = useMutation(TOGGLETRACK, {
		onCompleted: () => {
			tableGlobalController.refetchAdditionalQueries();
		},
	});

	return (
		<Tooltip title={isTracked ? 'Tracked' : 'Not Tracked'} placement="top">
			<Button
				id={id}
				size="small"
				startIcon={<MyLocation color={isTracked ? 'secondary' : 'primary'} />}
				onClick={e => {
					e.stopPropagation();

					const user = globalStateController.getValue('user');

					toggleCreateRemoveTrack({
						variables: {
							track: {
								user: user.mongoId,
								objectType: targetLabel,
								trackOn: id,
							},
						},
					});
				}}
			></Button>
		</Tooltip>
	);
}

export default memo(IsTracked);
