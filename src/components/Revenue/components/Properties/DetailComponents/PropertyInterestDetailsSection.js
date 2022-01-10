import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropertyInterestDetailsTable from "components/Table/Revenue/PropertyInterestDetailsTable";


const useStyles = makeStyles(() => ({
    sectionCard: {
        maxWidth: "100%",
        margin: "0 auto",
        background: "#ffffff",
        borderBottonLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    titleField: {
        padding: 20
    },
    titleText: {
        textTransform: "uppercase",
        margin: "5px 16px 10px",
        fontWeight: "bold",
    },
}));

const PropertyInterestDetailsSection = ({ checkId }) => {
    const classes = useStyles();
    return (
        <div className={`${classes.sectionCard} flex column justifyStart alignStart w-100`}>
            <PropertyInterestDetailsTable parent="PropertyInterestTable" header="Interest Details" checkId={checkId} />
        </div>
    )
}


export default PropertyInterestDetailsSection;