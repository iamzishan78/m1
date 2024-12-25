import { useMutation } from '@apollo/client';
import { Breadcrumbs, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import React, { useState, memo } from 'react';

import { UPSERT_MAP_VIEW } from 'graphQL/useMutationUpsertMapView';

import { globalStateController } from 'hookstate/globalStateController';

function MapViewComponent({ Icon, label, fetchMapViews, defaultView }) {
	const [updateMapView] = useMutation(UPSERT_MAP_VIEW, {
		onCompleted: () => {
			// fetchMapViews();
		},
	});
	const [showIcon, setShowIcon] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const mapViewState = globalStateController.useState(['mapView']);
	const mapViewStateValues = mapViewState.stateValues;
	const selectedMapView = mapViewStateValues?.mapView?.selectedMapView;

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleUpdateClick = async () => {
		try {
			setIsLoading(true);

			const { _id, filters } = globalStateController.getValue('mapView')?.selectedMapView || {};
			await updateMapView({
				variables: {
					mapView: {
						_id, // ID for updating existing data
						filters,
						userId: globalStateController.getValue('user').mongoId,
					},
				},
				awaitRefetchQueries: true,
			});

			setIsLoading(false);
			handleClose();
		} catch (error) {
			setIsLoading(false);
		}
	};

	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', backgroundColor: '#0E111A' }}>
			<IconButton
				style={{
					color: 'white',
				}}
				onClick={() =>
					globalStateController.updateState({
						mapView: { ...mapViewStateValues.mapView, showViewModal: !mapViewStateValues.mapView?.showViewModal },
					})
				}
			>
				<Icon />
			</IconButton>

			<Breadcrumbs
				separator={
					<NavigateNextIcon
						fontSize="small"
						style={{
							color: 'white',
						}}
					/>
				}
				aria-label="breadcrumb"
			>
				<Typography
					style={{
						marginLeft: '10px',
						fontSize: '16px',
						color: 'white',
					}}
				>
					{label}
				</Typography>
				<div>
					<div
						style={{
							display: 'flex',
							color: 'white',
							fontSize: '16px',
							cursor: 'pointer',
						}}
						onClick={event => handleClick(event)}
						onFocus={() => setShowIcon(true)}
						onMouseOver={() => setShowIcon(true)}
						onMouseLeave={() => setShowIcon(false)}
					>
						<Typography>
							<span style={selectedMapView?.isModified ? { 'font-style': 'italic' } : {}}>
								{selectedMapView?.name || defaultView?.name}
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
							disabled={(selectedMapView?.type || defaultView?.type) === 'Default'}
						>
							Update view
						</MenuItem>
						<MenuItem
							onClick={() => {
								handleClose();
								globalStateController.updateState({
									mapView: {
										...mapViewStateValues.mapView,
										selectedMapView: { ...mapViewStateValues.mapView.selectedMapView, type: 'Custom' },
										showViewModal: true,
										showSaveAsNew: true,
									},
								});
							}}
						>
							Save as new view
						</MenuItem>
					</Menu>
				</div>
			</Breadcrumbs>
		</div>
	);
}

export default memo(MapViewComponent);
