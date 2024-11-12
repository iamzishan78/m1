import React, { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Grid, Dialog, Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import { arrayMoveImmutable } from 'array-move';
import { useLazyQuery, useMutation } from '@apollo/client';
import { AppContext } from 'AppContext';
import omit from 'lodash/omit';

import CloseIcon from '@material-ui/icons/Close';
import { Delete as DeleteIcon, MoreHoriz as MoreHorizIcon } from '@material-ui/icons/';
import IconButton from '@material-ui/core/IconButton';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { SortableContainer, SortableElement, sortableHandle } from 'react-sortable-hoc';

import { GET_ALL_LIBRARY_META_DATA } from 'graphQL/useQueryGetMetaData';
import { ADD_META_DATA } from 'graphQL/useMutationAddMetaData';
import { UPDATE_META_DATA } from 'graphQL/useMutationUpdateMetaData';
import { colorPallete } from 'components/Table/helpers';
import DeleteConfirmationDialogContent from 'components/Shared/M1nTable/components/SubComponents/DeleteConfirmationDialogContent';
import { tableController, tableGlobalController } from 'hookstate/tableController';
import { globalStateController } from 'hookstate/globalStateController';

const useStyles = makeStyles(theme => ({
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '15px 30px',
	},
	dialogActions: {
		display: 'flex',
		justifyContent: 'flex-end',
		'& svg': {
			fill: '#d9d9d9',
			'&:hover': {
				fill: '#b5b2b2',
			},
		},
	},
	menu: {
		'& .MuiListItem-root': {
			height: '35px',
			'& .MuiListItemIcon-root': {
				minWidth: '30px',
				'& .MuiSvgIcon-root': {
					fill: 'red !important',
				},
			},
		},
	},
	selectedType: {
		borderBottom: '4px solid #01B0F0',
		color: '#01B0F0',
		display: 'inline',
		cursor: 'pointer',
	},
	unSelectedType: {
		display: 'inline',
		color: '#827F7F',
		cursor: 'pointer',
	},
	select: {
		width: '100%',
	},
	addField: {
		color: '#929292',
		marginTop: 15,
		float: 'right',
		display: 'flex',
		cursor: 'pointer',
	},
	addIcon: {
		fontSize: '18px',
		marginTop: 1,
	},
	tabs: {
		margin: '0px 10px',
		paddingBottom: 8,
		borderBottom: '1px solid #EEF1F4',
	},
	library: {
		marginLeft: 25,
		marginTop: 20,
		'& .MuiTypography-body1': {
			fontSize: 14,
		},
	},
	fields: {
		cursor: 'pointer',
		'&:hover': {
			backgroundColor: '#F6F8F9',
		},
	},
	btnColor: {
		color: 'white',
		backgroundColor: '#4576CF',
	},
}));

const options = [
	{ value: 'dropdown', label: 'Drop-down' },
	{ value: 'multiselect', label: 'Multi-select' },
	{ value: 'text', label: 'Text' },
];

const viewOptions = [
	{
		label: 'Create new',
		value: 'new',
	},
	{
		label: 'Choose from library',
		value: 'existing',
	},
];

const categoryOptions = [
	{
		label: 'Docs',
		value: 'Docs',
	},
	{
		label: 'Contacts',
		value: 'Contacts',
	},
	{
		label: 'Flow',
		value: 'Flow',
	},
	{
		label: 'Check',
		value: 'Check',
	},
	{
		label: 'Check Details',
		value: 'Check Details',
	},
	{
		label: 'Agreement',
		value: 'Agreement',
	},
	{
		label: 'Unit',
		value: 'Unit',
	},
	{
		label: 'Tract',
		value: 'Parcel',
	},
	{
		label: 'Campaigns',
		value: 'Campaign Name',
	},
	{
		label: 'Unit Interest Owners',
		value: 'Unit Interest Owners',
	},
	{
		label: 'All (contacts, docs, flow, agreement, etc.)',
		value: 'All',
	},
];

const iconOptions = [
	{
		label: 'Chip',
		value: 'Chip',
	},
	{
		label: 'Bullet Point',
		value: 'Bullet Point',
	},
];

