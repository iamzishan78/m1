import React, { useState, memo } from 'react';
import { Breadcrumbs, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useMutation } from '@apollo/client';
import { tableController } from 'hookstate/tableController';
import { UPDATE_GRID_VIEW } from 'graphQL/useMutationUpdateGridView';
import { CircularProgress } from '@material-ui/core';

function GridViewComponent({ Icon, buttonRef, label, tableKey, fetchGridViews }) {
	const [updateGridView, { data }] = useMutation(UPDATE_GRID_VIEW, {
		onCompleted: () => {
			fetchGridViews()
		},
	});
	const [showIcon, setShowIcon] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const Controller = tableController(tableKey);
	const tableState = Controller.useState([
		'filters',
		'columnVisibility',
		'gridView',
		'sorting',
		'groupedField',
		'columnPinning',
		'columnOrdering',
		'isNotBreadcrumbView'
	]);
	const tableStateValues = tableState.stateValues;
	const selectedGridView = tableStateValues?.gridView?.selectedGridView;
	const isNotBreadcrumbView = tableStateValues?.isNotBreadcrumbView || false; // MetaData for the table use for show and hide Breadcrumb in the toolbar

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleUpdateClick = async () => {
		try {
			setIsLoading(true);

			await updateGridView({
				variables: {
					gridView: {
						_id: selectedGridView?._id,
						filters: tableStateValues?.filters,
						columns: Object.entries(tableStateValues?.columnVisibility).map(([name, display]) => ({
							name,
							display,
						})),
						sorting: tableStateValues?.sorting,
						columnPinning: tableStateValues?.columnPinning,
						groupedField: tableStateValues?.groupedField || [],
						columnOrdering: tableStateValues?.columnOrdering || [],
					},
				},
				refetchQueries: ['getGridViews'],
				awaitRefetchQueries: true,
			});

			setIsLoading(false);
			handleClose();
		} catch (error) {
			console.log('Error updating view:', error);
			setIsLoading(false);
		}
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left' }}>
			<IconButton
				ref={buttonRef}
				onClick={() =>
					Controller.updateState({
						gridView: { ...tableStateValues.gridView, showViewModal: !tableStateValues.gridView?.showViewModal },
					})
				}
			>
				<Icon />
			</IconButton>

			{isNotBreadcrumbView ? (
				<Typography
					style={{
						marginLeft: '10px',
						fontSize: '16px',
					}}
					color="inherit"
				>
					{label}
				</Typography>
			) :
			(<Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
				<Typography
					style={{
						marginLeft: '10px',
						fontSize: '16px',
					}}
					color="inherit"
				>
					{label}
				</Typography>
				<div>
					<div
						style={{
							display: 'flex',
							color: '#18AADD',
							fontSize: '16px',
							cursor: 'pointer',
						}}
						onClick={event => handleClick(event)}
						onFocus={() => setShowIcon(true)}
						onMouseOver={() => setShowIcon(true)}
						onMouseLeave={() => setShowIcon(false)}
					>
						<Typography>
							<span style={selectedGridView?.isModified ? { 'font-style': 'italic' } : {}}>
								{selectedGridView?.name}
							</span>
						</Typography>
						<span
							style={{
								height: '0px',
								color: '#18AADD',
								fontSize: '16px',
								cursor: 'pointer',
							}}
						>
							{showIcon && <ExpandMoreIcon />}
						</span>
						<span>{isLoading && <CircularProgress size={24} />}</span>
					</div>
					<Menu
						style={{ zIndex: '1305' }}
						id="menu"
						anchorEl={anchorEl}
						keepMounted
						open={Boolean(anchorEl)}
						onClose={handleClose}
						getContentAnchorEl={null}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
					>
						<MenuItem
							style={{ width: '250px' }}
							onClick={handleUpdateClick}
							disabled={selectedGridView?.type === 'Default' || selectedGridView?.name === 'All Contacts'}
						>
							Update view
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleClose();
								Controller.updateState({
									gridView: { ...tableStateValues.gridView, showViewModal: true, showSaveAsNew: true },
								});
							}}
						>
							Save as new view
						</MenuItem>
					</Menu>
				</div>
			</Breadcrumbs>
			)}
		</div>
	);
}

export default memo(GridViewComponent);
