import React, { memo } from 'react';

import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';

import { tableGlobalController } from 'controllers/tableController';

const useStyles = makeStyles(() => ({
	tagsDiv: {
		margin: '8px',
	},
	TagSample: {
		backgroundColor: '#efefef',
		color: 'rgb(1,17,51)',
		borderRadius: '4px',
		width: '100%',
		maxWidth: '180px',
		minWidth: '120px',
		'&:hover': {
			backgroundColor: '#dadbde !important',
			cursor: 'pointer',
		},
		'& p': {
			marginTop: props => (props.dense ? '5px' : '13px'),
			marginBottom: props => (props.dense ? '5px' : '13px'),
		},
		'& .first': {
			marginLeft: props => (props.dense ? '5px' : '13px'),
			height: '20px',
			overflow: 'hidden',
			wordBreak: 'break-all',
		},
		'& .two': {
			marginRight: props => (props.dense ? '5px' : '13px'),
		},
		'& .three': {
			marginLeft: props => (props.dense ? '5px' : '13px'),
			marginRight: props => (props.dense ? '5px' : '13px'),
			color: 'darkgrey',
		},
	},
}));

function TagCell({ id, targetSourceId, tags, targetLabel, tableKey }) {
	const classes = useStyles();
	return (
		<div style={{ marginRight: '10px' }}>
			<Tooltip title={tags?.length === 0 ? 'Add Tags' : 'Tags'} placement="top">
				<Badge
					id={id + targetSourceId}
					className={classes.TagSample}
					badgeContent={tags?.length}
					color="secondary"
					onClick={e => {
						e.preventDefault();
						e.stopPropagation();
						tableGlobalController.updateState({
							dialog: {
								type: 'tags',
								targetSourceId,
								targetLabel,
								tableKey,
							},
						});
					}}
				>
					{tags?.length > 0 ? (
						<>
							<p className="first">{tags.map(cell => cell?.tag || cell).join(', ')}</p>
							{tags?.length > 1 && <p className="two">...</p>}
						</>
					) : (
						<p className="three">No Tags</p>
					)}
				</Badge>
			</Tooltip>
		</div>
	);
}

export default memo(TagCell);
