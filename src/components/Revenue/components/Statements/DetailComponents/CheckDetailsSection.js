import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import CheckDetailsTable from "components/Table/Revenue/CheckDetailsTable";


const useStyles = makeStyles(() => ({
    titleText: {
        textTransform: "uppercase",
        margin: "5px 16px 10px",
        fontWeight: "bold",
    },
}));

const CheckDetailsSection = ({ checkId }) => {
    const classes = useStyles();
    return (
        <div className="flex column justifyStart alignStart w-100" style={{ maxWidth: "100%", margin: "0 auto", background: "#ffffff", borderBottonLeftRadius: 8, borderBottomRightRadius: 8 }}>
            <div className="flex justifyBetween alignCenter w-100" style={{ padding: 20 }}>
                <Typography varient="h5" className={classes.titleText}>
                    Check Details
                </Typography>
            </div>
            <CheckDetailsTable parent="CheckDetailsTable" header="Check Details" checkId={checkId} />
        </div>
    )
}


export default CheckDetailsSection;