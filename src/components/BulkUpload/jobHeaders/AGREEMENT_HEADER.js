import { copy } from "components/Shared/functions";
import Agreement from "./AGREEMENT_SHAPE";
import { landColumns } from "./COMMON";
import { removeByLabel } from "./helper";

let agreementsColumns = copy(Agreement)
agreementsColumns = removeByLabel(agreementsColumns, 'State')
agreementsColumns = removeByLabel(agreementsColumns, 'County')

const AgreementHeader = [
    ...agreementsColumns,
    ...copy(landColumns)
];
export default AgreementHeader;