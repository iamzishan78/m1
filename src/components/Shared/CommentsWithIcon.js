import React, { useEffect, useContext, useState } from 'react';

import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import ChatIcon from '@material-ui/icons/Chat';

import { useLazyQuery } from '@apollo/client';

import Comments from './Comments';
import { AppContext } from '../../AppContext';
import { COMMENTSCOUNTER } from '../../graphQL/useQueryCommentsCounter';

export default function CommentsWithIcon(props) {
	const [stateApp] = useContext(AppContext);
	const [commentsCounter, setCommentsCounter] = useState(0);
	const [openDialog, setOpenDialog] = useState(false);

	const useStyles = makeStyles(theme => ({
		root: {
			zIndex: 9999999,
		},
		icons: {
			color: '#ffffff',
			marginLeft: 'auto',
			'&:hover': {
				backgroundColor: props.targetLabel === 'deal' ? '#dadbde88 !important' : '#031d40',
			},
			'& .MuiIconButton-label': {
				'& .MuiSvgIcon-root': {
					fill: ({ commentsCounter }) =>
						commentsCounter && commentsCounter > 0 ? 'rgba(1, 17, 51, 1) !important' : 'darkgrey !important',
				},
			},
		},
		iconSelected: {
			color: theme.palette.secondary.main,
			'& svg': {
				fill: `${theme.palette.secondary.main} !important`,
			},
		},
		tagsDiv: {
			margin: '8px',
		},
		dialog: {
			'&.MuiDialog-root': {
				zIndex: '9999999999 !important',
			},
		},
	}));
	const classes = useStyles({ commentsCounter });

	const [getCommentsCounter, { data: dataCommentsCounter }] = useLazyQuery(COMMENTSCOUNTER);

	useEffect(() => {
		if (stateApp.user && stateApp.user.mongoId && props.objectId) {
			getCommentsCounter({
				variables: {
					objectsIdsArray: [props.objectId],
					userId: stateApp.user.mongoId,
				},
			});
		}
	}, [stateApp.user, props.objectId]);

	useEffect(() => {
		if (dataCommentsCounter && dataCommentsCounter.commentsCounter) {
			if (dataCommentsCounter.commentsCounter.length > 0) {
				setCommentsCounter(dataCommentsCounter.commentsCounter[0].total);
			} else {
				setCommentsCounter(0);
			}
		}
	}, [dataCommentsCounter]);

	return (
		<React.Fragment>
			<Tooltip title={!commentsCounter || commentsCounter === 0 ? 'Add Comments' : 'Comments'} placement="top">
				<Badge badgeContent={commentsCounter} color="secondary">
					<IconButton
						id="commentIcon"
						size={props.iconZiseSmall ? 'small' : 'medium'}
						color="primary"
						className={`${classes.icons} ${openDialog ? classes.iconSelected : ''}`}
						onClick={() => {
							setOpenDialog(true);
						}}
						aria-label="show tags"
					>
						<ChatIcon />
					</IconButton>
				</Badge>
			</Tooltip>
			{openDialog && (
				<Dialog
					className={classes.dialog}
					open={openDialog}
					onClose={() => {
						setOpenDialog(false);
					}}
					size="sm"
					fullWidth
				>
					<Comments focus targetSourceId={props.objectId} targetLabel={props.targetLabel} />
				</Dialog>
			)}
		</React.Fragment>
	);
}
