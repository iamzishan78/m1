import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import LocationOnIcon from "@material-ui/icons/LocationOn";
import WellIcon from "components/Shared/svgIcons/well";
import OwnershipIcon from "components/Shared/svgIcons/ownership";
import LeaseIcon from "components/Shared/svgIcons/lease";
import OperatorIcon from "components/Shared/svgIcons/operator";
import MapGridCardSearch from "./MapGridCardSearch";

const useStyles = makeStyles((theme) => ({
    searchSelect: {
        width: '150px',
        "& .MuiFilledInput-root, & .MuiSelect-select.MuiSelect-select": {
            backgroundColor: '#ffffff !important',
        },
    }, icon: {
        color: "#757575",
        fontSize: "26px"
    },
}));

const icons = [
    { value: 'well', Icon: WellIcon, label: "Wells" },
    { value: 'owner', Icon: OwnershipIcon, label: "Owners" },
    { value: 'operator', Icon: OperatorIcon, label: "Operators" },
    { value: 'lease', Icon: LeaseIcon, label: "Leases" },
    { value: 'contacts', Icon: PersonIcon, label: "Contacts" },
    { value: 'location', Icon: LocationOnIcon, label: "Locations" },
]

const SearchPanel = ({ handleChange, value, ativateSearchPanel }) => {

    const classes = useStyles();
    return (
        <>
            <Grid container direction="row" spacing={2}>
                <Grid item>
                    <FormControl className={classes.searchSelect}>
                        <Select
                            labelId="demo-customized-select-label"
                            id="demo-customized-select"
                            value={value}
                            disableUnderline
                            onChange={handleChange}
                        >
                            {icons.map((icon, index) => {
                                const Icon = icon.Icon
                                return <MenuItem value={index}>
                                    <Grid container direction="row" justifyContent="space-around" alignItems="center" >
                                        <Grid item> <Icon className={classes.icon} color={"#757575"} opacity="1.0" small /></Grid>
                                        <Grid item>  {icon.label}</Grid>
                                    </Grid>
                                </MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <MapGridCardSearch
                        ativateSearchPanel={ativateSearchPanel}
                        searchOption={icons[value].value}
                    />
                </Grid>
            </Grid>

            {/* <WellIcon className={classes.icon} color={"#757575"} opacity="1.0" small /> */}
        </>
    )
};

export default SearchPanel
