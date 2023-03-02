import LeaseIcon from "components/Shared/svgIcons/lease";
import WellIcon from "components/Shared/svgIcons/well";
import UnitIcon from "components/Shared/svgIcons/unit";
import TaxOwnerIcon from "@material-ui/icons/AccountBalance";
import DocumentsIcon from "@material-ui/icons/DescriptionOutlined";
import DealsIcon from "@material-ui/icons/MonetizationOn";
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import ActivitiesIcon from '@material-ui/icons/Event';
import ContactInformationIcon from "components/Shared/svgIcons/ContactPhone";
import ParcelIcon from "components/Shared/svgIcons/tract";

export const contactDetailInitialData = [
  { index: 0, value: "contactInformation", Icon: ContactInformationIcon, label: "Contact Info" },
  { index: 4, value: "unitInterests", Icon: UnitIcon, label: "Unit Interests" },
  { index: 3, value: "wellInterests", Icon: WellIcon, label: "Well Interests" },
  { index: 5, value: "parcelInterests", Icon: ParcelIcon, label: "Tract Interests" },
  { index: 2, value: "taxRollInterests", Icon: TaxOwnerIcon, label: "Tax Roll Interests" },
  { index: 1, value: "activities", Icon: ActivitiesIcon, label: "Activities" },
  { index: 7, value: "documents", Icon: DocumentsIcon, label: "Documents" },
  { index: 6, value: "deals", Icon: DealsIcon, label: "Deals" },
  { index: 8, value: "relatedContacts", Icon: PeopleAltOutlinedIcon, label: "Related Contacts" },
];
