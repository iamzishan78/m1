import { useLazyQuery } from '@apollo/client';
import Badge from '@material-ui/core/Badge';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import React, { memo, useEffect, useMemo, useState } from 'react';

import Slideout from 'components/MRTTable/Common/Slideout';
import WellIcon from 'components/Shared/svgIcons/well';

import { GETWELLSFROMDOCUMENTS } from 'graphQL/useQueryGetWellsFromDocument';

import { globalStateController } from 'hookstate/globalStateController';
import { slidoutStateController } from 'hookstate/slidoutStateController';
import { tableGlobalController } from 'hookstate/tableController';

import AssociatedWells from './AssociatedWells';
import DetailsPanel from './Detail';
import Information from './Information';

function CreateAndViewComponent({ selectedDocument, tableKey }) {
	const [wellsCount, setWellsCount] = useState(0);
	const slideOutState = slidoutStateController.useState(['views', 'view', 'activeTabs']);
	const { user } = globalStateController.useState(['user']);
	const getUser = user.get({ noproxy: true });

	const [getWellsFromDocument, { data: wellsFromDocument }] = useLazyQuery(GETWELLSFROMDOCUMENTS, {
		fetchPolicy: 'cache-and-network',
		nextFetchPolicy: 'cache-first',
	});

	useEffect(() => {
		if (wellsFromDocument) {
			const wellDescriptor = wellsFromDocument?.getWellDescriptors[0];
			setWellsCount(wellDescriptor?.wells?.length);
		}
	}, [wellsFromDocument]);

	useEffect(() => {
		if (selectedDocument) {
			getWellsFromDocument({
				variables: {
					descriptorObject: selectedDocument?._id,
				},
			});
		}
	}, [selectedDocument?._id]);

	const handleClose = () => {
		tableGlobalController.updateState({
			documentDialog: {
				type: {},
			},
		});
	};

	const views = useMemo(
		() => [
			{
				name: 'Home',
				Icon: props => (
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
				Component: () => (
					<DetailsPanel selectedDocument={selectedDocument} handleClose={handleClose} tableKey={tableKey} />
				),
				props: {},
				onClick: () => {},
			},
			{
				name: 'Wells',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
						badgeContent={wellsCount}
					>
						<WellIcon {...props} />
					</Badge>
				),
				Component: () => <AssociatedWells selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
			{
				name: 'Information',
				Icon: props => (
					<Badge
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						color="primary"
					>
						<InfoOutlined {...props} />
					</Badge>
				),
				Component: () => <Information selectedDocument={selectedDocument} />,
				props: {},
				onClick: () => {},
			},
		],
		[selectedDocument, wellsCount]
	);

	const deleteFunc = () => {
		const deletedData = { mainRecord: [selectedDocument?._id] };
		tableGlobalController.updateState({
			dialog: {
				type: 'deleteGrid',
				deletedData,
				tableKey,
				userId: getUser?._id,
			},
		});
		handleClose();
	};
	useEffect(() => {
		slideOutState.views.set(views);
		slideOutState.view.set(views[0]);
	}, [wellsCount]);

	return <Slideout show={true} deleteFunc={deleteFunc} />;
}

export default memo(CreateAndViewComponent);
