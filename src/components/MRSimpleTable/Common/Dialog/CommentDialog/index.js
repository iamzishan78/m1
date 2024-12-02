import React, { memo } from 'react';
import Comments from './Comment';

const CommentDialog = props => {
	return <Comments focus targetSourceId={props.targetSourceId} targetLabel={props.targetLabel} />;
};

export default memo(CommentDialog);
