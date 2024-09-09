import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({

    gridStyle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    notes: {
        backgroundColor: "#FFFCDC",
        display: "block",
        width: "100%",
        marginTop: 25,
        // marginBottom: 25,

        "& .MuiOutlinedInput-root": {
            width: "100%",
            "& fieldset": {
                borderColor: "white",
            },
        },
    },

}));

function DescriptionField({
    description,
    setDescription,
}) {
    const classes = useStyles();

    return (
        <TextField
            margin="dense"
            variant="outlined"
            multiline

            rows={8}
            value={description}
            label="Description"
            fullWidth
            //   required
            onChange={(e) => {
                setDescription(e.target.value);
            }}
            className={classes.notes}
        />
    );
}

export default DescriptionField;
