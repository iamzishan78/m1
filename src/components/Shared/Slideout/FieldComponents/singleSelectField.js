import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Grid, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    gridStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    inputFieldCustomTextInput: {
        marginBottom: "7px",
    },
    flowlineRoot: {
        "&:hover": {
            backgroundColor: "#EBEBEB",
            "& .MuiOutlinedInput-notchedOutline": {
                border: 0,
            },
            "& .MuiSelect-icon": {
                display: "inline-block",
            },
        },
        "&:active": {
            border: "1px solid black",
            backgroundColor: "#EBEBEB",
        },
    },
    notchedOutline: {
        border: 0,
    },

}));

function SingleSelectField({
    title,
    value,
    options,
    onChange
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
                        variant="outlined"
                        select
                        autoFocus
                        SelectProps={{
                            native: true,
                            classes: {
                                icon: classes.icon,
                            },
                        }}
                        size="small"
                        value={value}
                        className={classes.inputFieldFlowStage}
                        onChange={(e) => onChange(e.target.value)}
                        InputProps={{
                            classes: {
                                root: classes.flowlineRoot,
                                notchedOutline: classes.notchedOutlineFlow,
                                focused: classes.notchedOutlineFlowFocused,
                            },
                        }}
                        fullWidth
                    >
                        {options &&
                            options.map((opt, i) => (
                                <option value={opt._id} key={i}>
                                    {opt.name}
                                </option>
                            ))}
                    </TextField>
                </Grid>
            </Grid>
        </FormControl>
    );
}

export default memo(SingleSelectField); 
