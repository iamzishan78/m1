import UnitIcon from "components/Shared/svgIcons/unit";
import ContactInformationIcon from "components/Shared/svgIcons/ContactPhone";
import UnitInterestsIcon from "@material-ui/icons/ListAlt";
import TractIcon from "components/Shared/svgIcons/tract";
import TractInterestsIcon from "@material-ui/icons/List";

export const campaignInitialData = [
  { index: 0, value: "contacts", Icon: ContactInformationIcon, label: "Contacts" },
  { index: 1, value: "units", Icon: UnitIcon, label: "Units" },
  { index: 2, value: "unitInterests", Icon: UnitInterestsIcon, label: "Unit Interests" },
  { index: 3, value: "tracts", Icon: TractIcon, label: "Tracts" },
  { index: 4, value: "tractInterests", Icon: TractInterestsIcon, label: "Tract Interests" },
];
