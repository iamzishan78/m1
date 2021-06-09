import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { TextField, Grid } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import Typography from '@material-ui/core/Typography';
import { truncate } from "components/Shared/functions";


const useStyles = makeStyles((theme) => ({
    heading: ({ type }) => ({
        marginTop: type === 'group' ? '8px' : '6px'
    }),
    textField: {
        height: "100%",
        width: "100%",
        paddingTop: "15px",
        '& .MuiFilledInput-input': {
            padding: '12px 12px 10px'
        },
        '& .MuiFormHelperText-contained': {
            justifyContent: "flex-end",
            display: "flex"
        }
    },
    editIcon: (type) => ({
        top: type === 'group' ? "10px" : '7px',
        left: "7px",
        position: "relative"
    }),
    textFieldInput: {
        height: "40px",
    },
    textFieldLabel: {
    },
}));

function EditableTextField({ item, onChange, name }) {
    const [isEdit, setEdit] = useState({});
    const classes = useStyles({ isEdit, type: item.type });
    return (
        <Grid container onMouseOver={() => !isEdit.mode && setEdit({ ...isEdit, able: true })}
            onMouseLeave={() => setEdit({ ...isEdit, able: false })}>
            <Grid item >
                {!isEdit.mode ? (
                    <Typography className={classes.heading}>{`${truncate(name, 45)}`}</Typography>
                ) : (
                    <TextField
                        placeholder="Project Name..."
                        className={classes.textField}
                        variant="outlined"
                        id="reddit-input"
                        defaultValue={name}
                        autoFocus
                        required
                        helperText={"Return to save"}
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