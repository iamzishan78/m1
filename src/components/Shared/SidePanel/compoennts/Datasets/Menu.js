import React from 'react';
import Menu from '@material-ui/core/Menu';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { v4 as uuid } from "uuid";
import { makeStyles, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import ArrowForwardOutlinedIcon from '@material-ui/icons/ArrowForwardOutlined';
import { useMutation } from '@apollo/client';
import { ADD_LAYER_GROUP } from 'graphQL/useMutationLayerGroup';


const useStyles = makeStyles((theme) => ({
    popover: {
        "& .MuiPopover-paper": {
            color: 'rgb(59, 70, 99)',
            backgroundColor: '#1c2233',
            marginTop: '110px',
            // left: '10% !important',
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
        },
        '& .menu': {
            paddingRight: "10px",
            '& .MuiTypography-body1': {
                fontWeight: 700,
            }
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


export default function DatasetMenu({ dataset, handleRemove, handleTransfer }) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const [addLayerGroup, { loading }] = useMutation(ADD_LAYER_GROUP, {
        refetchQueries: ["getLayerGroups"],
        awaitRefetchQueries: true,
    });

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return (
        <div >
            <MoreVertIcon aria-controls={"dataset-menu " + dataset.sourceName} className='actionIcon' onClick={handleClick} />
            <Menu
                id={"dataset-menu " + dataset.sourceName}
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={classes.popover}
            >
                <div className={'menu'}>
                    <List component="nav" aria-label="main mailbox folders" disablePadding>
                        <ListItem button onClick={(e) => { e.stopPropagation(); handleTransfer(dataset); handleClose() }}>
                            <ArrowForwardOutlinedIcon />
                            <ListItemText primary="Transfer" />
                        </ListItem>
                        <ListItem button onClick={(e) => { e.stopPropagation(); handleRemove(dataset, false) }}>
                            <DeleteOutlineOutlinedIcon />
                            <ListItemText primary="Remove" />
                        </ListItem>
                    </List>
                </div>

            </Menu>
        </div>
    );
}