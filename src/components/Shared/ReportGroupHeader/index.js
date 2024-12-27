import React, { useState, useContext, useEffect, useCallback } from 'react';

import { Grid, Button, Select, MenuItem, TextField, Dialog, FormControl, InputLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useLazyQuery, useMutation } from '@apollo/client';

// actions
import ButtonDropDown from 'components/Shared/M1nTable/components/ButtonGroup';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';

import { ADD_GRID_VIEW } from 'graphQL/useMutationAddGridView';
import { UPDATE_GRID_VIEW } from 'graphQL/useMutationUpdateGridView';
import { GET_GRID_VIEWS } from 'graphQL/useQueryGetGridViews';

import { AppContext } from 'AppContext';

import { copy } from '../functions';

const useStyles = makeStyles(theme => ({
	actionBar: ({ isBackground, noPadding }) => ({
		padding: noPadding ? 0 : '10px 40px',
		display: 'flex',
		alignItems: 'center',
		backgroundColor: isBackground ? '#f7f7f7' : 'transparent',
		width: '100%',
		minHeight: '65px',

		'& .MuiSelect-select:focus, & .MuiOutlinedInput-root': {
			backgroundColor: '#ffff',
		},
		'& .MuiButtonGroup-groupedContainedSecondary:not(:last-child)': {
			borderColor: '#ffff',
		},
	}),
	textField: {
		height: '100%',
		width: '100%',
		'& .MuiFormHelperText-contained': {
			justifyContent: 'flex-end',
			display: 'flex',
		},
	},
	viewSwitcher: ({ isShrink }) => ({
		// margin: theme.spacing(1),
		height: isShrink ? '40px' : '100%',
	}),
}));

