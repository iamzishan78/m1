import React, { useState, memo } from 'react';

import { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import MetadataDrawer from 'components/Revenue/components/Common/MetadataDrawer';
import * as Pages from 'components/Shared/components/common/DetailCard/pages';

import { detailCardController } from 'hookstate/detailCardController';
import { globalStateController } from 'hookstate/globalStateController';
import { popupController } from 'hookstate/popupStateController';

import useStyles from './useStyles';

const MainGridRightContainer = () => {
	const classes = useStyles();

	const {
		stateValues: { expandedCard },
	} = popupController.useState(['expandedCard']);

	const {
		globalStateValues: { currentAsset },
	} = globalStateController.useState(['currentAsset'], 'globalStateValues');

	const {
		stateValues: { page, currentAssetRecord, shrinkRightColumn },
	} = detailCardController.useState(['page', 'currentAssetRecord', 'shrinkRightColumn']);

	const { useUpdate } = Pages[page];
	const { callApi } = useUpdate();

	const handleExpandClick = type => {
		detailCardController.updateProps({
			openDialog: type,
		});
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const handleClick = event => setAnchorEl(event.currentTarget);
	const handleClose = () => setAnchorEl(null);

	if (shrinkRightColumn) {
		return null;
	}

	return (
		<>
			<MetadataDrawer
				height="95%"
				commentsHeight="auto"
				title="Additional Details"
				documentsTitle="Recent Documents"
				setCollapse={() => detailCardController.togglePullout()}
				targetSourceId={currentAssetRecord?._id}
				showDescription={false}
				targetLabel={currentAsset?.name}
				ownerTitle={`${currentAsset?.name} Owner`}
				commentsWidth="23vw"
				pageLink={`/land/customAsset/${currentAsset?.tableName}/details/${currentAssetRecord?._id}/documents`}
				viewAllDocuments={!expandedCard}
				menuComponent={
					<IconButton className={classes.menuIcon} onClick={handleClick}>
						<MoreHorizIcon id="MoreHorizIcon" fontSize="medium" aria-controls="simple-menu" aria-haspopup="true" />
					</IconButton>
				}
				data={currentAssetRecord}
				onUpdate={({ owner }) => {
					callApi({ key: 'owner', value: owner });
				}}
				activityLog={currentAssetRecord?.activityLog || {}}
				isSource={false}
			/>

			<Menu
				id="simple-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<MenuItem
					className={classes.userMenuItem}
					onClick={() => {
						handleClose();
						handleExpandClick('deleteConfirmation');
					}}
				>
					{`Delete ${currentAsset?.name}`}
				</MenuItem>
			</Menu>
		</>
	);
};

export default memo(MainGridRightContainer);
