import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

import {
	Typography,
	Button,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	FormControl,
	TextField,
	Tabs,
	Tab,
	Dialog,
	CircularProgress,
} from '@material-ui/core';
import { InfoOutlined as InfoOutlinedIcon, MoreHoriz as MoreHorizIcon, Delete as DeleteIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/styles';

import { useMutation, useLazyQuery } from '@apollo/client';
import { debounce, get } from 'lodash';
import PropTypes from 'prop-types';
import { isEmpty } from 'underscore';

import CampaignHeader from 'components/Contacts/components/campaign/CampaignHeaderSection';
import CampaignRelatedGrids from 'components/Contacts/components/campaign/CampaignRelatedGrids';
import NavHeader from 'components/Land/components/Common/NavHeader';
import DeleteConfirmationDialog from 'components/MRTTable/Common/Dialog/ConfirmationDialog/DeleteConfirmationDialog';
import MetadataDrawer from 'components/Revenue/components/Common/MetadataDrawer';
import DocViewer from 'components/Shared/DocViewer';
import Tags from 'components/Shared/Tagger';

import { UPDATE_CAMPAIGN } from 'graphQL/useMutationCampaign';
import { GET_CAMPAIGN } from 'graphQL/useQueryCampaign';

import { globalStateController } from 'hookstate/globalStateController';
import { tableController, tableGlobalController } from 'hookstate/tableController';

import { showInfoMessage } from 'actions';

import { useStyles } from './styles';

const StyledTabs = withStyles({
	root: {
		textTransform: 'capitalize',
	},
	indicator: {
		backgroundColor: '#12abe0',
		height: '5px',
	},
})(Tabs);

const THEME_SPACING = 4;

const StyledTab = withStyles(theme => ({
	root: {
		textTransform: 'uppercase',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(THEME_SPACING),
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
		'&:hover': {
			color: 'black',
			opacity: 1,
		},
		'&$selected': {
			color: 'black',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&:focus': {
			color: 'black',
		},
	},
	selected: {},
}))(props => <Tab disableRipple {...props} />);

const CampaignDetail = ({ viewDoc }) => {
	const { stateValues } = globalStateController.useState(['testCase']);
	let { campaignId } = useParams();
	if (stateValues?.testCase?.campaignId) {
		campaignId = stateValues?.testCase?.campaignId;
	}
	const history = useHistory();
	const dispatch = useDispatch();
	const [metaCollapse, setMetaCollapse] = useState(true);
	const [anchorEl, setAnchorEl] = useState();
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [isButtonScroll, setButtonScroll] = useState(false);
	const [tab, setTab] = useState(0);
	const selectedTabRef = useRef(null);
	const campaign = useRef(null);

	const [upsertCampaign] = useMutation(UPDATE_CAMPAIGN);

	const { control, watch, reset } = useForm();
	const inputRef = useRef(null);

	const campaignName = watch('name', '');
	const classes = useStyles({ name: campaignName, metaCollapse });

	const [getCampaign, { data: campaignData, loading, refetch: refetchCampaign }] = useLazyQuery(GET_CAMPAIGN);

	const globalState = tableGlobalController.useState(['refetch']);
	const globalStateValues = globalState.stateValues;

	const campaignContactTableState = tableController('CampaignContactTable').useState(['isCampaignRefetch']);
	const campaignContactTableStateValues = campaignContactTableState.stateValues;

	const CampaignUnitTable = tableController('CampaignUnitTable').useState(['isCampaignRefetch']);
	const CampaignUnitTableValues = CampaignUnitTable.stateValues;

	// const campaign = useMemo(() => get(campaignData, "getCampaign", {}), [campaignData]);

	useEffect(() => {
		if (campaignId) {
			getCampaign({
				variables: {
					campaignId,
				},
			});
		}
	}, [campaignId, getCampaign]);

	useEffect(() => {
		if (campaignContactTableStateValues.isCampaignRefetch || CampaignUnitTableValues.isCampaignRefetch) {
			refetchCampaign();
		}
	}, [globalStateValues?.refetch]);

	useEffect(() => {
		const camp = get(campaignData, 'getCampaign', {});
		if (camp) {
			campaign.current = camp;
			reset(camp);
		}
	}, [campaignData, reset]);

	useEffect(() => {
		if (selectedTabRef?.current && isButtonScroll) {
			selectedTabRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'start',
			});
		}
	}, [tab, isButtonScroll]);

	useEffect(() => {
		return () => {
			if (!campaignName && isEmpty(campaign.current)) {
				dispatch(showInfoMessage('Campaign Name is required'));
				history.goBack();
			}
		};
	}, []);

	const updateCampaignInformation = (key, value) => {
		const _id = campaignId !== 'new' ? campaign.current?._id : null;
		const updateCampaign = {
			_id,
			[key]: value,
		};
		if (key === 'name') {
			updateCampaign.oldCampaignName = campaign.current.name;
		}
		upsertCampaign({
			variables: {
				campaign: updateCampaign,
			},
			refetchQueries: ['getCampaign'],
		}).then(({ data }) => {
			if (campaignId === 'new' && get(data, 'upsertCampaign.success')) {
				history.push(`/contacts/campaign/details/${get(data, 'upsertCampaign.campaign._id')}`);
			} else if (get(data, 'upsertCampaign.campaign.isDeleted')) {
				history.push('/contacts/campaigns');
			}
		});
	};

	const getRelativePosition = childDivId => {
		const parentPos = document.getElementById('parent-div').getBoundingClientRect();
		const childPos = document.getElementById(childDivId).getBoundingClientRect();
		const relativePos = {};

		relativePos.top = childPos.top - parentPos.top;
		relativePos.right = childPos.right - parentPos.right;
		relativePos.bottom = childPos.bottom - parentPos.bottom;
		relativePos.left = childPos.left - parentPos.left;
		return relativePos.top;
	};

	const handleEndScroll = useMemo(() => debounce(() => setButtonScroll(false), 1000), []);

	const handleScroll = () => {
		if (!isButtonScroll) {
			let activeTab = 0;
			const HEADER_DIV = 5;
			const DETAIL_DIV = 30;

			if (getRelativePosition('header-div') < HEADER_DIV) {
				activeTab = 0;
			}
			if (getRelativePosition('detail-div') < DETAIL_DIV) {
				activeTab = 1;
			}

			if (tab !== activeTab) {
				setTab(activeTab);
			}
		}
		handleEndScroll();
	};

	if (!campaignData && loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<CircularProgress
					style={{
						color: '#12ABE0',
					}}
					size={80}
					disableShrink
				/>
			</div>
		);
	}

	return (
		<NavHeader title={campaignName}>
			{/**
			 * Detail title section
			 */}
			<div className={`${classes.detailHeader} flex justifyBetween alignStart w-100`}>
				<div className="flex column alignStart justifyStart w-100" style={{ padding: '0px 20px' }}>
					<div className={classes.title}>
						<div className={classes.titleText}>
							<div className={classes.userName}>
								<Controller
									control={control}
									name="name"
									render={params => (
										<FormControl variant="outlined" className={classes.inputFieldDealName} fullWidth size="small">
											<TextField
												{...params}
												margin="dense"
												variant="outlined"
												placeholder="Click to enter campaign name"
												required
												multiline
												inputRef={inputRef}
												error={!campaignName}
												helperText={!campaignName ? 'Enter campaign name to get started' : ''}
												// onChange={({ target }) => setTitle(target.value)}
												InputProps={{
													classes: {
														root: classes.dealNameRoot,
														focused: classes.focused,
														notchedOutline: classes.notchedOutline,
													},
												}}
												onFocus={() => {
													// Set focus on the input element when the TextField is clicked
													inputRef.current && inputRef.current.focus();
												}}
												onKeyDown={e => {
													if (e.key === 'Enter') {
														e.preventDefault();
														inputRef.current.blur();
													}
												}}
												onBlur={({ target }) => updateCampaignInformation('name', target.value.trim())}
												data-testid="campaign-name-text-field"
											/>
										</FormControl>
									)}
								/>
							</div>
							<div className={classes.tagsContainer}>
								<div className={classes.highlighter}>
									<Typography className={classes.highlight} variant="highlight">
										Campaign
									</Typography>
								</div>
								<div className={classes.tags}>
									<Tags
										width="100%"
										targetSourceId={`${get(campaign, 'current._id')}`}
										targetLabel="campaign"
										publicLeftBottom
										onlyTags
									/>
								</div>
							</div>
						</div>
					</div>

					<div className={classes.actionsContainer}>
						<div className={classes.tabsHeader}>
							<StyledTabs
								value={tab}
								onChange={(event, tab) => {
									setButtonScroll(true);
									setTab(tab);
								}}
								aria-label="ant example"
							>
								<StyledTab label="Header" />
								<StyledTab label="Campaign Details" />
							</StyledTabs>
						</div>
						<div className={classes.metaActions}>
							<Button
								startIcon={<InfoOutlinedIcon />}
								className={classes.metaButton}
								onClick={() => setMetaCollapse(!metaCollapse)}
							>
								Metadata
							</Button>
							<IconButton
								size="small"
								component="span"
								className={classes.menuIcon}
								onClick={event => setAnchorEl(event.currentTarget)}
							>
								<MoreHorizIcon size="medium" />
							</IconButton>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justifyBetween alignStart w-100">
				<div className={classes.tabsDetailContainer}>
					{/**
					 * Detail tabs section
					 */}

					{!viewDoc ? (
						<div
							className={classes.tabsSection}
							// style={{ display: stateApp.viewDoc ? "none" : "" }}
						>
							<div id="parent-div" className={classes.tabsSectionDetails} onScroll={handleScroll}>
								<div id="header-div" className={classes.tabDetailSection} ref={tab === 0 ? selectedTabRef : null}>
									<CampaignHeader campaign={campaign.current} updateCampaignInformation={updateCampaignInformation} />
								</div>
								<div id="detail-div" className={classes.tabDetailSection} ref={tab === 1 ? selectedTabRef : null}>
									<CampaignRelatedGrids campaign={campaign.current} />
								</div>
							</div>
						</div>
					) : (
						<DocViewer divCondition={true} DocStyle={{ height: 'calc(100vh - 270px)' }} />
					)}
				</div>

				{!metaCollapse && (
					<div
						style={{
							marginTop: 5,
							marginRight: 3,
							height: 'calc(100vh - 270px)',
							width: 620,
						}}
					>
						<MetadataDrawer
							setCollapse={setMetaCollapse}
							targetSourceId={campaign.current._id}
							data={campaign.current}
							targetLabel="Campaign"
							descriptionKey="description"
							onUpdate={data => updateCampaignInformation('description', data.description)}
							isOwner={false}
							isSource={false}
							showCommentType
						/>
					</div>
				)}
			</div>

			{/**
			 * Menu for meta data
			 */}
			<Menu
				id="revPropertyMenu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
				className={classes.menu}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				transformOrigin={{ vertical: 'top', horizontal: 'center' }}
			>
				<MenuItem onClick={() => setOpenDeleteDialog(true)}>
					<ListItemIcon>
						<DeleteIcon size="medium" />
					</ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
			<Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} fullWidth={true} maxWidth={'sm'}>
				<DeleteConfirmationDialog
					header={'Delete Campaign'}
					onClose={() => setOpenDeleteDialog(false)}
					deleteFunc={() => updateCampaignInformation('isDeleted', true)}
				>
					{'Do you want to delete this campaign?'}
				</DeleteConfirmationDialog>
			</Dialog>
		</NavHeader>
	);
};

CampaignDetail.propTypes = { viewDoc: PropTypes.func };

export default CampaignDetail;
