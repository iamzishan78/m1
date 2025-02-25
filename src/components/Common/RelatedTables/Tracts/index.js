import React, { useContext, useMemo } from 'react';

import { Container, Button, ButtonGroup } from '@material-ui/core';

import AddAgreementOwnerAndTractDialog from 'components/Common/TableAddDialog/AddAgreementOwnerAndTractDialog';
import { DrawerContext } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import MRTTable from 'components/MRTTable';
import ToolbarButton from 'components/Shared/ui/ToolbarButton';

import { AppContext } from 'AppContext';

function RelatedTractsTable(props) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const [drawer, setDrawer] = useContext(DrawerContext);

	// On row click action
	const onClickedRow = selectedRow => {
		setDrawer('relatedTract');
		setStateApp(state => ({
			...state,
			selectedTract: selectedRow,
		}));
	};

	const onClose = () => {
		setDrawer(null);
		setStateApp(state => ({
			...state,
			selectedTract: null,
		}));
	};

	const RelatedTractsOverrideMeta = useMemo(
		() => ({
			...props.overrideMeta,
			onClickedRow: onClickedRow,
			CustomToolBar: () => {
				return (
					<ToolbarButton
						label={'+ ADD TRACT'}
						onClick={() => {
							setDrawer('relatedTract');
							setStateApp(stateApp => ({ ...stateApp, selectedTract: null }));
						}}
					/>
				);
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.overrideMeta]
	);

	return (
		<Container style={{ padding: 0, margin: 0 }} maxWidth={false} id={props.id ? props.id : props.parent}>
			<MRTTable name="RelatedTractsTable" overrideMeta={RelatedTractsOverrideMeta} />

			{drawer === 'relatedTract' && (
				<AddAgreementOwnerAndTractDialog
					open
					width="600px"
					shapeId={props.customLayer._id}
					layerType={props.customLayer.layer}
					shapeType={props.shapeType}
					seletedOwner={stateApp?.selectedTract}
					onClose={onClose}
				/>
			)}
		</Container>
	);
}

export default React.memo(RelatedTractsTable);
