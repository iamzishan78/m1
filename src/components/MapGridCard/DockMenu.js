import React from "react";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import {
    BiDockBottom,
    BiDockLeft,
    BiDockRight,
    BiDockTop,
    BiLinkExternal
} from "react-icons/bi";
import { Grid, IconButton, Box } from "@material-ui/core";

const DockIcons = {
    bottom: BiDockBottom,
    full: BiLinkExternal,
    left: BiDockLeft,
    right: BiDockRight,
    top: BiDockTop
};

const DockIconsArray = Object.keys(DockIcons);

export default function DockMenu({ setSelectedDockMenu }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedDock, selectDock] = React.useState("bottom");
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onIconSelect = (dockName) => {
        selectDock(dockName);
        setSelectedDockMenu(dockName)
        handleClose()
    };

    const SelectedIcon = DockIcons[selectedDock];

    return (
        <div>
            <IconButton
                aria-label="delete"
                aria-controls="fade-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <SelectedIcon fontSize="md" color="rgba(23, 170, 221, 1)" />
            </IconButton>
            <Menu
                id="fade-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
                style={{ marginTop: "35px" }}
            >
                <Box>
                    <Grid
                        container
                        spacing={1}
                        direction="row"
                        justify="center"
                        alignItems="center"
                    >
                        {DockIconsArray.map((dockName) => {
                            const Icon = DockIcons[dockName];
                            return (
                                <Grid item key={dockName}>
                                    <IconButton onClick={() => { onIconSelect(dockName) }}>
                                        <Icon
                                            fontSize="medium"
                                            color={`${selectedDock === dockName ? "rgba(23, 170, 221, 1)" : ""}`}
                                        />
                                    </IconButton>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            </Menu>
        </div>
    );
}
