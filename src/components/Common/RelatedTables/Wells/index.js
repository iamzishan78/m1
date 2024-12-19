import React, { useContext, useMemo } from 'react';
import { Container, Button, ButtonGroup } from '@material-ui/core';
import { AppContext } from 'AppContext';
import MRTTable from 'components/MRTTable';
import { DrawerContext } from 'components/Land/components/Agreements/detailComponents/DrawerContext';
import WellDialog from 'components/MRTTable/TablesOverride/RelatedWellsTable/RightDialogs/RelatedWellIDialog';

function RelatedWellsTable(props) {
	const [stateApp, setStateApp] = useContext(AppContext);
	const [drawer, setDrawer] = useContext(DrawerContext);

	const onClose = () => {
		setDrawer(null);
		setStateApp(state => ({
			...state,
			selectedWell: null,
		}));
	};

	const RelatedWellsOverrideMeta = useMemo(
		() => ({
			...props.overrideMeta,
			CustomToolBar: () => {
				return (
					<ButtonGroup
						variant="contained"
						style={{ height: '30px', marginBottom: '8px' }}
						color="primary"
						aria-label="split button"
					>
						<Button
							id="addRelatedDocumentButton"
							size="small"
							color="primary"
							aria-label="select merge strategy"
							aria-haspopup="menu"
							onClick={() => {
								setDrawer('relatedWell');
								setStateApp(stateApp => ({ ...stateApp, selectedWell: null }));
							}}
						>
							+ ADD WELL
						</Button>
					</ButtonGroup>
				);
			},
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[props.overrideMeta]
	);

	return (
		<Container style={{ padding: 0, margin: 0 }} maxWidth={false} id={props.id ? props.id : props.parent}>
			<MRTTable name="RelatedWellsTable" overrideMeta={RelatedWellsOverrideMeta} />

			{drawer === 'relatedWell' && (
				<WellDialog
					open
					width="600px"
					shapeId={props.customLayer._id}
					shapeType={props.shapeType}
					wellInterest={stateApp?.selectedWell}
					onClose={onClose}
				/>
			)}
		</Container>
	);
}

export default React.memo(RelatedWellsTable);
