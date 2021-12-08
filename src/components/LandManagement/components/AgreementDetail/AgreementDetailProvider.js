import React from "react";
import { AgreementDetailContextProvider } from "./AgreementDetailContext";
import { makeStyles } from "@material-ui/core/styles";
import AgreementDetail from "./components";

const useStyles = makeStyles(() => ({
    AgreementWrapper: {
        width: "100%",
        height: "100%",
    },
}));

export default function AgreementProvider(props) {
    let classes = useStyles();
    return (
        <AgreementDetailContextProvider>
            <AgreementDetail className={classes.AgreementWrapper}>{props.children}</AgreementDetail>
        </AgreementDetailContextProvider>
    );
}
