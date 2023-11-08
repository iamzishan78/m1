import React, { memo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ChatIcon from '@material-ui/icons/Chat';
import {
	simpleTableController,
	simpleTableGlobalController,
} from 'hookstate/simpleTableController';

function CommentCell({ value, id, targetLabel, tableKey }) {
	const Controller = simpleTableController(tableKey);
	const { stateValues } = Controller.useState(['commentsCounter']);

	value = stateValues.commentsCounter?.find(counter => counter._id === id)?.total || value;

	return (
		<Tooltip
			title={!value || value === 0 ? 'Add Comments' : 'View Comments'}
			placement="top"
		>
			<Button
				id={id}
				size="small"
				startIcon={<ChatIcon />}
				onClick={e => {
					e.stopPropagation();
					simpleTableGlobalController.updateState({
						dialog: {
							type: 'comments',
							value,
							targetSourceId: id,
							targetLabel,
						},
					});
				}}
				aria-label="show comments"
			>
				{value}
			</Button>
		</Tooltip>
	);
}

export default memo(CommentCell);
