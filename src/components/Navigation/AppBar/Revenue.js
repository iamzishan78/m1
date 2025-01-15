import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Grid, Typography } from '@material-ui/core';

import { useMutation } from '@apollo/client';

import ButtonDropDown from 'components/MRTTable/Common/Components/ButtonDropDown';
import RevenueSearch from 'components/Navigation/components/RevenueSearch';
import { SIDE_PANEL_MENU_ITEMS_LIST } from 'components/Revenue/Revenue';
import ReportGroupHeader from 'components/Shared/ReportGroupHeader';

import { ADD_CHECK_DATA } from 'graphQL/useMutationAddCheck';
import { ADD_PROPERTY } from 'graphQL/useMutationAddProperty';

import { setRevenueKey } from 'actions';

export default function RevenueAppBar(props) {
	const { classes } = props;
	let history = useHistory();
	const dispatch = useDispatch();
	const { activeModule, quickActionsPanelState } = useSelector(({ common }) => common);
	const propertiesReportGroup = useSelector(({ Revenue }) => Revenue.propertiesReportGroup);

	const [addProperty] = useMutation(ADD_PROPERTY, {
		onCompleted: data => {
			if (data?.addProperty?.property) {
				history.push(`/revenue/property/details/${data.addProperty.property._id}`);
			}
		},
	});

	const [addCheck] = useMutation(ADD_CHECK_DATA, {
		onCompleted: data => {
			if (data?.addCheck?.newCheck) {
				history.push(`/revenue/statement/details/${data.addCheck.newCheck._id}`);
			}
		},
	});

	const RevenueStatementAction = React.useMemo(() => {
		return [
			{
				isShow: false,
				text: 'Add Statement',
				action: () => {
					addCheck({ variables: { check: { source: 'Manual Entry' } } });
				},
			},
			{
				isShow: true,
				text: 'Import Statement',
				action: () => {
					history.push('/bulkupload/checkdetails');
				},
			},
		];
	}, [activeModule]);

	const PropertyStatementAction = React.useMemo(() => {
		return [
			{
				isShow: false,
				text: '+ Add Property',
				action: () => {
					addProperty({
						variables: {
							property: {
								source: 'Manual Entry',
								status: 'NotInPay',
							},
						},
					});
				},
			},
			{
				isShow: true,
				text: 'Import Properties',
				action: () => {
					history.push('/bulkupload/properties', { title: 'Properties', previousRoute: '/revenue/properties' });
				},
			},
		];
	}, [activeModule]);

	return (
		<Grid
			container
			direction="row"
			display="flex"
			justify="space-between"
			alignItems="center"
			style={{ marginLeft: quickActionsPanelState ? '433px' : '7px' }}
		>
			<Grid item md={8}>
				<Grid container direction="row" display="flex" justify="flex-start" alignItems="center">
					<Grid item xs={2.5}>
						<Typography variant="h5" style={{ color: 'black', fontWeight: 'bold' }}>
							{activeModule?.title}
						</Typography>
					</Grid>
					{(activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS?.title ||
						activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES?.title) && (
						<Grid item xs={5} style={{ marginLeft: '20px' }}>
							<RevenueSearch activeModule={activeModule} />
						</Grid>
					)}
					{activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PORTFOLIO?.title && (
						<Grid item xs={7} style={{ marginLeft: '20px' }}>
							<ReportGroupHeader
								type="Properties"
								esFilters={propertiesReportGroup || []}
								setESFilters={filters => dispatch(setRevenueKey('propertiesReportGroup', filters))}
								setFilterToggle={() => {}}
								isBackground={false}
								noUpdate={true}
								fullWidth
								isShrink
							/>
						</Grid>
					)}
				</Grid>
			</Grid>
			{activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.REVENUE_STATEMENTS.title && (
				<Grid item>
					<div className={classes.filterTabs} style={{ paddingRight: '10px' }}>
						<ButtonDropDown variant="contained" color="primary" options={RevenueStatementAction} />
					</div>
				</Grid>
			)}
			{activeModule.title === SIDE_PANEL_MENU_ITEMS_LIST.PROPERTIES.title && (
				<Grid item>
					<div className={classes.filterTabs} style={{ paddingRight: '10px' }}>
						<ButtonDropDown variant="contained" color="primary" options={PropertyStatementAction} />
					</div>
				</Grid>
				// <Grid item>
				//   <div className={classes.filterTabs} style={{ paddingRight: "10px" }}>
				//     <Button
				//       color="primary"
				//       variant="contained"
				//       startIcon={<Add />}
				//       onClick={() => {
				//         addProperty({
				//           variables: {
				//             property: {
				//               source: "Manual Entry",
				//               status: "Not in Pay",
				//             },
				//           },
				//         });
				//       }}
				//     >
				//       Add New Property
				//     </Button>
				//   </div>
				// </Grid>
			)}
		</Grid>
	);
}