export default function ReportGroupHeader({
	type,
	esFilters,
	setESFilters,
	setFilterToggle,
	isBackground = true,
	fullWidth = false,
	isShrink = false,
	noUpdate,
	noPadding = false,
	strechedWidth = false,
}) {
	const classes = useStyles({ isBackground, isShrink, noPadding });
	const [stateApp] = useContext(AppContext);

	const [getGridViews, { data: gridViews }] = useLazyQuery(GET_GRID_VIEWS);
	const [addGridView] = useMutation(ADD_GRID_VIEW);
	const [updateGridView] = useMutation(UPDATE_GRID_VIEW);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [config, setConfig] = useState({});

	const All_TYPE = `All ${type}`;
	const [reportingGroup, setReportingGroup] = React.useState(All_TYPE);

	useEffect(() => {
		getGridViews({
			variables: {
				module: type,
				userId: stateApp.user.mongoId,
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleAddUpdateDelete = useCallback(
		updatedConfig => {
			const actionType = config.type || updatedConfig.type;
			if (['update', 'delete'].includes(actionType)) {
				const gridViewId = gridViews?.getGridViews?.gridViews.find(view => view.name === reportingGroup)._id;
				const name = config.name || updatedConfig.name;
				const isDeleted = actionType === 'update' ? false : true;
				updateGridView({
					variables: {
						gridView: {
							_id: gridViewId,
							name,
							isDeleted,
							filters: esFilters,
						},
					},
					refetchQueries: ['getGridViews'],
					awaitRefetchQueries: true,
				}).then(resp => {
					if (resp.data.updateGridView.success) {
						if (actionType === 'update') {
							setReportingGroup(name);
						} else {
							setReportingGroup(All_TYPE);
							setESFilters(
								esFilters.filter(
									filter => !['state.keyword', 'county.keyword', 'internalCompany.keyword'].includes(filter.field)
								)
							);
							setFilterToggle(value => !value);
						}
					}
					setConfig({ show: false });
				});
			} else if (config.type === 'new') {
				addGridView({
					variables: {
						gridView: {
							name: config.name,
							module: type,
							type: 'Custom',
							isPrivate: false,
							user: stateApp.user.mongoId,
							filters: esFilters,
							// columns: columns.map((col) => ({ name: col.name, display: col.options.display })),
						},
					},
					refetchQueries: ['getGridViews'],
					awaitRefetchQueries: true,
				}).then(resp => {
					if (resp.data.addGridView.success) {
						setReportingGroup(config.name);
					}
					setConfig({ show: false });
				});
			}
			return config;
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[esFilters, gridViews, config, reportingGroup]
	);

	const ButtonActions = React.useMemo(() => {
		return [
			{
				isShow: false,
				text: 'Update Group',
				action: () => {
					handleAddUpdateDelete({ type: 'update', name: reportingGroup });
				},
			},
			{
				isShow: true,
				text: 'Save as New Report Group',
				action: () =>
					setConfig({
						show: true,
						type: 'new',
						name: reportingGroup + ' - Copy',
					}),
			},
			{
				isShow: true,
				text: 'Edit Report Group Name',
				action: () => setConfig({ show: true, type: 'update', name: reportingGroup }),
			},
			{
				isShow: true,
				text: 'Delete Report Group',
				action: () => setDeleteDialogOpen(true),
			},
		];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reportingGroup, handleAddUpdateDelete]);

	return (
		<>
			<Grid container direction="row" display="flex" justify="space-between" className={classes.actionBar}>
				<Grid item xs={strechedWidth ? true : fullWidth ? 7 : 3} md={strechedWidth ? true : fullWidth ? 7 : 3}>
					{config.show ? (
						<TextField
							fullWidth={true}
							className={classes.textField}
							variant="outlined"
							id="reddit-input"
							value={config.name}
							autoFocus
							required
							helperText={'Return to save'}
							InputProps={{
								className: classes.textFieldInput,
								disableUnderline: true,
							}}
							onClick={e => e.stopPropagation()}
							InputLabelProps={{ className: classes.textFieldLabel }}
							onChange={e => setConfig({ ...config, name: e.target.value })}
							onKeyDown={e => {
								if (e.keyCode === 13) {
									e.preventDefault();
									handleAddUpdateDelete();
								}
							}}
							onBlur={() => setConfig({ show: false })}
						/>
					) : (
						<FormControl variant="outlined" fullWidth className={classes.formControl}>
							<InputLabel id="select-outlined-label">Reporting Groups</InputLabel>
							<Select
								labelId="select-outlined-label"
								id="select-outlined"
								label="Reporting Group"
								value={reportingGroup}
								fullWidth
								className={classes.viewSwitcher}
								onChange={e => {
									setReportingGroup(e.target.value);
									const gridView = gridViews?.getGridViews?.gridViews.find(view => view.name === e.target.value);
									if (gridView) {
										setESFilters(copy(gridView.filters));
										setFilterToggle(value => !value);
										// selectGridView(gridView)
									} else {
										setESFilters([]);
										setFilterToggle(value => !value);
									}
								}}
							>
								{!gridViews?.getGridViews?.gridViews.find(gridView => gridView?.name === All_TYPE) && (
									<MenuItem value={All_TYPE}>{All_TYPE}</MenuItem>
								)}
								{gridViews?.getGridViews?.gridViews.map(view => (
									<MenuItem value={view.name}>{view.name}</MenuItem>
								))}
							</Select>
						</FormControl>
					)}
				</Grid>

				{esFilters.length > 0 && !noUpdate && (
					<Grid item xs={5} md={5}>
						<Grid container display="flex" justify="flex-end" direction="row" spacing={2}>
							<Grid item>
								{reportingGroup === All_TYPE ? (
									<Button
										variant="contained"
										color="secondary"
										onClick={() =>
											setConfig({
												show: true,
												type: 'new',
												name: reportingGroup + ' - Copy',
											})
										}
									>
										Save as New Group
									</Button>
								) : (
									<ButtonDropDown variant="contained" color="secondary" options={ButtonActions} />
								)}
							</Grid>
						</Grid>
					</Grid>
				)}
			</Grid>

			{deleteDialogOpen && (
				<Dialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={setDeleteDialogOpen}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialogContent
						header={'Delete Report Group'}
						onClose={setDeleteDialogOpen}
						deleteFunc={() => handleAddUpdateDelete({ type: 'delete', name: reportingGroup })}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						Do you want to delete this report group?
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
		</>
	);
}
