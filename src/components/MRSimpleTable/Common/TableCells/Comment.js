import React, { memo } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ChatIcon from '@material-ui/icons/Chat';
import { simpleTableGlobalController } from 'hookstate/simpleTableController';

function CommentCell({ value, id, targetLabel }) {
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