const MetaField = ({
	category,
	columns,
	updateColumnSorting,
	esKey,
	customDataPrefix = 'custom_data',
	customDataPostfix = '',
	tableKey,
}) => {
	const classes = useStyles();
	const [selectedTab, setSelectedTab] = useState('new');
	const [metaData, setMetaData] = useState(null);
	const [filteredMetaData, setFilteredMetaData] = useState(null);
	const [anchorEl, setAnchorEl] = useState();
	const TableController = !!tableKey && tableController(tableKey);

	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectFilter, setSelectFilter] = useState(categoryOptions[categoryOptions.length - 1].value);
	const [filter, setFilter] = useState('');
	const [showAddDescription, setShowAddDescription] = useState(false);
	const { control, setValue, getValues, watch } = useForm();
	const [stateApp, setStateApp] = useContext(AppContext);
	const type = watch('type', stateApp.selectedMeta ? stateApp.selectedMeta.type : 'dropdown');
	const title = watch('title', stateApp.selectedMeta ? stateApp.selectedMeta.title : '');
	const isAddedToLibrary = watch(
		'isAddedToLibrary',
		stateApp.selectedMeta ? stateApp.selectedMeta.isAddedToLibrary : false
	);

	const [items, setItems] = useState([{ palleteId: colorPallete[0].id }]);

	useEffect(() => {
		if (stateApp.selectedMeta) {
			setTimeout(() => {
				setValue('isAddedToLibrary', stateApp.selectedMeta.isAddedToLibrary);
				setValue('type', stateApp.selectedMeta.type);
				setValue('title', stateApp.selectedMeta.label);
				setValue('iconType', stateApp.selectedMeta.iconType || iconOptions[0].value);
				setItems(stateApp.selectedMeta.dropdownOptions);
			}, 100);
		}
	}, [stateApp.selectedMeta, setValue]);

	const [addMetaData] = useMutation(ADD_META_DATA);
	const [updateMetaData] = useMutation(UPDATE_META_DATA, {
		refetchQueries: ['getMetaData'],
		awaitRefetchQueries: true,
	});

	const [getAllLibraryMetaData, { data: metaDataRes }] = useLazyQuery(GET_ALL_LIBRARY_META_DATA);

	useEffect(() => {
		getAllLibraryMetaData();
	}, [getAllLibraryMetaData]);

	useEffect(() => {
		if (metaDataRes?.getAllLibraryMetaData?.metaData) {
			let data = metaDataRes.getAllLibraryMetaData.metaData;
			for (let i = 0; i < columns.length; i++) {
				data = data.filter(d => d.name !== columns[i].name);
			}
			setMetaData(data);
			setFilteredMetaData(data);
		}
	}, [metaDataRes, columns]);

	useEffect(() => {
		if (metaData?.length > 0) {
			let data = metaData;
			if (selectFilter !== 'All') {
				data = metaData.filter(d => d.category === selectFilter);
			}
			if (filter) {
				data = data.filter(d => d.label.toLowerCase().includes(filter.toLowerCase()));
			}
			setFilteredMetaData(data);
		}
	}, [filter, selectFilter, metaData]);

	const handleSave = () => {
		const values = getValues();
		if (stateApp.selectedMeta) {
			updateMetaData({
				variables: {
					metaData: {
						_id: stateApp.selectedMeta._id,
						label: values.title,
						iconType: values.iconType,
						dropdownOptions: items,
						isAddedToLibrary: values.isAddedToLibrary,
					},
				},
			});
		} else {
			const name = values.title.replace(/ /g, '_').toLowerCase();
			addMetaData({
				variables: {
					metaData: {
						name: name,
						label: values.title,
						iconType: values.iconType,
						esKey: esKey
							? esKey
							: values.type === 'dropdown'
								? `${customDataPrefix}.${name}${customDataPostfix}`
								: `${customDataPrefix}.${values.title.replace(/ /g, '_').toLowerCase()}${customDataPostfix}`,
						options: {
							display: false,
							filter: true,
							searchable: false,
							sort: true,
							download: false,
							print: false,
							viewColumns: true,
						},
						type: values.type,
						category: values.category,
						user: stateApp.user.mongoId,
						dropdownOptions: type !== 'text' ? items : [],
						isAddedToLibrary: values.isAddedToLibrary,
						isCustom: true,
					},
				},
				refetchQueries: ['getMetaData'],
				awaitRefetchQueries: true,
			});
			rippleEffectCall({ name });
		}
		handleClose();
	};

	useEffect(() => {
		return () => {
			if (!!tableKey) tableGlobalController.reInitialized();
		};
	}, [tableKey]);

	const handleClose = () => {
		setItems([]);
		setStateApp(stateApp => ({
			...stateApp,
			showFieldModal: false,
			selectedMeta: null,
		}));

		// Using for metaa fields other then grid
		globalStateController?.updateState?.({
			showFieldModal: false,
		});
		TableController?.updateState?.({
			showFieldModal: false,
		});
	};

	const handleDeleteMetaData = () => {
		updateMetaData({
			variables: {
				metaData: {
					_id: stateApp.selectedMeta._id,
					isDeleted: true,
				},
			},
		}).then(res => {
			handleClose();
		});
	};

	const handleMenuClick = event => setAnchorEl(event.currentTarget);
	const handleDeleteDialog = () => {
		setAnchorEl(null);
		setDeleteDialogOpen(true);
	};

	const rippleEffectCall = data => {
		if (updateColumnSorting) {
			const columnData = JSON.parse(JSON.stringify(columns));
			columnData.push({ name: data.name, options: { display: true } });
			updateColumnSorting(
				columnData.map(col => ({
					name: col.name,
					display: col.options.display ? 'true' : 'false',
				}))
			);
		}
	};

	const onSelectLibraryItem = data => {
		if (data.category !== category) {
			const meta = omit(data, ['_id', 'lastUpdateAt', 'createAt', '_ts', '__v']);
			addMetaData({
				variables: {
					metaData: {
						...meta,
						category: category,
						user: stateApp.user.mongoId,
						isAddedToLibrary: false,
						isCustom: true,
					},
				},
				refetchQueries: ['getMetaData'],
				awaitRefetchQueries: true,
			});
		}
		rippleEffectCall(data);
	};

	const isDisabled = type === 'text' ? !title : !title || items.filter(item => !!item.value).length === 0;

	return (
		<>
			<Dialog
				fullWidth
				maxWidth="md"
				open={true}
				onClose={() => {
					globalStateController.updateState({
						showFieldModal: false,
					});
					setStateApp(stateApp => ({
						...stateApp,
						selectedMeta: null,
						showFieldModal: false,
					}));
				}}
			>
				<div>
					<div className={classes.header}>
						<Grid container justify="space-between" direction="row" display="flex">
							<Grid item>{stateApp.selectedMeta ? <h3>Edit Field</h3> : <h3>Add Field</h3>}</Grid>
							<Grid item xs={6} className={classes.dialogActions}>
								{stateApp.selectedMeta && (
									<IconButton
										size="small"
										component="span"
										onClick={handleMenuClick}
										style={{
											background: 'transparent',
											paddingLeft: '10px',
											align: 'center',
										}}
									>
										<MoreHorizIcon size="medium" />
									</IconButton>
								)}

								<IconButton onClick={handleClose}>
									<CloseIcon />
								</IconButton>
								<Menu
									id="dealMenu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={() => setAnchorEl(null)}
									className={classes.menu}
									getContentAnchorEl={null}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
									transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								>
									<MenuItem onClick={() => handleDeleteDialog()}>
										<ListItemIcon>
											<DeleteIcon size="medium" />
										</ListItemIcon>
										<ListItemText>Delete</ListItemText>
									</MenuItem>
								</Menu>
							</Grid>
						</Grid>
					</div>
					<div className={classes.tabs}>
						{!stateApp.selectedMeta && (
							<>
								{viewOptions.map(option => {
									return (
										<span
											style={{ marginLeft: 13, padding: 5 }}
											onClick={() => setSelectedTab(option.value)}
											className={selectedTab === option.value ? classes.selectedType : classes.unSelectedType}
										>
											{option.label}
										</span>
									);
								})}
							</>
						)}
					</div>
					{selectedTab === 'new' ? (
						<div>
							<div>
								<div style={{ padding: 35 }}>
									<Grid container spacing={0}>
										<Grid container item xs={7} style={{ paddingRight: 20 }} alignItems="center">
											<label style={{ margin: '5px 0px' }}>Field Name</label>
											<Controller
												control={control}
												name="title"
												render={props => (
													<TextField
														size="small"
														type="text"
														variant="outlined"
														value={props.value}
														inputRef={props.ref}
														onWheel={e => e.target.blur()}
														onChange={e => {
															props.onChange(e.target.value);
														}}
														placeholder="e.g. Priority, Stage, Status"
														fullWidth
														defaultValue=""
														disabled={stateApp.selectedMeta}
													/>
												)}
											/>
										</Grid>
										<Grid container item xs={5} alignItems="center">
											<label style={{ margin: '5px 0px' }}>Field Type</label>
											<Controller
												control={control}
												name="type"
												defaultValue={options[0].value}
												render={props => (
													<Select
														styles={{
															menu: provided => ({ ...provided, zIndex: 9999 }),
														}}
														value={options.find(op => op.value === props.value)}
														menuPlacement="auto"
														onChange={e => {
															props.onChange(e.value);
														}}
														options={options}
														className={classes.select}
														isDisabled={stateApp.selectedMeta}
													/>
												)}
											/>
										</Grid>
										<Grid container item xs={7} style={{ paddingRight: 20 }}>
											{!showAddDescription ? (
												<div
													className={classes.addField}
													onClick={() => {
														setShowAddDescription(true);
													}}
												>
													<AddIcon className={classes.addIcon} /> <span className={classes.f13}>Add Description</span>
												</div>
											) : (
												<Controller
													control={control}
													name="description"
													render={props => (
														<TextField
															style={{ paddingTop: 20 }}
															size="small"
															type="text"
															variant="outlined"
															value={props.value}
															inputRef={props.ref}
															onWheel={e => e.target.blur()}
															onChange={e => {
																props.onChange(e.target.value);
															}}
															placeholder="Description"
															fullWidth
															defaultValue=""
															multiline
															rows={5}
															rowsMax={5}
														/>
													)}
												/>
											)}
										</Grid>
										<Grid container item xs={5}>
											<label style={{ margin: '15px 0px 5px 0px' }}>Icon Type</label>
											<Controller
												control={control}
												name="iconType"
												defaultValue={iconOptions[0].value}
												render={params => (
													<Select
														styles={{
															menu: provided => ({ ...provided, zIndex: 9999 }),
														}}
														value={iconOptions.find(op => op.value === params.value)}
														menuPlacement="auto"
														options={iconOptions}
														className={classes.select}
														onChange={e => {
															params.onChange(e.value);
														}}
													/>
												)}
											/>
											<div style={{ width: '100%', marginTop: 5 }}>
												<label>Module</label>
												<Controller
													control={control}
													name="category"
													defaultValue={
														category
															? categoryOptions.find(op => op.value === category)?.value
															: categoryOptions[0].value
													}
													render={params => (
														<Select
															styles={{
																menu: provided => ({ ...provided, zIndex: 9999 }),
															}}
															value={categoryOptions.find(op => op.value === params.value)}
															menuPlacement="auto"
															options={categoryOptions}
															className={classes.select}
															isDisabled={stateApp.selectedMeta}
														/>
													)}
												/>
											</div>
										</Grid>
									</Grid>
								</div>
								{(type === 'dropdown' || type === 'multiselect') && (
									<div style={{ padding: '0px 35px' }}>
										<SortableComponent setItems={setItems} items={items} />
									</div>
								)}
								<Controller
									control={control}
									name="isAddedToLibrary"
									render={props => (
										<FormControlLabel
											className={classes.library}
											style={{ fontSize: 14 }}
											control={
												<Checkbox
													checked={isAddedToLibrary}
													onChange={e => props.onChange(e.target.checked)}
													color="primary"
												/>
											}
											label="Add to field library"
										/>
									)}
								/>
								<div
									style={{
										borderTop: '1px solid #EEF1F4',
									}}
								>
									<div style={{ float: 'right' }}>
										<Button style={{ margin: '25px 5px 25px 0px' }} variant="outlined" onClick={handleClose}>
											Cancel
										</Button>
										<Button
											className={isDisabled ? '' : classes.btnColor}
											style={{ margin: '25px 25px 25px 5px' }}
											variant="outlined"
											onClick={handleSave}
											disabled={isDisabled}
										>
											{stateApp.selectedMeta ? 'Update Field' : 'Create Field'}
										</Button>
									</div>
								</div>
							</div>
						</div>
					) : (
						<>
							<div style={{ padding: '20px 40px' }}>
								<div style={{ width: '80%', height: '300px' }}>
									<Select
										styles={{
											menu: provided => ({ ...provided, zIndex: 9999 }),
										}}
										value={categoryOptions.find(op => op.value === selectFilter)}
										menuPlacement="auto"
										onChange={e => {
											setSelectFilter(e.value);
										}}
										options={categoryOptions}
										className={classes.select}
										isDisabled={stateApp.selectedMeta}
									/>
									<TextField
										style={{ marginTop: 15 }}
										size="small"
										type="text"
										variant="outlined"
										value={filter}
										onWheel={e => e.target.blur()}
										onChange={e => {
											setFilter(e.target.value);
										}}
										placeholder="Search for an existing field"
										fullWidth
										defaultValue=""
									/>
								</div>
							</div>
							<div style={{ maxHeight: '300px', overflow: 'auto' }}>
								<Grid
									container
									spacing={0}
									style={{
										backgroundColor: '#F6F8F9',
										color: '#B1B6BC',
										fontSize: 13,
										padding: '5px 0px',
									}}
								>
									<Grid container item xs={10} style={{ paddingLeft: '50px' }}>
										Available fields
									</Grid>
									<Grid container item xs={2} style={{ paddingRight: '50px' }}>
										<div style={{ width: '100%', textAlign: 'end' }}>Type</div>
									</Grid>
								</Grid>
								<div style={{ marginBottom: '10px' }}>
									{filteredMetaData?.map(data => {
										return data.isAddedToLibrary ? (
											<div
												className={classes.fields}
												onClick={() => {
													onSelectLibraryItem(data);
												}}
											>
												<div style={{ padding: '0px 50px' }}>
													<Grid
														container
														spacing={0}
														style={{
															padding: '10px 0px',
															borderBottom: '1px solid #F4F5F6',
														}}
													>
														<Grid container item xs={10}>
															<div>{data.label}</div>
															{data.type === 'dropdown' && (
																<div style={{ width: '100%', color: '#B4B9BF' }}>
																	{data.dropdownOptions?.map((option, index) => {
																		return (
																			<span>
																				{option.value}
																				{index < options.length - 1 ? ', ' : ''}
																			</span>
																		);
																	})}
																</div>
															)}
														</Grid>
														<Grid container item xs={2}>
															<div
																style={{
																	width: '100%',
																	textAlign: 'end',
																	fontWeight: 'bold',
																}}
															>
																{data.category}
															</div>
														</Grid>
													</Grid>
												</div>
											</div>
										) : (
											<></>
										);
									})}
								</div>
							</div>
						</>
					)}
				</div>
			</Dialog>
			{deleteDialogOpen && (
				<Dialog
					className={classes.dialog}
					open={deleteDialogOpen ? true : false}
					onClose={() => setDeleteDialogOpen(false)}
					fullWidth={false}
					maxWidth="sm"
				>
					<DeleteConfirmationDialogContent
						header={'Delete Metadata Field'}
						onClose={() => setDeleteDialogOpen(false)}
						deleteFunc={() => handleDeleteMetaData()}
						m1nSelectedRowsIds={null}
						setM1nSelectedRowsIndexes={() => {}}
					>
						<p>This will permanently delete the selected metadata field and remove it from the application.</p>
						<p> Note: This action cannot be undone.</p>
					</DeleteConfirmationDialogContent>
				</Dialog>
			)}
		</>
	);
};

