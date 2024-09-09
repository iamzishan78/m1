import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField } from '@material-ui/core';

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

function DateField({
    title,
    date,
    setDate
}) {
    const classes = useStyles();

    return (
        <>
            <Grid item xs={3}>
                <div>{title}</div>
            </Grid>
            <Grid item xs={9}>
                <TextField
                    margin="dense"
                    type="date"
                    variant="outlined"
                    value={date}
                    autoFocus
                    placeholder=""
                    fullWidth
                    className={`${classes.dateRoot} ${classes.inputFieldDate}`}
                    onChange={(e) => {
                        setDate(e.target.value);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
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
        </>
    );
}

export default DateField;
