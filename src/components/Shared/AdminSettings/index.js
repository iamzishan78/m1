import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import ListMenu from "components/Shared/ListMenu";
import CodeMapping from "components/Shared/AdminSettings/CodeMapping";
import Validations from "components/Shared/AdminSettings/Validations";
import { useLocation } from "react-router-dom";

const menuOptions = [
  { label: "Code Mapping", value: "code_mapping" },
  { label: "Validations", value: "validation", disabled: true },
];

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 60, padding: "10px 5px" },
}));

const AdminSettings = () => {
  const settingsFor = useLocation().pathname.split('/')[1]

  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(menuOptions[0].value);

  return (
    <div className={classes.root}>
      <ListMenu
        optionStyle={{
          textTransform: "uppercase",
          fontSize: 15,
          margin: "0px 10px",
          padding: "5px 0px",
        }}
        options={menuOptions}
        selectedOption={selectedTab}
        onChange={setSelectedTab}
      />
      {selectedTab === "code_mapping" && <CodeMapping settingsFor={settingsFor} />}
      {selectedTab === "validation" && <Validations />}
    </div>
  );
};

export default AdminSettings;