import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    gridStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    notchedOutline: {
        border: 0,
    },
    dateRoot: {
        border: "1px solid #EBEBEB",

        "&.Mui-focused fieldset": {
            border: "1px solid black",
            backgroundColor: "transparent",
        },
        "&:hover": {
            backgroundColor: "#EBEBEB",
        },
        "&:active": {
            border: "1px solid black",
            backgroundColor: "#fff",
        },
    },

    inputFieldDate: {
        marginBottom: "7px",
    },
}));

function SimpleTextField({
    title,
    value,
    setValue,
    disabled = false
}) {
    const classes = useStyles();

    return (
        <FormControl variant="outlined" fullWidth size="small">
            <Grid container className={classes.gridStyle}>
                <Grid item xs={3}>
                    <div>{title}</div>
                </Grid>
                <Grid item xs={9}>
                    <TextField
                        margin="dense"
                        type="text"
                        variant="outlined"
                        value={value}
                        placeholder=""
                        fullWidth
                        disabled={disabled}
                        className={`${classes.dateRoot} ${classes.inputFieldDate}`}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        autoFocus={true}
                        InputProps={{
                            classes: {
                                root: classes.dateRoot,
                                focused: classes.focused,
                                notchedOutline: classes.notchedOutline,
                                light: classes.light,
                            },
                        }}
                    />
                </Grid>
            </Grid>
        </FormControl>
    );
}

export default SimpleTextField;