const useSortableStyles = makeStyles(theme => ({
	itemContainer: {
		width: '100%',
		display: 'flex',
		padding: '10px 0px',
		justifyContent: 'space-between',
		borderBottom: '1px solid #EEF1F4',
		'& .MuiInputBase-input': {
			padding: '0 !important',
			fontSize: '15px',
		},
	},
}));

const SortableComponent = ({ setItems, items }) => {
	const onSortEnd = ({ oldIndex, newIndex }) => {
		setItems(arrayMoveImmutable(items, oldIndex, newIndex));
	};

	return (
		<>
			<SortableList setItems={setItems} items={items} onSortEnd={onSortEnd} useDragHandle />
			<div
				style={{
					color: '#929292',
					marginTop: 15,
					marginLeft: 25,
					display: 'flex',
					cursor: 'pointer',
				}}
				onClick={() => {
					const newItems = JSON.parse(JSON.stringify(items));
					newItems.push({ palleteId: colorPallete[0].id });
					setItems(newItems);
				}}
			>
				<AddIcon
					style={{
						fontSize: '18px',
						marginTop: 1,
					}}
				/>{' '}
				<span style={{ fontSize: 13 }}>Add an option</span>
			</div>
		</>
	);
};

const SortableList = SortableContainer(({ items, setItems }) => {
	const removeIndex = index => {
		const newItems = JSON.parse(JSON.stringify(items));
		newItems.splice(index, 1);
		setItems(newItems);
	};

	const updateIndex = (index, data) => {
		const newItems = JSON.parse(JSON.stringify(items));
		newItems[index] = data;
		setItems(newItems);
	};

	return (
		<List style={{ margin: 0, padding: 0 }} component="div">
			{items?.map((item, index) => (
				<SortableItem
					key={`item-${item.value}`}
					index={index}
					item={item}
					removeIndex={removeIndex}
					updateIndex={updateIndex}
					itemIndex={index}
				/>
			))}
		</List>
	);
});

