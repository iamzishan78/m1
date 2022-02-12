// import PersonIcon from "@material-ui/icons/Person";
// import OwnershipIcon from "components/Shared/svgIcons/ownership";
// import LeaseIcon from "components/Shared/svgIcons/lease";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import UnitIcon from "components/Shared/svgIcons/unit";
import FolderIcon from "@material-ui/icons/Folder";
import OperatorIcon from "components/Shared/svgIcons/operator";
import TaxOwnerIcon from "@material-ui/icons/AccountBalance";
import ContactIcon from "@material-ui/icons/Group";
import LayersIcon from "@material-ui/icons/Layers";


export const platformDataInitialData = [
  { index: 0, value: "well", Icon: WellIcon, label: "Wells", shapeGrid: true },
  { index: 1, value: "owner", Icon: TaxOwnerIcon, label: "Tax Owners", shapeGrid: true },
  { index: 2, value: "operator", Icon: OperatorIcon, label: "Operators", shapeGrid: false },

  { index: 3, value: "layer", Icon: LayersIcon, label: "Layer", isLayer: true },
  // { index: 3, value: "lease", Icon: LeaseIcon, label: "Leases" },
  // { index: 4, value: "contacts", Icon: ContactIcon, label: "Contacts", shapeGrid: false },
];


export const userDefinedInitialData = [
  { index: 0, value: "agreement", Icon: FolderIcon, label: "Agreements" },
  { index: 1, value: "tract", Icon: TractIcon, label: "Tracts" },
  { index: 2, value: "unit", Icon: UnitIcon, label: "Units" },
  // { index: 4, value: "contacts", Icon: ContactIcon, label: "Contacts" },
];