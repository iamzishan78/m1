import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import DescriptionIcon from '@material-ui/icons/DescriptionSharp';
import GridOnIcon from '@material-ui/icons/GridOn';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import IdentityIcon from '@material-ui/icons/PermIdentity';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import PanoramaIcon from '@material-ui/icons/Panorama';
import { get } from 'lodash';
import Tooltip from '@material-ui/core/Tooltip';
import Badge from '@material-ui/core/Badge';
import { AppContext } from '../../../AppContext';

const useStyles = makeStyles(theme => ({
	root: {
		height: 'calc(100vh - 143px)',
		padding: '10px',
		position: 'absolute',
		right: 0,
		top: props => props.top,
		zIndex: 1223,
		backgroundColor: 'rgb(240,245,248)',
	},
	icon: {
		cursor: 'pointer',
		width: '40px',
		height: '40px',
		backgroundColor: 'rgb(210,221,228)',
		transition: '0.25s background-color',
		borderRadius: '100%',
		margin: '0 auto',
		marginBottom: '10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',

		'&:hover': {
			backgroundColor: 'rgb(206, 212, 217)',
			transition: '0.25s background-color',
		},
	},
	activeIcon: {
		'& svg': {
			fill: 'rgb(23, 170, 221) !important',
		},
	},
	inactiveIcon: {
		'& svg': {
			fill: 'rgba(146, 158, 170, 1) !important',
		},
	},
	customMapBadgeIcon: {
		fill: 'lightgreen !important',
	},
}));

export default function Drawer(props) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const classes = useStyles(props);
	const { dealSettingsNumber } = props;

	const onClick = key => {
		if (key === 'Grid')
			setStateApp(stateApp => ({
				...stateApp,
				transactBarShowGrid: !stateApp.transactBarShowGrid,
			}));
		else if (key === 'Map')
			// Toggle map
			setStateApp(stateApp => ({ ...stateApp, transactBarView: stateApp?.transactBarView === 'Map' ? 'Deal' : 'Map' }));
		else setStateApp(stateApp => ({ ...stateApp, transactBarView: key }));
	};

	const getClass = (classes, key) => {
		if (key === 'Grid' && stateApp.transactBarShowGrid) {
			return classes.activeIcon;
		}

		return stateApp.transactBarView === key ? classes.activeIcon : classes.inactiveIcon;
	};

	const drawerIcons = {
		// Comments: (props) => <MessageIcon {...props} />,
		Deal: props => (
			<Badge
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				color="primary"
			>
				<HomeIcon {...props} />
			</Badge>
		),
		Documents: props => (
			<Badge
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				color="primary"
				badgeContent={stateApp?.filesDescriptors?.filter(d => d.fileState === 'active')?.length}
			>
				<DescriptionIcon {...props} />
			</Badge>
		),
		// "Lane Progress": (props) => <CheckmarkIcon {...props} />,
		// History: (props) => <ShareIcon {...props} />,
		// Groups: (props) => <FolderIcon {...props} />,
		Contacts: props => (
			<Badge
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				color="primary"
				badgeContent={stateApp?.activeDeal?.contacts?.length}
			>
				<IdentityIcon {...props} />
			</Badge>
		),
		'Task Progress': props => (
			<Badge
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				color="primary"
				badgeContent={dealSettingsNumber}
			>
				<CheckBoxIcon {...props} />
			</Badge>
		),
		Map: props => (
			<Badge
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				color="primary"
				badgeContent={
					props?.mapSettings == null && stateApp?.activeDeal?.mapSettings == null ? null : 1
					// (
					//   <RoomIcon
					//     className={classes.customMapBadgeIcon}
					//   />
					// )
				}
			>
				<PanoramaIcon {...props} />
			</Badge>
		),
		Grid: props => {
			return (
				<Badge
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					color="primary"
					badgeContent={
						get(props.dealSummaryData, 'flowDealSummary.data.parcelInterests', 0) +
						get(props.dealSummaryData, 'flowDealSummary.data.unitInterests', 0)
					}
				>
					<GridOnIcon {...props} />
				</Badge>
			);
		},
		// reserve this for automations potentially
		// Progress: (props) => (
		//   <Badge
		//     anchorOrigin={{
		//       vertical: "top",
		//       horizontal: "right",
		//     }}
		//     color="primary"
		//   >
		//     <FlowIcon {...props} />
		//   </Badge>
		// ),
	};
	return (
		<div className={classes.root}>
			{Object.keys(drawerIcons).map(key => {
				if (key === 'Grid' && !stateApp.activeDeal?.contacts) {
					return null; // exclude Grid icon if activeDeal.contacts doesn't exist
				}

				return (
					<Tooltip title={key} placement="left">
						<div className={`${classes.icon} ${getClass(classes, key)}`} onClick={() => onClick(key)}>
							{drawerIcons[key]({
								...props,
								opacity: '1',
								height: '30',
							})}
						</div>
					</Tooltip>
				);
			})}
		</div>
	);
}