const DragHandle = sortableHandle(({ display }) => (
	<DragIndicatorIcon style={{ fontSize: 18, visibility: display ? 'visible' : 'hidden' }} />
));

const SortableItem = SortableElement(({ item, removeIndex, itemIndex, updateIndex }) => {
	const classes = useSortableStyles();
	const [anchorEl, setAnchorEl] = useState(null);
	const [showDrag, setShowDrag] = useState(false);
	const [itemValue, setItemValue] = useState(item.value);

	const handleClick = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<ListItem
				ContainerComponent="div"
				style={{ zIndex: 1300, padding: 0 }}
				onMouseOver={() => setShowDrag(true)}
				onMouseLeave={() => setShowDrag(false)}
			>
				<DragHandle display={showDrag} />
				<div className={classes.itemContainer}>
					<div style={{ width: '100%' }}>
						<div
							style={{
								marginTop: 4,
								marginLeft: 10,
								marginRight: 10,
								width: 15,
								height: 15,
								backgroundColor: colorPallete.find(pallete => pallete.id === item.palleteId).color,
								display: 'inline-block',
								borderRadius: 10,
							}}
							onClick={handleClick}
						></div>

						<Menu
							id="simple-menu"
							anchorEl={anchorEl}
							keepMounted
							open={Boolean(anchorEl)}
							onClose={handleClose}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'center',
							}}
							transformOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
						>
							<div style={{ width: '220px', padding: '0px 10px' }}>
								{colorPallete?.map(pallet => {
									return (
										<div
											style={{ display: 'inline-block' }}
											onClick={() => {
												handleClose();
												updateIndex(itemIndex, {
													...item,
													palleteId: pallet.id,
												});
											}}
										>
											<div
												style={{
													marginTop: 4,
													marginLeft: 5,
													marginRight: 5,
													width: 15,
													height: 15,
													backgroundColor: pallet.color,
													display: 'inline-block',
												}}
											>
												{item.color === pallet.color && <CheckIcon style={{ fontSize: 13 }} />}
											</div>
										</div>
									);
								})}
							</div>
						</Menu>
						<TextField
							type="text"
							variant="standard"
							placeholder="Enter option"
							style={{ width: '95%', marginTop: 3 }}
							value={itemValue}
							onChange={e => {
								setItemValue(e.target.value);
							}}
							onBlur={() => updateIndex(itemIndex, { ...item, value: itemValue })}
							InputProps={{
								disableUnderline: true,
							}}
						/>
					</div>
					<IconButton style={{ padding: '4px' }} onClick={() => removeIndex(itemIndex)}>
						<CloseIcon style={{ fontSize: 16, alignSelf: 'center' }} />
					</IconButton>
				</div>
			</ListItem>
		</>
	);
});

export default MetaField;
