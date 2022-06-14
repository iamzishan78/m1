import React from 'react';
import Menu from '@material-ui/core/Menu';
import FolderIcon from "@material-ui/icons/Folder";
import { v4 as uuid } from "uuid";
import { IconButton, makeStyles, Tabs, Tab, TextField, InputAdornment, CircularProgress } from '@material-ui/core';
import { useMutation } from '@apollo/client';
import { ADD_LAYER_GROUP } from 'graphQL/useMutationLayerGroup';


const useStyles = makeStyles((theme) => ({
    popover: {
        "& .MuiPopover-paper": {
            color: '#fff',
            backgroundColor: '#1c2233',
            marginTop: '110px',
            left: '18% !important',
        },
        "& .MuiTabs-indicator": {
            height: '4px',
            backgroundColor: "rgba(23, 170, 221, 1)",
        },

        "& .MuiFilledInput-root": {
            backgroundColor: '#252d40'
        },
        "& .Mui-disabled": {
            paddingBottom: "10px",
            borderBottom: "1px solid lightgrey",
        },
        "& .MuiMenuItem-root": {
            "&:hover": {
                color: "rgba(23, 170, 221, 1)",
            },
        },

        '& .MuiCircularProgress-colorPrimary': {
            color: "rgba(23, 170, 221, 1)",
        }
    },
    inputField: {
        padding: '20px',
        '& .MuiInputLabel-filled': {
            color: 'grey'
        },
        '& .MuiFilledInput-input': {
            color: '#fff'
        }
    }
}));


export default function AddGroup({ userId, above }) {
    const classes = useStyles();
    const [tabValue, setTabValue] = React.useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [addLayerGroup, { loading }] = useMutation(ADD_LAYER_GROUP, {
        refetchQueries: ["getLayerGroups"],
        awaitRefetchQueries: true,
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSubmit = (event) => {
        if (event.key === "Enter" && !loading) {
            const layerGroup = { name: event.target.value, groupId: uuid(), above, createBy: userId }
            addLayerGroup({ variables: { userId, layerGroup } }).then(() => {
                handleClose();
            })
        }
    }

    return (
        <div>
            <IconButton aria-controls="group-button" aria-haspopup="true" onClick={handleClick} >
                <FolderIcon fontSize="large" style={{ color: '#fff', marginRight: '10px' }} />
            </IconButton>
            <Menu
                id="group-button"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.popover}
            >
                <div className={'menu'}>
                    <Tabs
                        value={tabValue}
                        indicatorColor="primary"
                        onChange={(_, newValue) => setTabValue(newValue)}
                        aria-label="disabled tabs example"
                    >
                        <Tab label="Create New" />
                        <Tab label="Choose From Library" />
                    </Tabs>
                    <div className={classes.inputField}>
                        <TextField id="group-input" label="Group Name" variant="filled" fullWidth onKeyDown={handleSubmit}
                            InputProps={{
                                endAdornment: loading ? <InputAdornment position="end">
                                    <CircularProgress size={30} />
                                </InputAdornment> : <></>,
                            }} />
                    </div>

                </div>

            </Menu>
        </div>
    );
}