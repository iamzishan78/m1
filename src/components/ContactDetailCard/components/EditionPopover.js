import React, { useEffect, useState } from "react";
import Popover from "@material-ui/core/Popover";
import Box from "@material-ui/core/Box";

export default function EditionPopover(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setAnchorEl(props.anchorEl);
  }, [props.anchorEl]);

  const handleClose = () => {
    props.setAnchorEl(null);
  };

  return (
    <React.Fragment>
      <Popover
        open={anchorEl ? true : false}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={
          props.transformOrigin
            ? props.transformOrigin
            : {
                vertical: "top",
                horizontal: "center",
              }
        }
        onKeyDown={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
      >
        <Box p="8px 8px 0 8px">{props.children}</Box>
      </Popover>
    </React.Fragment>
  );
}
