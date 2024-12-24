import { makeStyles } from '@material-ui/core/styles';
import React, { memo } from 'react';

import Tags from './Tag';

const useStyles = makeStyles(() => ({
	tagsDiv: {
		margin: '8px',
	},
}));

const TagDialog = props => {
	const classes = useStyles();

	return (
		<div className={classes.tagsDiv}>
			<Tags targetSourceId={props?.targetSourceId} targetLabel={props?.targetLabel} refetch={props.refetch} />
		</div>
	);
};

export default memo(TagDialog);
