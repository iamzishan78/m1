import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { OPENDEALS } from "graphQL/useQueryOpenDeals";
import { Button, Grid, IconButton, InputAdornment, InputLabel, TextField, Typography } from "@material-ui/core";
import KeyboardTabBlackIcon from "components/Shared/svgIcons/KeyboardTabBlackIcon";
import SearchIcon from "@material-ui/icons/Search";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { DEAL_DESCRIPTOR } from "graphQL/useMutationAddDeal";
import { AppContext } from "AppContext";

export default function ExistingDeal({ contactId, handleClickDialogClose }) {
    const [stateApp] = useContext(AppContext);
    const userId = stateApp.user.mongoId;

    const [openDeals, setOpenDeals] = useState([]);
    const [dealId, setDealId] = useState(null);

    const [dealDescriptor] = useMutation(DEAL_DESCRIPTOR);
    const [getOpenDeals, { loading: tloading, data: dealsData }] = useLazyQuery(
        OPENDEALS,
        {
            fetchPolicy: "network-only",
        }
    );

    useEffect(() => {
        if (stateApp.user && stateApp.user.mongoId) {
            getOpenDeals();
        }
    }, [stateApp.user]);

    useEffect(() => {
        if (dealsData) {
            setOpenDeals(dealsData?.openDeals?.deals);
        }
    }, [dealsData]);

    const handleAddDeal = () => {
        dealDescriptor({
            variables: {
                deal: {
                    descriptorObject: dealId,
                    relatedObjectId: contactId,
                    relatedObjectType: "Contact",
                    userId: userId

                },
            },
            refetchQueries: ["getContactDeals"],
            awaitRefetchQueries: true,
        });
        handleClickDialogClose();
    }

    const useStyles = makeStyles((theme) => ({
        container: {
            padding: "30px 14px 10px 25px",
            height: "100vh",
            flexWrap: "nowrap"
        },

        heading: {
            fontSize: "24px",
            fontWeight: 600
        },
        searchDeal: {
            width: "100%",
            paddingTop: "17px"
        },
        label: {
            fontSize: "18px",
            fontWeight: 600,
            color: "black",
            paddingBottom: "20px"
        },
        dialogFooter: {
            display: "flex",
            justifyContent: "flex-end",
            paddingTop: "10px",
            paddingRight: "19px",
            paddingBottom: "40px",
            width: "inherit"
        },
        footerButton: {
            letterSpacing: "1px",
            textTransform: "capitalize",
            fontWeight: "bold",
            padding: "8px 20px",
        },
    }));

    const classes = useStyles();
    return (
        <Grid
            container
            direction="column"
            justifyContent="space-between"
            alignItems="flex-start"
            className={classes.container} >
            <Grid
                item
                container
                style={{ display: "block" }}
                xs={12}
                direction="column"
                justifyContent="space-between"
                alignItems="flex-start"  >
                <Grid item container xs={12}  >
                    <Grid item xs={11} style={{ minHeight: "35px" }}>
                        <Typography variant="h4" className={classes.heading}>
                            Add Contact to Deal
                        </Typography>

                    </Grid>
                    <Grid item xs={1} style={{ alignSelf: "center" }} >
                        <IconButton
                            size="small"
                            component="span"
                            style={{
                                background: "transparent",
                                paddingLeft: "10px",
                                alignSelf: "center"
                            }}
                            onClick={handleClickDialogClose}>
                            <KeyboardTabBlackIcon />
                        </IconButton>
                    </Grid>
                </Grid>

                <Grid className={classes.searchDeal}>
                    <InputLabel className={classes.label}>
                        Search for existing deal to associate to contact
                    </InputLabel>

                    <Autocomplete
                        options={openDeals}
                        onChange={(e, deal) => {
                            setDealId(deal?._id);
                        }}
                        value={openDeals?.find((deal) => deal._id === dealId) || null}
                        getOptionSelected={(option) => option.id === dealId}
                        getOptionLabel={(option) => option.name}
                        renderOption={(option) => {
                            return (
                                <Grid container spacing={0}>
                                    <Grid container item xs={12} alignItems="center">
                                        <Grid item xs>
                                            <span style={{ fontWeight: 400 }}>{option.name}</span>

                                            <Typography variant="body2" color="textSecondary">
                                                {option.label}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            );
                        }}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                className={clsx(classes.inputField)}
                                {...params}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                                placeholder="Search by deal name"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <InputAdornment className={classes.inputAdornment} position="start">
                                            <SearchIcon htmlColor="#757575" />
                                        </InputAdornment>
                                    ),
                                }}

                            />
                        )}
                    />

                </Grid>
            </Grid>

            <Grid
                item className={classes.dialogFooter}>
                <Button
                    variant="contained"
                    color="default"
                    size="medium"
                    disableElevation
                    className={classes.footerButton}
                    style={{
                        margin: "0px 15px 0px 0px",
                    }}
                    onClick={() => handleClickDialogClose()} >
                    Cancel
                </Button>

                <Button
                    id="documentSaveButton"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    disableElevation
                    disabled={!dealId && true}
                    onClick={() => handleAddDeal()}
                    className={classes.footerButton}
                >
                    Add
                </Button>
            </Grid>
        </Grid>

    );
}
