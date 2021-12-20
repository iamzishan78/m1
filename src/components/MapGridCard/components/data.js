import PersonIcon from "@material-ui/icons/Person";
import WellIcon from "components/Shared/svgIcons/well";
import OwnershipIcon from "components/Shared/svgIcons/ownership";
import LeaseIcon from "components/Shared/svgIcons/lease";
import OperatorIcon from "components/Shared/svgIcons/operator";
import TaxOwnerIcon from "@material-ui/icons/AccountBalance";
import ContactIcon from "@material-ui/icons/Group";

export const platformDataInitialData = [
  { index: 0, value: "well", Icon: WellIcon, label: "Wells", shapeGrid: true },
  { index: 1, value: "owner", Icon: TaxOwnerIcon, label: "Tax Owners", shapeGrid: true },
  { index: 2, value: "operator", Icon: OperatorIcon, label: "Operators", shapeGrid: false },
  // { index: 3, value: "lease", Icon: LeaseIcon, label: "Leases" },
  { index: 4, value: "contacts", Icon: ContactIcon, label: "Contacts", shapeGrid: false },
];
