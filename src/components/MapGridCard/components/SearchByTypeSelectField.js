import React, { useState, useMemo } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Grid from '@material-ui/core/Grid';

import ExpandableSearch from "components/Shared/Forms/Fields/ExpandableSearch";
import { Typography } from "@material-ui/core";
import { platformDataInitialData } from "./data";

const StyledMenu = withStyles({
    paper: {
        minWidth: '420px',
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        color: "#757575",
        '&:focus': {
            color: "#757575",
            // backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
    selected: {
        color: "#757575  !important",
        '& .MuiListItemText-primary': {
            color: "#757575  !important",
        },
        backgroundColor: '#dfecf7 !important',
    }
}))(MenuItem);

const useStyles = makeStyles((theme) => ({
    searchSelect: {
        width: '150px',
        "& .MuiFilledInput-root, & .MuiSelect-select.MuiSelect-select": {
            backgroundColor: (props) => `${props.backgroundColor}!important`,
        },
    }, icon: {
        color: "#757575",
        fontSize: "26px"
    },
    menuButton: {
        color: "#757575 !important",
        backgroundColor: (props) => `${props.backgroundColor}!important`,
    },

    underlinedHeader: {
        paddingLeft: '16px',
        justifyContent: "space-between",
        borderBottom: '0.5px solid #7575753d',
        '& .MuiTypography-h6': {
            fontWeight: 'bold',
            fontSize: '1.1rem'
        }
    }
}));

const SearchByTypeSelectField = ({ handleChange, value, backgroundColor }) => {

    const classes = useStyles({ backgroundColor });
    const [search, setSearch] = useState('');
    const [anchorEl, setAnchorEl] = React.useState(null);

    const platformData = useMemo(() => {
        return platformDataInitialData.filter((data) => !search || data.label.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()))

    }, [search])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const SelectedIcon = value.Icon
    return (
        <>
            <Button
                className={classes.menuButton}
                aria-controls="customized-menu"
                aria-haspopup="true"
                startIcon={<SelectedIcon />}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleClick}
            >
                {value.label}
            </Button>

            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Grid>
                    <Grid container className={classes.underlinedHeader} direction="row" justifyContent="space-between" alignItems="center" >
                        <Grid item>
                            <Typography variant="h6">
                                Platform Data
                            </Typography>
                        </Grid>
                        <Grid item>
                            <ExpandableSearch setSearch={setSearch} search={search} />
                        </Grid>
                    </Grid>

                    {platformData.map((icon) => {
                        const Icon = icon.Icon
                        return <StyledMenuItem key={icon.index} selected={icon.index === value.index} onClick={() => { handleChange(icon); handleClose(); }}>
                            <ListItemIcon>
                                <Icon className={classes.icon} fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={icon.label} />
                        </StyledMenuItem>
                    })}

                    {/* <Grid container className={classes.underlinedHeader} direction="row" justifyContent="space-between" alignItems="center" >
                                <Grid item>
                                    <Typography variant="h6">
                                        Pheasant Data
                                    </Typography>
                                </Grid>
                            </Grid>

                            {platformData.map((icon) => {
                                return <StyledMenuItem selected={icon.index === value} onClick={() => handleChange(icon.index)}>
                                    <Box borderColor={"red"} borderLeft={4}>
                                        <ListItemIcon>
                                        </ListItemIcon>
                                    </Box>
                                    <ListItemText primary={icon.label} />
                                </StyledMenuItem>
                            })} */}

                </Grid>
            </StyledMenu>
        </>
    )
};

export default SearchByTypeSelectField
