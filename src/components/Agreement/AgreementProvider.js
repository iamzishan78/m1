import React from "react";
import { AgreementContextProvider } from "./AgreementContext";
import { makeStyles } from "@material-ui/core/styles";
import Agreement from "./Components";

const useStyles = makeStyles(() => ({
    AgreementWrapper: {
        width: "100%",
        height: "100%",
    },
}));

export default function AgreementProvider(props) {
    let classes = useStyles();
    return (
        <AgreementContextProvider>
            <Agreement className={classes.AgreementWrapper}>{props.children}</Agreement>
        </AgreementContextProvider>
    );
}
