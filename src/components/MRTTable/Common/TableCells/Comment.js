import React, { memo } from 'react';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import ChatIcon from '@material-ui/icons/Chat';

import { tableGlobalController } from 'hookstate/tableController';

function CommentCell({ rowNumber, value, id, targetLabel, hideShareCommentsToggle, tableKey }) {
	return (
		<Tooltip title={!value || value === 0 ? 'Add Comments' : 'View Comments'} placement="top">
			<Button
				id={id}
				size="small"
				startIcon={<ChatIcon />}
				onClick={e => {
					e.stopPropagation();
					tableGlobalController.updateState({
						dialog: {
							type: 'comments',
							value,
							targetSourceId: id,
							targetLabel,
							hideShareCommentsToggle,
							tableKey,
						},
					});
				}}
				data-testid={`comment-icon-button-${rowNumber}`}
				aria-label="show comments"
			>
				{value}
			</Button>
		</Tooltip>
	);
}

export default memo(CommentCell);
