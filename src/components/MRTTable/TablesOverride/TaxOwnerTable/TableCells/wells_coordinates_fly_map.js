import React, { useEffect } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { IconButton } from '@material-ui/core';
import RoomIcon from '@material-ui/icons/Room';
import { makeStyles } from '@material-ui/core/styles';
import { useLazyQuery } from '@apollo/client';

import { OWNERSLATSLONS } from "graphQL/useQueryOwnerLatsLonsArray";
import { popupController } from 'hookstate/popupStateController';
import { mapControlsController } from 'hookstate/mapControlsController';

const useStyles = makeStyles(() => ({
    icons: {
        backgroundColor: 'transparent',
        marginLeft: 'auto',
        '&:hover': {
            backgroundColor: '#dadbde !important',
        },
    },
}));

const WellFlyToMap = ({ id, disabled = false }) => {
    const classes = useStyles();
    const [getOwnerWells, { data: dataOwnerWells }] = useLazyQuery(OWNERSLATSLONS);


    const handleClick = async () => {
        await getOwnerWells({
            variables: {
                ownerId: id,
            },
        });
    }

    useEffect(() => {
        if (dataOwnerWells && dataOwnerWells.ownerLatsLonsArray?.length) {

            if (dataOwnerWells.ownerLatsLonsArray.length === 1)
                popupController.setState({
                    selectedWellId: dataOwnerWells.ownerLatsLonsArray[0].id.toLowerCase(),
                    wellSelectedCoordinates: [
                        dataOwnerWells.ownerLatsLonsArray[0].longitude,
                        dataOwnerWells.ownerLatsLonsArray[0].latitude,
                    ],
                });
            window.setStateApp(stateApp => ({
                ...stateApp,
                fitBounds: null,
                wellListFromSearch: [...dataOwnerWells.ownerLatsLonsArray],
            }));

            mapControlsController.updateState({ mapGridCardActivated: false });
        }

    }, [dataOwnerWells]);

    return (
        <Tooltip title="Fly To Map" placement="top" style={{ marginRight: '10px' }}>
            <IconButton
                id={`map-fly-to-${id}`}
                size={'medium'}
                color="secondary"
                className={`${classes.icons}`}
                disabled={disabled}
                onClick={e => {
                    e.stopPropagation();
                    handleClick();
                }}
                aria-label="fly"
            >
                <RoomIcon />
            </IconButton>
        </Tooltip>
    );
};

export default WellFlyToMap;
