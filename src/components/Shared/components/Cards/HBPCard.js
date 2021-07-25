import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, IconButton, Button } from "@material-ui/core/";

import QuestionIcon from "@material-ui/icons/Help";
import XIcon from "@material-ui/icons/HighlightOff";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

const useStyles = makeStyles((theme) => ({
    iconContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& .MuiButtonBase-root": {
            fontSize: 'x-large',
            fontWeight: "bold",
            height: '35px',
            background: 'transparent'
        }
    },
    tex1: {
        colorPrimary: "white",
    },
}));

export default function HBPCard(props) {
    let classes = useStyles();
    const { status, label } = props;

    const Icon = () => (
        <Button>HBP</Button>
    );

    return (
        <div className={classes.iconContainer}>
            <Icon />

            <Typography
                //classes={classes.text1}
                align="center"
                variant="subtitle2"
            >
                {label} Status
      </Typography>
            <Typography
                align="center"
                //className={classes.text2}
                variant="caption"
            >
                {status ? status.toUpperCase() : "--"}
            </Typography>
        </div>
    );
}
