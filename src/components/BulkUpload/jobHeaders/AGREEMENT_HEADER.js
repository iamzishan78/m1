import { copy } from "components/Shared/functions";
import Agreement from "./AGREEMENT_SHAPE";

let agreementsColumns = copy(Agreement)
const AgreementHeader = [
    ...agreementsColumns,
    {
        label: "Comments",
        mapped_key: "",
        required: false,
        actual_key: "comment"
    },
    {
        label: "Tags",
        mapped_key: "",
        required: false,
        actual_key: "landgrid.tags"
    },

];
export default AgreementHeader;