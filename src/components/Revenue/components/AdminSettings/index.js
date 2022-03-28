import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import ListMenu from "components/Shared/ListMenu";
import CodeMapping from "components/Revenue/components/AdminSettings/CodeMapping";
import Validations from "components/Revenue/components/AdminSettings/Validations";

const menuOptions = [
  { label: "Code Mapping", value: "code_mapping" },
  { label: "Validations", value: "validation", disabled: true },
];

const useStyles = makeStyles((theme) => ({
  root: { marginTop: 60, padding: "10px 5px" },
}));

const AdminSettings = () => {
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
      {selectedTab === "code_mapping" && <CodeMapping />}
      {selectedTab === "validation" && <Validations />}
    </div>
  );
};

export default AdminSettings;
