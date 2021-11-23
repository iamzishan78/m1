import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    search: {
        position: 'relative',

        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            backgroundColor: theme.palette.common.white,
            // opacity: 0.15,
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        // pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        cursor: 'pointer',
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: props => props.search.length > 0 ? '15ch' : '0.9px',
            '&:focus': {
                backgroundColor: theme.palette.common.white,
                opacity: 0.75,
                width: '15ch'
            },
        },
    }
}));

export default function ExpandableSearch({ search, setSearch }) {
    const classes = useStyles({ search });

    return <div className={classes.search}>
        <div className={classes.searchIcon}>
            <SearchIcon />
        </div>
        <InputBase
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
        />
    </div>
}
