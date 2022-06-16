// import PersonIcon from "@material-ui/icons/Person";
// import OwnershipIcon from "components/Shared/svgIcons/ownership";
import LeaseIcon from "components/Shared/svgIcons/lease";
import WellIcon from "components/Shared/svgIcons/well";
import TractIcon from "components/Shared/svgIcons/tract";
import UnitIcon from "components/Shared/svgIcons/unit";
import FolderIcon from "@material-ui/icons/Folder";
import OperatorIcon from "components/Shared/svgIcons/operator";
import TaxOwnerIcon from "@material-ui/icons/AccountBalance";
import ContactIcon from "@material-ui/icons/Group";
import LayersIcon from "@material-ui/icons/Layers";

export const contactDetailInitialData = [
  { index: 0, value: "contactInformation", Icon: WellIcon, label: "Contact Information" },
  { index: 1, value: "activities", Icon: TaxOwnerIcon, label: "Activities" },
  { index: 2, value: "taxRollInterest", Icon: OperatorIcon, label: "Tax Roll Interests" },

  { index: 3, value: "wellInterest", Icon: LayersIcon, label: "Well Interests" },
  { index: 4, value: "unitInterests", Icon: LeaseIcon, label: "Unit Interests" },
  { index: 5, value: "parcelInterests", Icon: LeaseIcon, label: "Parcel Interests" },
  { index: 6, value: "deals", Icon: ContactIcon, label: "Deals" },
  { index: 7, value: "documents", Icon: ContactIcon, label: "Documents" },
];
