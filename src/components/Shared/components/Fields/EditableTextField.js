import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
    heading: {
        marginTop: '10px'
    },
    textField: {
        height: "100%",
        width: "100%",
        '& .MuiFilledInput-input': {
            padding: '12px 12px 10px'
        }
    },
    editIcon: {
        top: "11px",
        left: "7px",
        position: "relative"
    },
    textFieldInput: {
        height: "40px",
    },
    textFieldLabel: {
    },
}));

function EditableTextField({ item, onChange, name }) {
    const [isEdit, setEdit] = useState({});
    const classes = useStyles({ isEdit });
    return (
        <Grid container onMouseOver={() => !isEdit.mode && setEdit({ ...isEdit, able: true })}
            onMouseLeave={() => setEdit({ ...isEdit, able: false })}>
            <Grid item >
                {!isEdit.mode ? (
                    <Typography className={classes.heading}>{`${name}`}</Typography>
                ) : (
                    <TextField
                        placeholder="Project Name..."
                        className={classes.textField}
                        variant="outlined"
                        id="reddit-input"
                        defaultValue={name}
                        autoFocus
                        required
                        // helperText={"Press Enter to save"}
                        InputProps={{
                            className: classes.textFieldInput,
                            disableUnderline: true,
                        }}
                        onClick={(e) => e.stopPropagation()}
                        InputLabelProps={{ className: classes.textFieldLabel }}
                        onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                onChange(item, e.target.value);
                                setEdit({ able: false, mode: false })
                            }
                        }}
                        onBlur={() => setEdit({ able: false, mode: false })}
                    />
                )}
            </Grid>
            <Grid item className={classes.editIcon}>
                {isEdit.able && <EditIcon fontSize="small" onClick={(e) => { e.stopPropagation(); setEdit({ able: false, mode: true }) }} />}
            </Grid>
        </Grid>
    )
}

export default EditableTextField